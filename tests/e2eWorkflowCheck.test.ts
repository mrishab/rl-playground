import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("E2E Application Workflow & 0 Console Error Verification", () => {
  it("interacts across all pages and features in production bundle with zero console errors", async () => {
    // 1. Locate built production bundle
    const assetsDir = path.resolve(__dirname, "../dist/assets");
    assert.ok(
      fs.existsSync(assetsDir),
      "dist/assets must exist. Run npm run build first.",
    );
    const files = fs.readdirSync(assetsDir);
    const jsBundle = files.find(
      (f) => f.startsWith("index-") && f.endsWith(".js"),
    );
    assert.ok(jsBundle, "Production JS bundle index-*.js must exist");

    // 2. Set up DOM environment via happy-dom
    const { Window } = await import("happy-dom");
    const window = new Window({ url: "http://localhost:3000/RL-Playground/" });
    const document = window.document;

    // Globals polyfill for browser simulation
    global.window = window as any;
    global.document = document as any;
    global.navigator = window.navigator as any;
    global.location = window.location as any;
    global.history = window.history as any;
    global.HTMLFormElement = window.HTMLFormElement as any;
    global.HTMLElement = window.HTMLElement as any;
    global.HTMLInputElement = window.HTMLInputElement as any;
    global.HTMLButtonElement = window.HTMLButtonElement as any;
    global.HTMLSelectElement = window.HTMLSelectElement as any;
    global.HTMLAnchorElement = window.HTMLAnchorElement as any;
    global.customElements = window.customElements as any;
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;
    global.matchMedia = () =>
      ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as any;

    const errorLogs: any[] = [];
    const origError = console.error;
    console.error = (...args: any[]) => {
      errorLogs.push(args);
      origError(...args);
    };

    try {
      const root = document.createElement("div");
      root.id = "root";
      document.body.appendChild(root);

      // Load production bundle
      await import(path.join(assetsDir, jsBundle));

      const waitFor = async (predicate: () => boolean, timeoutMs = 4000) => {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
          if (predicate()) return true;
          await new Promise((r) => setTimeout(r, 50));
        }
        return predicate();
      };

      const getButtons = () => Array.from(document.querySelectorAll("button"));
      const getLinks = () => Array.from(document.querySelectorAll("a"));

      // Wait for React to mount into #root
      await waitFor(
        () => root.innerHTML.length > 500 && getButtons().length > 5,
      );

      // STEP 1: Verify GridWorld Lab loaded
      assert.ok(
        root.innerHTML.length > 500,
        "App should render non-empty HTML",
      );
      const title = document.querySelector("h1")?.textContent;
      assert.ok(
        title?.includes("GridWorld") || root.textContent.includes("GridWorld"),
      );

      // STEP 2: Train episodes in GridWorld
      await waitFor(
        () => !!getButtons().find((b) => b.textContent.includes("Train 50")),
      );
      const train50 = getButtons().find((b) =>
        b.textContent.includes("Train 50"),
      );
      assert.ok(train50, "Train 50 button must exist");
      train50.click();

      const train200 = getButtons().find((b) =>
        b.textContent.includes("Train 200"),
      );
      assert.ok(train200, "Train 200 button must exist");
      train200.click();

      // Step single transition
      const stepTrans = getButtons().find((b) =>
        b.textContent.includes("1-Step Transition"),
      );
      assert.ok(stepTrans, "1-Step Transition button must exist");
      stepTrans.click();

      // Step greedy action
      const stepBtn = getButtons().find(
        (b) =>
          b.textContent.includes("Step") &&
          !b.textContent.includes("Step 1") &&
          !b.textContent.includes("1-Step"),
      );
      stepBtn?.click();

      // Cycle presets
      const cliff = getButtons().find((b) =>
        b.textContent.includes("Cliff Walking"),
      );
      cliff?.click();

      const frozen = getButtons().find((b) =>
        b.textContent.includes("Frozen Lake"),
      );
      frozen?.click();

      const sutton = getButtons().find((b) =>
        b.textContent.includes("Sutton-Barto"),
      );
      sutton?.click();

      const villains = getButtons().find((b) =>
        b.textContent.includes("Smart Villains"),
      );
      villains?.click();

      // Toggle overlay layers
      getButtons()
        .find((b) => b.textContent.includes("Heatmap"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("Arrows"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("Q-Values"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("Visits"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("BFS Path"))
        ?.click();

      // Change algorithms in select
      const algoSelect = document.getElementById("rl-algorithm-select") as any;
      if (algoSelect) {
        algoSelect.value = "sarsa";
        algoSelect.dispatchEvent(new window.Event("change"));
        algoSelect.value = "expected-sarsa";
        algoSelect.dispatchEvent(new window.Event("change"));
        algoSelect.value = "double-q";
        algoSelect.dispatchEvent(new window.Event("change"));
      }

      // STEP 3: Navigate to Bandits Lab
      const banditsLink = getLinks().find((a) =>
        a.textContent.includes("Bandits"),
      );
      assert.ok(banditsLink, "Bandits navigation link must exist");
      banditsLink.click();
      await waitFor(() =>
        document.body.textContent.includes("Multi-Armed Bandits Lab"),
      );

      assert.ok(document.body.textContent.includes("Multi-Armed Bandits Lab"));
      getButtons()
        .find((b) => b.textContent.includes("Step 1"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("Step 50"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("Step 200"))
        ?.click();

      // Switch bandit algorithm
      const banditSelect = document.getElementById(
        "bandit-algorithm-select",
      ) as any;
      if (banditSelect) {
        banditSelect.value = "ucb1";
        banditSelect.dispatchEvent(new window.Event("change"));
        banditSelect.value = "optimistic-initial";
        banditSelect.dispatchEvent(new window.Event("change"));
      }

      // STEP 4: Navigate to Dynamic Programming Lab
      const dpLink = getLinks().find((a) =>
        a.textContent.includes("Dynamic Prog"),
      );
      assert.ok(dpLink, "Dynamic Prog navigation link must exist");
      dpLink.click();
      await waitFor(() =>
        document.body.textContent.includes("Value Iteration Controls"),
      );

      assert.ok(document.body.textContent.includes("Value Iteration Controls"));
      getButtons()
        .find((b) => b.textContent.includes("Step 1 Sweep"))
        ?.click();
      getButtons()
        .find((b) => b.textContent.includes("Run to Convergence"))
        ?.click();

      // STEP 5: Navigate to Agents
      const agentsLink = getLinks().find((a) =>
        a.textContent.includes("Agents"),
      );
      assert.ok(agentsLink, "Agents navigation link must exist");
      agentsLink.click();
      await waitFor(() =>
        document.body.textContent.includes("Saved Policies & Agents"),
      );
      assert.ok(document.body.textContent.includes("Saved Policies & Agents"));

      // STEP 6: Navigate to Theory & Quiz
      const theoryLink = getLinks().find((a) =>
        a.textContent.includes("Theory & Quiz"),
      );
      assert.ok(theoryLink, "Theory & Quiz navigation link must exist");
      theoryLink.click();
      await waitFor(() =>
        document.body.textContent.includes("Undergraduate Mastery Quiz"),
      );

      assert.ok(
        document.body.textContent.includes("Markov Decision Processes"),
      );
      assert.ok(
        document.body.textContent.includes("Undergraduate Mastery Quiz"),
      );

      // Select quiz answers
      const quizButtons = getButtons().filter(
        (b) =>
          b.textContent.includes("off-policy using max_a") ||
          b.textContent.includes("exploration mistakes during training") ||
          b.textContent.includes("decouples selection and evaluation") ||
          b.textContent.includes("Optimism in the face of uncertainty") ||
          b.textContent.includes("Full knowledge of the environment"),
      );
      assert.equal(
        quizButtons.length,
        5,
        "Must find all 5 correct quiz answer options",
      );
      quizButtons.forEach((b) => b.click());
      await new Promise((r) => setTimeout(r, 50));

      const submitBtn = getButtons().find((b) =>
        b.textContent.includes("Submit Answers"),
      );
      assert.ok(submitBtn, "Submit Answers button must exist");
      submitBtn.click();
      await new Promise((r) => setTimeout(r, 50));

      assert.ok(
        document.body.textContent.includes("Score: 5 / 5"),
        "Quiz score must be 5 / 5",
      );

      // STEP 7: Assert ZERO console errors across entire application
      assert.equal(
        errorLogs.length,
        0,
        `Expected 0 console errors, but got ${errorLogs.length}: ${JSON.stringify(errorLogs)}`,
      );
    } finally {
      console.error = origError;
    }
  });
});
