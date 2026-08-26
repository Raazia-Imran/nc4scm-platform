"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
const blank = {
  name: "",
  email: "",
  organization: "",
  enquiryType: "General",
  service: "",
  message: "",
};
const DEFAULT_ENDPOINT =
  "https://formsubmit.co/ajax/nc4scm@cloud.neduet.edu.pk";

export default function ContactForm({ successMessage }) {
  const params = useSearchParams();
  const [form, setForm] = useState({
    ...blank,
    service: params.get("service") || "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const change = (e) =>
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || DEFAULT_ENDPOINT;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          _subject: "NC4SCM website enquiry: " + form.enquiryType,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!response.ok) throw new Error();
      setStatus("success");
      setForm(blank);
    } catch {
      setStatus("error");
      setError(
        "The website email service is awaiting activation. Please email the centre directly for now.",
      );
    }
  }
  if (status === "success")
    return (
      <div className="rounded-[2rem] bg-mint p-9">
        <p className="eyebrow text-clay">Message received</p>
        <h2 className="mt-5 font-display text-4xl text-forest">
          Thank you for reaching out.
        </h2>
        <p className="mt-5 leading-7 text-carbon/65">
          {successMessage ||
            "The NC4SCM team will respond within 2–3 working days."}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-link mt-7 inline-flex"
        >
          Send another message <span>↗</span>
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
      <Field
        label="Name"
        name="name"
        value={form.name}
        onChange={change}
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={change}
        required
      />
      <Field
        label="Organization"
        name="organization"
        value={form.organization}
        onChange={change}
      />
      <label className="field-label">
        Enquiry type
        <select
          name="enquiryType"
          value={form.enquiryType}
          onChange={change}
          className="field-input"
        >
          {["Consultancy", "Collaboration", "Media", "General"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      {form.service && (
        <Field
          label="Selected service"
          name="service"
          value={form.service}
          onChange={change}
        />
      )}
      <label className="field-label sm:col-span-2">
        Message
        <textarea
          name="message"
          value={form.message}
          onChange={change}
          required
          rows={6}
          className="field-input resize-y"
        />
      </label>
      <div className="sm:col-span-2">
        <button
          disabled={status === "submitting"}
          className="button button-dark"
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"} <span>↗</span>
        </button>
        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-forest/15 bg-sage p-4 text-sm text-forest"><p>{error}</p><a className="mt-2 inline-flex font-semibold underline underline-offset-4" href="mailto:nc4scm@cloud.neduet.edu.pk">Email NC4SCM directly ↗</a></div>
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
