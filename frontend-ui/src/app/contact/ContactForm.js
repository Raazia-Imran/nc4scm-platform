'use client'

// src/app/contact/ContactForm.js
// -----------------------------------------------------------------------------
// "use client" is required here because this component uses React state
// (useState) and browser event handlers (onSubmit, onChange) — none of
// which can run in a Server Component.
//
// DATA SAFETY / WHY WE DON'T EMAIL DIRECTLY FROM THE BROWSER:
// This form does NOT send email itself. Doing so client-side would require
// embedding SMTP credentials or a private API key directly in the browser
// bundle, where anyone could extract and abuse them. Instead, we POST the
// form data as JSON to an external form-handling gateway (configured via
// NEXT_PUBLIC_FORM_ENDPOINT, e.g. Formspree, Getform, or your own
// serverless function) which is designed to safely accept public submissions
// and forward them to a real inbox.
// -----------------------------------------------------------------------------
import {useState} from 'react'

const initialFormState = {fullName: '', email: '', inquiry: ''}

export default function ContactForm() {
  const [formData, setFormData] = useState(initialFormState)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  function handleChange(event) {
    const {name, value} = event.target
    setFormData((previous) => ({...previous, [name]: value}))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')

    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT

    // Fail clearly instead of silently pretending to succeed if the
    // environment variable was never configured — a common beginner
    // pitfall this guards against.
    if (!endpoint) {
      console.error('NEXT_PUBLIC_FORM_ENDPOINT is not set in .env.local')
      setStatus('error')
      return
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Form endpoint responded with status ${response.status}`)
      }

      setStatus('success')
      setFormData(initialFormState)
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div>
        <h2 className="font-display text-2xl text-ink">Thank You</h2>
        <p className="mt-4 text-sm leading-relaxed text-stone">
          Your inquiry has been received. Our team will respond within 2–3
          business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <h2 className="font-display text-2xl text-ink">Send an Inquiry</h2>

      <label className="mt-8 block text-xs uppercase tracking-widest text-stone">
        Full Name
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="mt-2 w-full border border-stone/40 bg-transparent px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </label>

      <label className="mt-6 block text-xs uppercase tracking-widest text-stone">
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2 w-full border border-stone/40 bg-transparent px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </label>

      <label className="mt-6 block text-xs uppercase tracking-widest text-stone">
        Inquiry
        <textarea
          name="inquiry"
          value={formData.inquiry}
          onChange={handleChange}
          required
          rows={5}
          className="mt-2 w-full border border-stone/40 bg-transparent px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-8 border border-ink px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Submit'}
      </button>

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-700">
          Something went wrong sending your message. Please try again, or
          email us directly at info@nc4scm.org.
        </p>
      )}
    </form>
  )
}
