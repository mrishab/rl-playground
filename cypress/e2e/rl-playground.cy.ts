describe("RL Playground - Comprehensive End-to-End Test Suite", () => {
  beforeEach(() => {
    // Intercept and assert 0 console errors
    cy.visit("", {
      onBeforeLoad(win) {
        cy.spy(win.console, "error").as("consoleError");
      },
    });
  });

  afterEach(() => {
    // Ensure 0 console.error calls across all user interactions
    cy.get("@consoleError").should("not.be.called");
  });

  describe("Application Shell & Navigation", () => {
    it("renders the site header, title, and brand logo", () => {
      cy.contains("RL Playground").should("be.visible");
      cy.get("header").should("be.visible");
      cy.get("header nav").should("contain", "GridWorld");
      cy.get("header nav").should("contain", "Bandits");
      cy.get("header nav").should("contain", "Dynamic Prog");
      cy.get("header nav").should("contain", "Agents");
      cy.get("header nav").should("contain", "Theory & Quiz");
    });

    it("toggles light and dark themes smoothly without errors", () => {
      cy.get("button[aria-label*='theme' i], button[title*='theme' i]")
        .first()
        .click();
      cy.get("html").should("satisfy", ($el: JQuery<HTMLElement>) => {
        return (
          $el.hasClass("dark") ||
          $el.hasClass("light") ||
          $el.attr("data-theme") !== undefined
        );
      });
    });

    it("navigates across all primary tabs", () => {
      cy.contains("Bandits").click();
      cy.url().should("include", "/bandits");
      cy.contains("Multi-Armed Bandits Lab").should("be.visible");

      cy.contains("Dynamic Prog").click();
      cy.url().should("include", "/dp");
      cy.contains("Dynamic Programming").should("be.visible");

      cy.contains("Agents").click();
      cy.url().should("include", "/agents");
      cy.contains("Saved Policies & Agents").should("be.visible");

      cy.contains("Theory & Quiz").click();
      cy.url().should("include", "/theory");
      cy.contains("Undergraduate RL Theory").should("be.visible");

      cy.contains("GridWorld").click();
      cy.url().should("include", "/gridworld");
      cy.contains("Reinforcement Learning GridWorld Lab").should("be.visible");
    });
  });

  describe("GridWorld Lab - Interactive Environment & Algorithms", () => {
    beforeEach(() => {
      cy.visit("gridworld");
    });

    it("switches environment presets: Cliff Walking, Frozen Lake, and Maze", () => {
      cy.contains("button", "Cliff Walking").click();
      cy.contains("Environment Rules").should("be.visible");

      cy.contains("button", "Frozen Lake").click();
      cy.contains("Environment Rules").should("be.visible");

      cy.contains("button", "Sutton-Barto").click();
      cy.contains("Environment Rules").should("be.visible");

      cy.contains("button", "Open Grid").click();
      cy.contains("Environment Rules").should("be.visible");
    });

    it("changes RL algorithms in the dropdown", () => {
      const select = cy.get("select#rl-algorithm-select");
      select.should("be.visible");

      select.select("sarsa");
      select.should("have.value", "sarsa");

      select.select("expected-sarsa");
      select.should("have.value", "expected-sarsa");

      select.select("double-q");
      select.should("have.value", "double-q");

      select.select("monte-carlo");
      select.should("have.value", "monte-carlo");

      select.select("value-iteration");
      select.should("have.value", "value-iteration");

      select.select("q-learning");
      select.should("have.value", "q-learning");
    });

    it("executes training steps and updates metrics and learning curve", () => {
      // Train 50 episodes
      cy.contains("button", "Train 50").click();
      cy.contains("Total Episodes").should("be.visible");

      // Verify episodes count updated
      cy.get("div")
        .contains("Total Episodes")
        .parent()
        .find(".font-bold")
        .should("not.contain", "0");

      // Train 200 more
      cy.contains("button", "Train 200").click();

      // Step single transition
      cy.contains("button", "1-Step Transition").click();
      cy.contains("Last Bellman Update:").should("be.visible");

      // Step simulation
      cy.contains("button", "Step").click();

      // Toggle continuous play and pause
      cy.contains("button", "Play").click();
      cy.wait(400);
      cy.contains("button", "Pause").click();

      // Reset Q-table
      cy.get("button[title='Reset Q-Table']").click();
      cy.get("div")
        .contains("Total Episodes")
        .parent()
        .find(".font-bold")
        .should("contain", "0");
    });

    it("toggles visual overlay layers: Heatmap, Arrows, Q-Values, Visits, BFS Path", () => {
      cy.contains("button", "Heatmap").click();
      cy.contains("button", "Arrows").click();
      cy.contains("button", "Q-Values").click();
      cy.contains("button", "Visits").click();
      cy.contains("button", "BFS Path").click();
    });

    it("supports cell inspection showing Bellman arithmetic", () => {
      cy.contains("button", "Inspect").click();
      // Click a grid cell
      cy.get("[data-testid='grid-canvas-cells'] button").eq(6).click();
      cy.contains("State (1, 1): V*(s) =").should("be.visible");
    });

    it("paints obstacles, hazards, mud, and ice on the grid", () => {
      cy.contains("button", "Pit").click();
      cy.get("[data-testid='grid-canvas-cells'] button").eq(7).click();

      cy.contains("button", "Wall").click();
      cy.get("[data-testid='grid-canvas-cells'] button").eq(8).click();

      cy.contains("button", "Mud").click();
      cy.get("[data-testid='grid-canvas-cells'] button").eq(12).click();

      cy.contains("button", "Ice").click();
      cy.get("[data-testid='grid-canvas-cells'] button").eq(13).click();
    });

    it("adjusts grid dimension", () => {
      cy.contains("button", "4x4").click();
      cy.get("[data-testid='grid-canvas-cells'] button").should(
        "have.length",
        16,
      );

      cy.contains("button", "6x6").click();
      cy.get("[data-testid='grid-canvas-cells'] button").should(
        "have.length",
        36,
      );

      cy.contains("button", "5x5").click();
      cy.get("[data-testid='grid-canvas-cells'] button").should(
        "have.length",
        25,
      );
    });

    it("saves trained agent policy to Saved Agents", () => {
      // Train first
      cy.contains("button", "Train 50").click();

      // Handle window:alert
      cy.on("window:alert", (str) => {
        expect(str).to.include("Saved agent");
      });

      cy.contains("button", "Save").click();
    });
  });

  describe("Multi-Armed Bandits Lab", () => {
    beforeEach(() => {
      cy.visit("bandits");
    });

    it("renders 10 arms testbed with values and pull counts", () => {
      cy.contains("10-Armed Testbed").should("be.visible");
      cy.contains("#1").should("be.visible");
      cy.contains("#10").should("be.visible");
    });

    it("switches bandit algorithms and adjusts sliders", () => {
      cy.get("select#bandit-algorithm-select").select("ucb1");
      cy.contains("UCB Exploration Confidence (c)").should("be.visible");

      cy.get("select#bandit-algorithm-select").select("optimistic-initial");
      cy.contains("Initial Q-Value (Q₀)").should("be.visible");

      cy.get("select#bandit-algorithm-select").select("thompson-sampling");
      cy.get("select#bandit-algorithm-select").select("epsilon-greedy");
    });

    it("steps bandit simulations and updates average reward", () => {
      cy.contains("button", "Step 1").click();
      cy.contains("Steps").parent().find(".font-bold").should("contain", "1");

      cy.contains("button", "Step 50").click();
      cy.contains("Steps").parent().find(".font-bold").should("contain", "51");

      cy.contains("button", "Step 200").click();
      cy.contains("Average Reward Learning Curve").should("be.visible");

      // Reset
      cy.get("button[title='Reset Simulation']").click();
      cy.contains("Steps").parent().find(".font-bold").should("contain", "0");
    });
  });

  describe("Dynamic Programming (Value Iteration) Lab", () => {
    beforeEach(() => {
      cy.visit("dp");
    });

    it("renders state values and derived policy", () => {
      cy.contains("Value Iteration Controls").should("be.visible");
      cy.contains("State Values V*(s)").should("be.visible");
    });

    it("performs single sweep and runs to convergence", () => {
      cy.contains("button", "Step 1 Sweep").click();
      cy.contains("Sweeps").parent().find(".font-mono").should("contain", "1");

      cy.contains("button", "Run to Convergence").click();
      cy.contains("Converged").should("be.visible");
    });

    it("inspects state Bellman equation breakdown", () => {
      cy.contains("button", "Step 1 Sweep").click();
      cy.get("[data-testid='dp-grid-cells'] button").eq(0).click();
      cy.contains("Mathematical Inspector: State").should("be.visible");
    });
  });

  describe("Saved Policies & Agents Management", () => {
    beforeEach(() => {
      cy.visit("agents");
    });

    it("renders saved agents page and search bar", () => {
      cy.contains("Saved Policies & Agents").should("be.visible");
      cy.get("input[placeholder*='Search']").should("be.visible");
    });

    it("filters saved agents by search query", () => {
      cy.get("input[placeholder*='Search']").type("Q-LEARNING");
    });
  });

  describe("Theory & Undergrad Learning Guide with Quiz", () => {
    beforeEach(() => {
      cy.visit("theory");
    });

    it("renders core RL concepts: MDP, Bellman Equations, SARSA vs Q-Learning, Bandits", () => {
      cy.contains("1. Markov Decision Processes (MDP)").should("be.visible");
      cy.contains("2. Bellman Equations").should("be.visible");
      cy.contains("3. Q-Learning vs. SARSA").should("be.visible");
      cy.contains("4. Multi-Armed Bandits & UCB").should("be.visible");
    });

    it("completes undergraduate self-check quiz and displays score and explanations", () => {
      // Answer questions
      cy.get("button").contains("Q-learning is off-policy").click();
      cy.get("button").contains("SARSA accounts for epsilon-greedy").click();
      cy.get("button").contains("Maximization bias arises from using").click();
      cy.get("button").contains("Optimism in the face of uncertainty").click();
      cy.get("button").contains("Full knowledge of the environment").click();

      // Submit
      cy.contains("button", "Submit Answers").click();

      // Verify score display
      cy.contains("Score: 5 / 5").should("be.visible");
      cy.contains("Explanation:").should("be.visible");

      // Retry
      cy.contains("button", "Retry").click();
      cy.contains("button", "Submit Answers").should("be.visible");
    });
  });
});
