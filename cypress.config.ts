import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl:
      process.env.CYPRESS_BASE_URL || "http://localhost:3000/rl-playground/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1440,
    viewportHeight: 1200,
    video: false,
    screenshotOnRunFailure: false,
  },
});
