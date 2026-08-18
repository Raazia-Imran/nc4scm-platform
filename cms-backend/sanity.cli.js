// sanity.cli.js
// -----------------------------------------------------------------------------
// This file tells the Sanity CLI (the command-line tool, separate from the
// Studio app itself) which project/dataset to talk to when you run commands
// like `sanity deploy` or `sanity dataset export`. It is intentionally kept
// separate from sanity.config.js because the CLI runs in a Node context
// before any React/Studio code is loaded.
// -----------------------------------------------------------------------------
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
