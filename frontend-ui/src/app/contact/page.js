// src/app/contact/page.js
// -----------------------------------------------------------------------------
// The Contact Interface: a minimalist, split-screen layout. The left side is
// static institutional info (a Server Component, no JS needed). The right
// side is the interactive form, which is intentionally isolated into its
// own "use client" component (ContactForm) below in the same file's
// sibling — kept in one file here since the split is small enough not to
// warrant its own module, but still cleanly separated by component boundary
// so only the form itself ships client-side JavaScript.
// -----------------------------------------------------------------------------
import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact — NC4SCM',
}

export default function ContactPage() {
  return (
    <section className="grid min-h-[70vh] md:grid-cols-2">
      {/* ------------------------------------------------------------------
          LEFT: INSTITUTIONAL DETAILS
      ------------------------------------------------------------------ */}
      <div className="flex flex-col justify-center bg-ink px-6 py-24 text-paper md:px-16">
        <h1 className="font-display text-4xl leading-tight">Get in Touch</h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">
          For research collaborations, technical support inquiries, or media
          requests, reach out using the form or the details below.
        </p>

        <div className="mt-12 space-y-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-paper/50">Address</p>
            <p className="mt-2 leading-relaxed text-paper/90">
              Materials Research Building
              <br />
              University Campus, Main Road
              <br />
              City, Country
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-paper/50">Email</p>
            <p className="mt-2 text-paper/90">info@nc4scm.org</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-paper/50">Phone</p>
            <p className="mt-2 text-paper/90">+1 (000) 000-0000</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          RIGHT: THE INTERACTIVE FORM
      ------------------------------------------------------------------ */}
      <div className="flex flex-col justify-center bg-paper px-6 py-24 md:px-16">
        <ContactForm />
      </div>
    </section>
  )
}
