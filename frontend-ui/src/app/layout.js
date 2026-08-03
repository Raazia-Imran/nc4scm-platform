// src/app/layout.js
// -----------------------------------------------------------------------------
// The Root Layout in Next.js App Router wraps every single page in the
// application. Because it renders once and persists across client-side
// navigations, it's the correct place for anything that should appear on
// every screen: the sticky navigation header and the footer.
//
// This file is a Server Component (no "use client" directive), which means
// it renders on the server with zero client-side JavaScript cost for the
// static nav/footer markup itself — only the interactive bits elsewhere in
// the app (like the contact form) ship their own client-side bundles.
// -----------------------------------------------------------------------------
import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'NC4SCM — National Center for Sustainable Construction Materials',
  description:
    'NC4SCM advances sustainable construction materials research, including LC3 technology, material characterization, and new material development.',
}

// Centralizing the nav links in one array means adding a new top-level page
// later only requires one edit, instead of hunting through JSX.
const NAV_LINKS = [
  {href: '/about', label: 'About'},
  {href: '/services', label: 'Services'},
  {href: '/publications', label: 'Research'},
  {href: '/events', label: 'Events'},
  {href: '/news', label: 'News'},
  {href: '/contact', label: 'Contact'},
]

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink font-sans antialiased">
        {/* ---------------------------------------------------------------
            STICKY HEADER
            `sticky top-0` keeps the nav pinned during scroll; a subtle
            backdrop blur + border keeps it legible over scrolling content
            without a hard drop shadow, matching the "quiet luxury" brief.
        --------------------------------------------------------------- */}
        <header className="sticky top-0 z-50 border-b border-stone/20 bg-paper/90 backdrop-blur-md">
          <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-10">
            <Link href="/" className="font-display text-lg tracking-wide">
              NC4SCM
            </Link>
            <ul className="hidden gap-8 text-sm uppercase tracking-widest text-stone md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* A minimal mobile menu: a plain list that wraps below the logo
                on small screens rather than a hidden hamburger, keeping this
                file free of client-side state for a component this simple. */}
            <ul className="flex gap-4 text-xs uppercase tracking-widest text-stone md:hidden">
              {NAV_LINKS.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        {/* -----------------------------------------------------------------
            FOOTER
            Static institutional info. Kept intentionally simple; if this
            content needs to be editor-managed later, add a "siteSettings"
            singleton document type in Sanity and fetch it here.
        ----------------------------------------------------------------- */}
        <footer className="border-t border-stone/20 py-14">
          <div className="mx-auto grid max-w-content gap-10 px-6 md:grid-cols-3 md:px-10">
            <div>
              <p className="font-display text-lg">NC4SCM</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">
                National Center for Sustainable Construction Materials —
                advancing low-carbon building technologies through rigorous
                research and international partnership.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-stone">Explore</p>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink/80 hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-stone">Contact</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                Materials Research Building
                <br />
                University Campus, Main Road
                <br />
                info@nc4scm.org
              </p>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-content px-6 text-xs text-stone md:px-10">
            © {new Date().getFullYear()} NC4SCM. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  )
}
