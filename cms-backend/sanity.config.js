// sanity.config.js
// -----------------------------------------------------------------------------
// This is the root configuration file for Sanity Studio v3. Sanity Studio is
// a React application that runs entirely in the browser and gives editors a
// friendly UI to create/edit the content that our Next.js frontend will later
// fetch over Sanity's Content API (GROQ / CDN).
//
// WHAT HAPPENS HERE:
// 1. We register our content models (schemaTypes) so the Studio knows what
//    document types exist (Team Member, Partner, Service, Publication, etc).
// 2. We wire up two plugins:
//      - deskTool: renders the default content-editing UI (the tree of
//        document lists you see on the left of the Studio).
//      - visionTool: an in-Studio playground for testing GROQ queries before
//        you use them in the frontend.
// 3. We read projectId/dataset from environment variables so the same code
//    can point at different Sanity projects (e.g. staging vs production)
//    without ever hard-coding secrets into source control.
// -----------------------------------------------------------------------------
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'NC4SCM Content Studio',

  // These come from environment variables so the Studio can be safely
  // committed to source control without leaking project-specific values.
  // Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in a local
  // `.env` file inside cms-backend/ (Sanity automatically loads variables
  // prefixed with SANITY_STUDIO_).
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'dxinqb51',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    deskTool(),
    // visionTool lets you run raw GROQ queries inside the Studio UI, which
    // is invaluable when designing the queries our Next.js pages will use.
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
