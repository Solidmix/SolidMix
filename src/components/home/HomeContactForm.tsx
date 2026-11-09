"use client";

import { useState, type FormEvent } from "react";
import { contactBlock } from "@/content/home";
import { sendEnquiry } from "@/lib/enquiry";

export function HomeContactForm() {
  const [values, setValues] = useState({ name: "", contact: "", email: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendEnquiry({
      Name: values.name,
      Contact: values.contact,
      Email: values.email,
      Message: values.message,
    });
  };

  const field =
    "w-full rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink placeholder:text-grey-2 focus:border-primary focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
      <input
        type="email"
        required
        aria-label={contactBlock.form.fields.email}
        placeholder={contactBlock.form.fields.email}
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        className={field}
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
        className="w-full rounded-md bg-secondary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-secondary/90"
      >
        {contactBlock.form.submit}
      </button>
      <p className="text-xs text-grey-2">Your enquiry opens in WhatsApp so we can reply quickly.</p>
    </form>
  );
}
