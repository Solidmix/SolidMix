"use client";

import { useState, type FormEvent } from "react";
import { contactBlock } from "@/content/home";
import {
  sendEnquiry,
  validateEmail,
  validateRequired,
  isHoneypotFilled,
  HONEYPOT_FIELD,
} from "@/lib/enquiry";
import { AreaSelect } from "@/components/AreaSelect";
import { Honeypot } from "@/components/Honeypot";
import { OTHER_AREA_OPTION } from "@/lib/areas";

export function HomeContactForm() {
  const [values, setValues] = useState({
    name: "",
    contact: "",
    email: "",
    area: "",
    otherArea: "",
    message: "",
    [HONEYPOT_FIELD]: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isHoneypotFilled(values[HONEYPOT_FIELD])) return;

    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(values.email, true);
    if (emailError) nextErrors.email = emailError;
    const areaError = validateRequired(values.area);
    if (areaError) nextErrors.area = areaError;
    if (values.area === OTHER_AREA_OPTION) {
      const otherError = validateRequired(values.otherArea);
      if (otherError) nextErrors.otherArea = otherError;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    sendEnquiry("Home contact", "/", {
      Name: values.name,
      Contact: values.contact,
      Email: values.email,
      "Your Area": values.area === OTHER_AREA_OPTION ? values.otherArea : values.area,
      Message: values.message,
    });
    setSubmitted(true);
  };

  const field =
    "w-full rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink placeholder:text-grey-2 focus:border-primary focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Honeypot
        name={HONEYPOT_FIELD}
        value={values[HONEYPOT_FIELD]}
        onChange={(v) => setValues((s) => ({ ...s, [HONEYPOT_FIELD]: v }))}
      />
      <input
        type="text"
        aria-label={contactBlock.form.fields.name}
        placeholder={contactBlock.form.fields.name}
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        className={field}
      />
      <input
        type="tel"
        aria-label={contactBlock.form.fields.contact}
        placeholder={contactBlock.form.fields.contact}
        value={values.contact}
        onChange={(e) => setValues((v) => ({ ...v, contact: e.target.value }))}
        className={field}
      />
      <div>
        <input
          type="email"
          aria-label={contactBlock.form.fields.email}
          placeholder={contactBlock.form.fields.email}
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className={field}
        />
        {errors.email && <p className="mt-1 text-sm text-primary">{errors.email}</p>}
      </div>
      <AreaSelect
        area={values.area}
        onAreaChange={(v) => setValues((s) => ({ ...s, area: v }))}
        otherArea={values.otherArea}
        onOtherAreaChange={(v) => setValues((s) => ({ ...s, otherArea: v }))}
        error={errors.area}
        otherError={errors.otherArea}
      />
      <textarea
        rows={4}
        aria-label={contactBlock.form.fields.message}
        placeholder={contactBlock.form.fields.message}
        value={values.message}
        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        className={`${field} resize-y`}
      />
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3.5 text-xl font-medium text-white transition-colors hover:bg-primary/90"
      >
        {contactBlock.form.submit}
      </button>
      {submitted ? (
        <p className="text-sm font-semibold text-secondary">
          Your enquiry has opened in WhatsApp - please press Send there.
        </p>
      ) : (
        <p className="text-xs text-grey-2">Your enquiry opens in WhatsApp so we can reply quickly.</p>
      )}
    </form>
  );
}
