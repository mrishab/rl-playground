import "./commands";

let consoleErrors: string[] = [];

Cypress.on("window:before:load", (win) => {
  consoleErrors = [];
  const orig = win.console.error;
  win.console.error = (...args: unknown[]) => {
    consoleErrors.push(args.map(String).join(" "));
    orig.apply(win.console, args);
  };
});

afterEach(() => {
  expect(
    consoleErrors,
    "Expected zero console.error calls during test execution: " +
      consoleErrors.join(" | "),
  ).to.have.length(0);
});
