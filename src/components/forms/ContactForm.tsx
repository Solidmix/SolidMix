"use client";

import { useState, type FormEvent } from "react";
import {
  sendEnquiry,
  validateEmail,
  validateIndianMobile,
  validateRequired,
  isHoneypotFilled,
  HONEYPOT_FIELD,
} from "@/lib/enquiry";
import { AreaSelect } from "@/components/AreaSelect";
import { Honeypot } from "@/components/Honeypot";
import { OTHER_AREA_OPTION } from "@/lib/areas";

const field =
  "w-full rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink placeholder:text-grey-2 focus:border-primary focus:outline-none";

export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    contact: "",
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
    const contactError = validateIndianMobile(values.contact, true);
    if (contactError) nextErrors.contact = contactError;
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

    sendEnquiry("Contact", "/ready-mix-concrete-contact-in-raipur/", {
      Name: values.name,
      Email: values.email,
      "Contact No.": values.contact,
      "Your Area": values.area === OTHER_AREA_OPTION ? values.otherArea : values.area,
      Message: values.message,
    });
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Honeypot
        name={HONEYPOT_FIELD}
        value={values[HONEYPOT_FIELD]}
        onChange={(v) => setValues((s) => ({ ...s, [HONEYPOT_FIELD]: v }))}
      />
      <input
        type="text"
        aria-label="Name"
        placeholder="Name"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        className={field}
      />
      <div>
        <input
          type="email"
          aria-label="Email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className={field}
        />
        {errors.email && <p className="mt-1 text-sm text-primary">{errors.email}</p>}
      </div>
      <div>
        <input
          type="tel"
          aria-label="Contact No."
          placeholder="Contact No."
          value={values.contact}
          onChange={(e) => setValues((v) => ({ ...v, contact: e.target.value }))}
          className={field}
        />
        {errors.contact && <p className="mt-1 text-sm text-primary">{errors.contact}</p>}
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
        aria-label="Message"
        placeholder="Message"
        value={values.message}
        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        className={`${field} resize-y`}
      />
      <button
        type="submit"
        className="w-full rounded-md bg-secondary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-secondary/90"
      >
        Send
      </button>
      {submitted && (
        <p className="text-sm font-semibold text-secondary">
          Your enquiry has opened in WhatsApp - please press Send there.
        </p>
      )}
    </form>
  );
}
