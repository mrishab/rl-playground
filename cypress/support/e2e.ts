import "./commands";

// Fail tests on uncaught console errors
Cypress.on("window:before:load", (win) => {
  cy.spy(win.console, "error").as("consoleError");
});
