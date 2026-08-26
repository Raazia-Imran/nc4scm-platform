// tailwind.config.js
// -----------------------------------------------------------------------------
// Tailwind scans every file matched by `content` for class names, so it can
// tree-shake unused styles out of the final production CSS bundle. The
// `theme.extend` block layers our "quiet-luxury" design tokens (a restrained
// neutral palette + a serif display font) on top of Tailwind's defaults
// without discarding the defaults entirely.
// -----------------------------------------------------------------------------
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // A restrained, near-black/near-white palette with a single muted
        // accent (a deep clay-green) evokes "sustainable materials" without
        // resorting to cliché bright greens.
        ink: "#14140f",
        paper: "#faf9f6",
        stone: "#8a8677",
        accent: "#5c6d5e",
        forest: "#123d2f",
        moss: "#245b45",
        mint: "#dcecdf",
        sage: "#e8eee6",
        ivory: "#f7f5ef",
        limestone: "#e7e4dc",
        clay: "#a85f42",
        carbon: "#18211d",
        teal: "#236b70",
        sky: "#dfeaf3",
        cobalt: "#176fa6",
        sun: "#f2d77b",
      },
      fontFamily: {
        display: [
          "Iowan Old Style",
          "Baskerville",
          "Georgia",
          "ui-serif",
          "serif",
        ],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: { float: "0 18px 60px rgba(18,61,47,.14)" },
    },
  },
  plugins: [],
};
