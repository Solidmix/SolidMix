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

const TOPICS = ["About Construction", "About Renovation", "About Architecture"];

export function AppointmentForm() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    date: "",
    time: "",
    topic: TOPICS[0],
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

    sendEnquiry("Appointment", "/appointments/", {
      "First Name": values.firstName,
      "Last Name": values.lastName,
      Email: values.email,
      "Mobile Number": values.mobile,
      Date: values.date,
      Time: values.time,
      Topic: values.topic,
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
      <div className="grid gap-4 sm:grid-cols-2">
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
          type="tel"
          aria-label="Mobile Number"
          placeholder="Mobile Number"
          value={values.mobile}
          onChange={(e) => setValues((v) => ({ ...v, mobile: e.target.value }))}
          className={field}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="date"
          aria-label="Select Date"
          value={values.date}
          onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
          className={field}
        />
        <input
          type="time"
          aria-label="Select Time"
          value={values.time}
          onChange={(e) => setValues((v) => ({ ...v, time: e.target.value }))}
          className={field}
        />
      </div>
      <select
        aria-label="Topic"
        value={values.topic}
        onChange={(e) => setValues((v) => ({ ...v, topic: e.target.value }))}
        className={field}
      >
        {TOPICS.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Submit Now
      </button>
      {submitted && (
        <p className="text-sm font-semibold text-secondary">
          Your enquiry has opened in WhatsApp - please press Send there.
        </p>
      )}
    </form>
  );
}
