import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildBugReport,
  copyReportToClipboard,
  openGitHubIssueWithReport,
  triggerBugReport,
} from "../src/lib/bugReport.ts";
import { initConsoleLogger } from "../src/lib/consoleLogger.ts";
import { useBanditStore } from "../src/stores/banditStore.ts";
import { useRLStore } from "../src/stores/rlStore.ts";
import { useGamesStore } from "../src/stores/gamesStore.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Feedback and Header Logic and Files", () => {
  it("buildBugReport constructs complete diagnostics report", () => {
    const report = buildBugReport();
    assert.ok(report.includes("## 🐛 Bug Report"));
    assert.ok(report.includes("### Description"));
    assert.ok(report.includes("### Steps to Reproduce"));
    assert.ok(report.includes("### 📊 Application State"));
    assert.ok(report.includes("GridWorld Lab:"));
    assert.ok(report.includes("Bandits Lab:"));
    assert.ok(report.includes("Dynamic Programming:"));
    assert.ok(report.includes("Games Lab:"));
    assert.ok(report.includes("Saved Agents:"));
    assert.ok(report.includes("### 🖥️ Environment"));
    assert.ok(report.includes("### 📜 Console Logs"));
  });

  it("buildBugReport handles active game state and finite bandit averages", () => {
    useBanditStore.setState({ averageReward: 3.456, stepCount: 42 });
    useRLStore.setState({ totalEpisodes: 25, successCount: 18 });
    useGamesStore.setState({ activeGame: "continuous-car" });

    const report = buildBugReport();
    assert.ok(report.includes("avg reward 3.46"));
    assert.ok(report.includes("42 steps"));
    assert.ok(report.includes("25 episodes, 18 successes"));
    assert.ok(report.includes("continuous-car"));

    // Edge case: non-finite bandit averageReward
    // @ts-expect-error test non-finite
    useBanditStore.setState({ averageReward: NaN });
    const nonFiniteReport = buildBugReport();
    assert.ok(nonFiniteReport.includes("avg reward 0.00"));
  });

  it("buildBugReport escapes triple backticks in console logs", () => {
    const origWindow = globalThis.window;
    try {
      // @ts-expect-error mock window for logger
      globalThis.window = {};
      initConsoleLogger();
      console.log("Here is a test log with ```codeblock``` inside");
      const report = buildBugReport();
      assert.ok(!report.includes("```codeblock```"));
      assert.ok(report.includes("'''codeblock'''"));
    } finally {
      globalThis.window = origWindow;
    }
  });

  it("copyReportToClipboard handles clipboard success and fallback to execCommand", async () => {
    const origNav = globalThis.navigator;
    const origDoc = globalThis.document;

    try {
      // 1. Success via navigator.clipboard.writeText
      let writtenText = "";
      // @ts-expect-error mock navigator
      globalThis.navigator = {
        clipboard: {
          writeText: async (text: string) => {
            writtenText = text;
          },
        },
      };
      const resClipboard = await copyReportToClipboard("clipboard report");
      assert.equal(resClipboard, true);
      assert.equal(writtenText, "clipboard report");

      // 2. Fallback to execCommand when navigator.clipboard throws
      let execCommandCalled = false;
      let textareaAppended = false;
      // @ts-expect-error mock navigator rejecting
      globalThis.navigator = {
        clipboard: {
          writeText: async () => {
            throw new Error("Clipboard blocked");
          },
        },
      };
      // @ts-expect-error mock document
      globalThis.document = {
        createElement: () => ({
          style: {},
          value: "",
          focus: () => {},
          select: () => {},
        }),
        body: {
          appendChild: () => {
            textareaAppended = true;
          },
          removeChild: () => {},
        },
        execCommand: (cmd: string) => {
          if (cmd === "copy") {
            execCommandCalled = true;
            return true;
          }
          return false;
        },
      };

      const resFallback = await copyReportToClipboard("fallback text");
      assert.equal(resFallback, true);
      assert.equal(textareaAppended, true);
      assert.equal(execCommandCalled, true);

      // 3. Complete failure returns false
      // @ts-expect-error mock failing doc
      globalThis.document = {
        createElement: () => {
          throw new Error("DOM error");
        },
      };
      const resFail = await copyReportToClipboard("fail text");
      assert.equal(resFail, false);
    } finally {
      globalThis.navigator = origNav;
      globalThis.document = origDoc;
    }
  });

  it("openGitHubIssueWithReport opens window with URL and truncates if necessary", () => {
    let openedUrl = "";
    let targetParam = "";
    const origWindow = globalThis.window;
    try {
      // @ts-expect-error mocking for test
      globalThis.window = {
        open: (url: string, target?: string) => {
          openedUrl = url;
          targetParam = target ?? "";
          return null;
        },
      };

      openGitHubIssueWithReport("Short report");
      assert.ok(
        openedUrl.startsWith(
          "https://github.com/mrishab/rl-playground/issues/new",
        ),
      );
      assert.ok(openedUrl.includes("title=Bug%3A"));
      assert.ok(openedUrl.includes("body=Short+report"));
      assert.equal(targetParam, "_blank");

      const hugeReport = "A".repeat(5000);
      openGitHubIssueWithReport(hugeReport);
      assert.ok(openedUrl.includes("Full+diagnostics"));
    } finally {
      globalThis.window = origWindow;
    }
  });

  it("triggerBugReport executes window open synchronously before clipboard", async () => {
    const callOrder: string[] = [];
    let copiedText = "";
    const origWindow = globalThis.window;
    const origNav = globalThis.navigator;

    try {
      // @ts-expect-error mocking for test
      globalThis.window = {
        location: { href: "http://localhost:5173/gridworld" },
        innerWidth: 1920,
        innerHeight: 1080,
        open: () => {
          callOrder.push("window.open");
          return null;
        },
      };
      // @ts-expect-error mocking for test
      globalThis.navigator = {
        userAgent: "TestAgent/1.0",
        clipboard: {
          writeText: async (t: string) => {
            callOrder.push("clipboard.writeText");
            copiedText = t;
          },
        },
      };

      const result = await triggerBugReport();
      assert.equal(result.copied, true);
      assert.deepEqual(callOrder, ["window.open", "clipboard.writeText"]);
      assert.ok(copiedText.includes("http://localhost:5173/gridworld"));
    } finally {
      globalThis.window = origWindow;
      globalThis.navigator = origNav;
    }
  });

  it("verifies SponsorButton file existence, content and link targets", () => {
    const filePath = path.resolve(
      __dirname,
      "../src/components/site-header/SponsorButton.tsx",
    );
    assert.ok(fs.existsSync(filePath), "SponsorButton.tsx exists");
    const content = fs.readFileSync(filePath, "utf-8");
    assert.ok(content.includes("https://ko-fi.com/mrishab"));
    assert.ok(content.includes("Sponsor"));
    assert.ok(content.includes('aria-label="Sponsor project on Ko-fi"'));
    assert.ok(content.includes('rel="noopener noreferrer"'));
    assert.ok(content.includes("active:scale-95"));
    assert.ok(content.includes("text-rose-600 dark:text-rose-400"));
  });

  it("verifies AuthorLink and CreatorButton file existence and link targets", () => {
    const authorPath = path.resolve(
      __dirname,
      "../src/components/site-header/AuthorLink.tsx",
    );
    assert.ok(fs.existsSync(authorPath), "AuthorLink.tsx exists");
    const authorContent = fs.readFileSync(authorPath, "utf-8");
    assert.ok(authorContent.includes("https://github.com/mrishab"));
    assert.ok(authorContent.includes("Rishab Manocha"));
    assert.ok(authorContent.includes("CreatorButton"));
    assert.ok(authorContent.includes("active:scale-95"));

    const creatorPath = path.resolve(
      __dirname,
      "../src/components/site-header/CreatorButton.tsx",
    );
    assert.ok(fs.existsSync(creatorPath), "CreatorButton.tsx exists");
  });

  it("verifies BugReportBubble file existence, styling and structure", () => {
    const bubblePath = path.resolve(
      __dirname,
      "../src/components/feedback/BugReportBubble.tsx",
    );
    assert.ok(fs.existsSync(bubblePath), "BugReportBubble.tsx exists");
    const content = fs.readFileSync(bubblePath, "utf-8");
    assert.ok(content.includes("fixed"));
    assert.ok(content.includes("Report Bug"));
    assert.ok(content.includes("useBugReportBubble"));
    assert.ok(content.includes("Diagnostics Copied!"));
    assert.ok(content.includes("ReportBugButton"));
    assert.ok(content.includes("active:scale-95"));

    const hookPath = path.resolve(
      __dirname,
      "../src/components/feedback/useBugReportBubble.ts",
    );
    assert.ok(fs.existsSync(hookPath), "useBugReportBubble.ts exists");
    const hookContent = fs.readFileSync(hookPath, "utf-8");
    assert.ok(hookContent.includes("triggerBugReport"));
    assert.ok(hookContent.includes("clearTimeout"));

    const reportBugPath = path.resolve(
      __dirname,
      "../src/components/feedback/ReportBugButton.tsx",
    );
    assert.ok(fs.existsSync(reportBugPath), "ReportBugButton.tsx exists");

    const feedbackIndexPath = path.resolve(
      __dirname,
      "../src/components/feedback/index.ts",
    );
    assert.ok(fs.existsSync(feedbackIndexPath), "feedback/index.ts exists");
  });

  it("verifies AppShell and SiteHeader mount the buttons", () => {
    const appShellPath = path.resolve(__dirname, "../src/AppShell.tsx");
    const appShellContent = fs.readFileSync(appShellPath, "utf-8");
    assert.ok(appShellContent.includes("<BugReportBubble />"));
    assert.ok(appShellContent.includes("pb-16 sm:pb-20"));

    const headerPath = path.resolve(
      __dirname,
      "../src/components/site-header.tsx",
    );
    const headerContent = fs.readFileSync(headerPath, "utf-8");
    assert.ok(headerContent.includes("<AuthorLink />"));
    assert.ok(headerContent.includes("<SponsorButton />"));
    assert.ok(headerContent.includes("CreatorButton"));
  });
});
