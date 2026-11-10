"use client";

import { useState, type FormEvent } from "react";
import {
  sendEnquiry,
  validateEmail,
  isHoneypotFilled,
  HONEYPOT_FIELD,
} from "@/lib/enquiry";
import { Honeypot } from "@/components/Honeypot";

const field =
  "w-full rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink placeholder:text-grey-2 focus:border-primary focus:outline-none";

export function CareersForm() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    comments: "",
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
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    sendEnquiry("Careers", "/careers/", {
      "First Name": values.firstName,
      "Last Name": values.lastName,
      Email: values.email,
      Subject: values.subject,
      Comments: values.comments,
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
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          aria-label="First Name"
          placeholder="First Name"
          value={values.firstName}
          onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
          className={field}
        />
        <input
          type="text"
          aria-label="Last Name"
          placeholder="Last Name"
          value={values.lastName}
          onChange={(e) => setValues((v) => ({ ...v, lastName: e.target.value }))}
          className={field}
        />
      </div>
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
      <input
        type="text"
        aria-label="Subject"
        placeholder="Subject"
        value={values.subject}
        onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
        className={field}
      />
      <textarea
        rows={4}
        aria-label="Comments"
        placeholder="Comments"
        value={values.comments}
        onChange={(e) => setValues((v) => ({ ...v, comments: e.target.value }))}
        className={`${field} resize-y`}
      />
      <p className="text-sm text-grey">
        Please email your resume to{" "}
        <a href="mailto:info@solidmixrmc.com" className="text-primary underline underline-offset-2">
          info@solidmixrmc.com
        </a>
        .
      </p>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3.5 text-xl font-medium text-white transition-colors hover:bg-primary/90"
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
