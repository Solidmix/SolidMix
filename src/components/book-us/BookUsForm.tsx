'use client';

import { useMemo, useState } from 'react';
import { plants } from '@/data/plants';
import {
  topics,
  customerCategories,
  grades,
  GRADE_OTHER,
  GRADE_NOT_SURE,
  pumpOptions,
  PLANT_NOT_SURE,
  AREA_OTHER,
} from '@/data/bookingOptions';
import { mainPhone, mainPhoneHref } from '@/data/plants';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const field =
  'w-full min-h-[44px] rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink placeholder:text-grey-2 focus:border-primary focus:outline-none';
const label = 'mb-1 block text-sm font-medium text-ink';
const err = 'mt-1 text-sm text-primary';
const blockHeading = 'text-lg font-semibold text-primary border-b border-grey-line pb-2';

// Shared look for the "big button" radio groups (topic, pump). Real native
// radio inputs (keyboard + screen-reader accessible out of the box) with the
// input visually hidden and the label styled as the button.
function RadioButtonGroup({
  legendText,
  name,
  options,
  value,
  onChange,
  columns,
}: {
  legendText: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  columns: string;
}) {
  return (
    <fieldset>
      <legend className={label}>{legendText}</legend>
      <div className={`grid gap-3 ${columns}`}>
        {options.map((opt) => {
          const id = `${name}-${opt.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
          const checked = value === opt;
          return (
            <label
              key={opt}
              htmlFor={id}
              className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-md border px-3 py-3 text-center text-sm font-semibold transition-colors ${
                checked ? 'border-primary bg-primary text-white' : 'border-grey-line bg-white text-ink hover:border-primary'
              }`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function BookUsForm() {
  const [topic, setTopic] = useState<string>(topics[0]);
  const [othersText, setOthersText] = useState('');
  const [category, setCategory] = useState('');
  const [grade, setGrade] = useState('');
  const [gradeText, setGradeText] = useState('');
  const [plantId, setPlantId] = useState('');
  const [area, setArea] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locNote, setLocNote] = useState('');
  const [pump, setPump] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pourDate, setPourDate] = useState('');
  const [pourTime, setPourTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [designation, setDesignation] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [leadId, setLeadId] = useState('');

  const plant = useMemo(() => plants.find((p) => p.id === plantId), [plantId]);
  const isConcrete = topic === 'Ready Mix Concrete';

  // Neutral status line. Uses plants.ts only: no promises, times, charges or distances.
  const feasibility = useMemo(() => {
    if (!plant || !area) return '';
    const listed = plant.areaGroups.some((g) => g.areas.includes(area));
    return listed
      ? `This area is on our served list for ${plant.name}. Our team will confirm availability for your site.`
      : "We'll check this location and get back to you.";
  }, [plant, area]);

  function useMyLocation() {
    setLocNote('');
    if (!('geolocation' in navigator)) {
      setLocNote('Location is not available on this device. Please type your site location.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocNote('Location added. You can still type the site address below.');
      },
      () => setLocNote('We could not get your location. Please type your site location.'),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/book-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          othersText: topic === 'Others' ? othersText : '',
          category,
          grade: isConcrete ? grade : '',
          gradeText: isConcrete && grade === GRADE_OTHER ? gradeText : '',
          plantId: plantId || PLANT_NOT_SURE,
          area: plantId && plantId !== PLANT_NOT_SURE ? area : '',
          siteLocation,
          lat: coords?.lat,
          lng: coords?.lng,
          pump,
          quantity,
          pourDate,
          pourTime,
          name,
          phone,
          email,
          organisation,
          designation,
          message,
          website,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please call us.');
        return;
      }
      setLeadId(json.leadId);
      // No personal data in the dataLayer. Lead ID and plain choices only.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'generate_lead',
        form_name: 'book_us',
        lead_id: json.leadId,
        customer_category: category,
        pump_requirement: pump,
        plant: plantId || PLANT_NOT_SURE,
        delivery_area: area || '',
      });
    } catch {
      setError('Network problem. Please try again or call us.');
    } finally {
      setBusy(false);
    }
  }

  if (leadId) {
    return (
      <div role="status" className="rounded-md border border-secondary bg-tint-cyan-2 p-5">
        <h3 className="text-lg font-semibold text-secondary">Thank you. We have your request.</h3>
        <p className="mt-2 text-ink">
          Your Lead ID is <strong>{leadId}</strong>. Please quote it when you call.
        </p>
        <p className="mt-2 text-ink">Our team will contact you.</p>
        <a
          href={mainPhoneHref}
          className="mt-4 inline-block min-h-[44px] rounded-md bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
        >
          Call {mainPhone}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate={false}>
      {/* Honeypot: hidden from people, bots fill it */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {/* Block 1: About you */}
      <div className="space-y-4">
        <h3 className={blockHeading}>About you</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="name">Your name *</label>
            <input id="name" className={field} autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="phone">Mobile number *</label>
            <input id="phone" className={field} type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" className={field} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="org">Organisation name</label>
            <input id="org" className={field} autoComplete="organization" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="desig">Designation</label>
            <input id="desig" className={field} autoComplete="organization-title" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Block 2: What you need */}
      <div className="space-y-4">
        <h3 className={blockHeading}>What you need</h3>

        <RadioButtonGroup
          legendText="What is this about?"
          name="topic"
          options={topics}
          value={topic}
          onChange={setTopic}
          columns="grid-cols-2"
        />

        {topic === 'Others' && (
          <div>
            <label className={label} htmlFor="others">Tell us what you expect</label>
            <textarea
              id="others"
              className={field}
              rows={4}
              minLength={10}
              required
              value={othersText}
              onChange={(e) => setOthersText(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className={label} htmlFor="category">I am a</label>
          <select id="category" className={field} value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select</option>
            {customerCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {isConcrete && (
          <div>
            <label className={label} htmlFor="grade">Grade</label>
            <select id="grade" className={field} value={grade} onChange={(e) => setGrade(e.target.value)} required>
              <option value="">Select grade</option>
              {grades.map((g) => (
                <option key={g}>{g}</option>
              ))}
              <option>{GRADE_OTHER}</option>
              <option>{GRADE_NOT_SURE}</option>
            </select>
            <p className="mt-1 text-sm text-grey-2">Our team will confirm the grade and mix for your project.</p>
            {grade === GRADE_OTHER && (
              <div className="mt-3">
                <label className={label} htmlFor="gradeText">Write the grade you need</label>
                <input id="gradeText" className={field} required value={gradeText} onChange={(e) => setGradeText(e.target.value)} />
              </div>
            )}
          </div>
        )}

        <RadioButtonGroup
          legendText="Pump needed?"
          name="pump"
          options={pumpOptions}
          value={pump}
          onChange={setPump}
          columns="grid-cols-2 sm:grid-cols-4"
        />
      </div>

      {/* Block 3: Your site */}
      <div className="space-y-4">
        <h3 className={blockHeading}>Your site</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="plant">Nearest plant</label>
            <select
              id="plant"
              className={field}
              value={plantId}
              onChange={(e) => {
                setPlantId(e.target.value);
                setArea('');
              }}
              required
            >
              <option value="">Select plant</option>
              {plants.map((p, i) => (
                <option key={p.id} value={p.id}>{`Plant ${i + 1}: ${p.name.replace('SolidMix RMC Plant, ', '')}`}</option>
              ))}
              <option value={PLANT_NOT_SURE}>Not sure</option>
            </select>
            <p className="mt-1 text-sm text-grey-2">Choose the plant nearest your site. Our team will confirm availability.</p>
          </div>

          {plant && (
            <div>
              <label className={label} htmlFor="area">Your area</label>
              <select id="area" className={field} value={area} onChange={(e) => setArea(e.target.value)} required>
                <option value="">Your area</option>
                {plant.areaGroups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.areas.map((a) => (
                      <option key={g.label + a}>{a}</option>
                    ))}
                  </optgroup>
                ))}
                <option>{AREA_OTHER}</option>
              </select>
            </div>
          )}
        </div>

        {feasibility && (
          <p role="status" className="rounded-md border border-grey-line bg-tint-cyan-2 px-3 py-2 text-sm text-ink">
            {feasibility}
          </p>
        )}

        <div>
          <label className={label} htmlFor="site">
            Site location{plantId === PLANT_NOT_SURE || area === AREA_OTHER ? '' : ' (optional)'}
          </label>
          <div className="flex gap-2">
            <input
              id="site"
              className={field}
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
              placeholder="Address or landmark"
              required={plantId === PLANT_NOT_SURE || area === AREA_OTHER}
            />
            <button
              type="button"
              onClick={useMyLocation}
              className="min-h-[44px] shrink-0 rounded-md border border-primary px-3 text-sm font-medium text-primary"
            >
              Use my location
            </button>
          </div>
          {locNote && <p className="mt-1 text-sm text-grey-2">{locNote}</p>}
        </div>
      </div>

      {/* Block 4: When and how much (optional) */}
      <div className="space-y-4">
        <h3 className={blockHeading}>When and how much (optional)</h3>

        <div>
          <label className={label} htmlFor="qty">How much (m³)</label>
          <input id="qty" className={field} inputMode="decimal" placeholder="e.g. 30" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <fieldset>
          <legend className={label}>Pour date and time</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-grey-2" htmlFor="date">Date</label>
              <input id="date" type="date" className={field} value={pourDate} onChange={(e) => setPourDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-grey-2" htmlFor="time">Time</label>
              <input id="time" type="time" className={field} value={pourTime} onChange={(e) => setPourTime(e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div>
          <label className={label} htmlFor="msg">Anything else?</label>
          <textarea id="msg" className={`${field} resize-y`} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
      </div>

      {error && <p role="alert" className={err}>{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="min-h-[48px] w-full rounded-md bg-secondary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-secondary/90 disabled:opacity-60 sm:w-auto"
      >
        {busy ? 'Sending...' : 'Book Us'}
      </button>
    </form>
  );
}
