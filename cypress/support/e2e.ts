import "./commands";

// Fail tests on uncaught console errors
Cypress.on("window:before:load", (win) => {
  if (!("restore" in win.console.error)) {
    cy.spy(win.console, "error").as("consoleError");
  }
});
