"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/app/components/ContentProvider";
const blank = {
  name: "",
  email: "",
  organization: "",
  enquiryType: "General",
  service: "",
  message: "",
  website: "",
};
export default function ContactForm({
  successMessage,
  recipientEmail,
  services = [],
}) {
  const text = useContent(),
    params = useSearchParams();
  const selected = services.find(
    (service) => service.slug?.current === params.get("service"),
  );
  const [form, setForm] = useState({
    ...blank,
    service: selected?.title || "",
  });
  const [status, setStatus] = useState("idle");
  const change = (e) =>
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    if (form.website) return;
    setStatus("submitting");
    const endpoint =
      process.env.NEXT_PUBLIC_FORM_ENDPOINT ||
      (recipientEmail ? `https://formsubmit.co/ajax/${recipientEmail}` : null);
    try {
      if (!endpoint) throw new Error("Missing contact endpoint");
      const { website, ...message } = form;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...message,
          _subject: "Website enquiry: " + form.enquiryType,
          _template: "table",
        }),
      });
      const result = await response.json();
      if (
        !response.ok ||
        result.success === false ||
        result.success === "false" ||
        result.error
      )
        throw new Error("Delivery failed");
      setStatus("success");
      setForm({ ...blank });
    } catch {
      setStatus("error");
    }
  }
  if (status === "success")
    return (
      <div role="status" className="rounded-[2rem] bg-mint p-6 sm:p-9">
        <p className="text-lg leading-8 text-forest">{successMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-link mt-7 inline-flex"
        >
          {text.sendAnother}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      className="grid gap-6 sm:grid-cols-2"
      aria-busy={status === "submitting"}
    >
      <Field
        label={text.nameLabel}
        name="name"
        value={form.name}
        onChange={change}
        required
        autoComplete="name"
        maxLength={160}
      />
      <Field
        label={text.emailLabel}
        name="email"
        type="email"
        value={form.email}
        onChange={change}
        required
        autoComplete="email"
        maxLength={254}
      />
      <Field
        label={text.organizationLabel}
        name="organization"
        value={form.organization}
        onChange={change}
        autoComplete="organization"
        maxLength={200}
      />
      <label className="field-label">
        {text.enquiryType}
        <select
          name="enquiryType"
          value={form.enquiryType}
          onChange={change}
          className="field-input"
        >
          {[
            ["Consultancy", "consultancy"],
            ["Collaboration", "collaboration"],
            ["Media", "media"],
            ["General", "general"],
          ].map(([value, key]) => (
            <option key={value} value={value}>
              {text[key]}
            </option>
          ))}
        </select>
      </label>
      {form.service && (
        <Field
          label={text.selectedService}
          name="service"
          value={form.service}
          onChange={change}
          maxLength={200}
        />
      )}
      <label className="field-label sm:col-span-2">
        {text.message}
        <textarea
          name="message"
          value={form.message}
          onChange={change}
          required
          maxLength={10000}
          rows={6}
          className="field-input resize-y"
        />
      </label>
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={change}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
      />
      <div className="sm:col-span-2">
        <button
          disabled={status === "submitting"}
          className="button button-dark"
        >
          {status === "submitting" ? text.sending : text.sendEnquiry}
          <span aria-hidden="true">↗</span>
        </button>
        {status === "error" && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-forest/15 bg-sage p-4 text-sm text-forest"
          >
            <p>{text.formError}</p>
            {recipientEmail && (
              <a
                className="mt-2 inline-flex font-semibold underline underline-offset-4"
                href={`mailto:${recipientEmail}`}
              >
                {text.emailDirect} ↗
              </a>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
function Field({ label, ...props }) {
  return (
    <label className="field-label">
      {label}
      <input {...props} className="field-input" />
    </label>
  );
}
