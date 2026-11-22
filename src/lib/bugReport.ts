import { useRLStore } from "../stores/rlStore";
import { useBanditStore } from "../stores/banditStore";
import { useDPStore } from "../stores/dpStore";
import { useGamesStore } from "../stores/gamesStore";
import { useSavedAgentsStore } from "../stores/savedAgentsStore";
import { formatLogsForReport, getConsoleLogs } from "./consoleLogger";

const GITHUB_REPO_ISSUES_URL =
  "https://github.com/mrishab/rl-playground/issues/new";
const MAX_URL_BODY_LENGTH = 3500;

export function buildBugReport(): string {
  const currentUrl =
    typeof window !== "undefined" && window.location?.href
      ? window.location.href
      : "Unknown";
  const userAgent =
    typeof navigator !== "undefined" && navigator.userAgent
      ? navigator.userAgent
      : "Unknown";
  const screenResolution =
    typeof window !== "undefined" && window.innerWidth && window.innerHeight
      ? `${window.innerWidth}x${window.innerHeight}`
      : "Unknown";
  const timestamp = new Date().toISOString();

  let rlSummary = "Unknown";
  try {
    const rl = useRLStore.getState();
    const algo = rl.params?.algorithm ?? "q-learning";
    const eps = rl.totalEpisodes ?? 0;
    const succ = rl.successCount ?? 0;
    const size = rl.gridSize ?? 5;
    rlSummary = `${algo} (${eps} episodes, ${succ} successes, grid ${size}x${size})`;
  } catch {
    rlSummary = "Unavailable";
  }

  let banditSummary = "Unknown";
  try {
    const bandit = useBanditStore.getState();
    const algo = bandit.config?.algorithm ?? "epsilon-greedy";
    const steps = bandit.stepCount ?? 0;
    const avgR =
      typeof bandit.averageReward === "number" &&
      Number.isFinite(bandit.averageReward)
        ? bandit.averageReward.toFixed(2)
        : "0.00";
    banditSummary = `${algo} (${steps} steps, avg reward ${avgR})`;
  } catch {
    banditSummary = "Unavailable";
  }

  let dpSummary = "Unknown";
  try {
    const dp = useDPStore.getState();
    const algo = dp.algorithm ?? "value-iteration";
    const sweeps = dp.sweepCount ?? 0;
    const conv = dp.isConverged ? "Yes" : "No";
    dpSummary = `${algo} (${sweeps} sweeps, converged: ${conv})`;
  } catch {
    dpSummary = "Unavailable";
  }

  let gamesSummary = "Unknown";
  try {
    const games = useGamesStore.getState();
    const active = games.activeGame ?? "pong";
    const eps = games.metrics?.[active]?.episodes ?? 0;
    const algo = games.hyperparams?.algorithm ?? "q-learning";
    gamesSummary = `${active} (${algo}, ${eps} episodes)`;
  } catch {
    gamesSummary = "Unavailable";
  }

  let savedSummary = "0";
  try {
    const saved = useSavedAgentsStore.getState();
    const count = saved.agents?.length ?? 0;
    savedSummary = `${count} saved`;
  } catch {
    savedSummary = "Unavailable";
  }

  const totalLogs = getConsoleLogs().length;
  const rawLogs = formatLogsForReport(50);
  const consoleLogs = rawLogs.replace(/```/g, "'''");

  return `## 🐛 Bug Report

### Description
<!-- Please briefly describe what went wrong or what you experienced -->

### Steps to Reproduce
1.
2.
3.

### 📊 Application State
- **URL:** \`${currentUrl}\`
- **GridWorld Lab:** ${rlSummary}
- **Bandits Lab:** ${banditSummary}
- **Dynamic Programming:** ${dpSummary}
- **Games Lab:** ${gamesSummary}
- **Saved Agents:** ${savedSummary}

### 🖥️ Environment
- **Timestamp:** ${timestamp}
- **Browser / User Agent:** ${userAgent}
- **Window Size:** ${screenResolution}

### 📜 Console Logs (${totalLogs} captured)
\`\`\`text
${consoleLogs}
\`\`\`
`;
}

export async function copyReportToClipboard(report: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(report);
      return true;
    } catch {
      // fallback to document.execCommand
    }
  }

  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = report;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return Boolean(success);
    } catch {
      return false;
    }
  }

  return false;
}

export function openGitHubIssueWithReport(fullReport: string): void {
  let issueBody = fullReport;
  if (issueBody.length > MAX_URL_BODY_LENGTH) {
    const truncatedNotice = `\n\n> 📋 **Note:** Full diagnostics and complete console logs were copied to your clipboard. Paste them directly into this issue description if needed.\n`;
    issueBody =
      issueBody.substring(0, MAX_URL_BODY_LENGTH - truncatedNotice.length) +
      truncatedNotice;
  }

  const issueTitle = "Bug: [Brief description of the issue]";
  const params = new URLSearchParams({
    title: issueTitle,
    body: issueBody,
  });

  const url = `${GITHUB_REPO_ISSUES_URL}?${params.toString()}`;
  if (typeof window !== "undefined") {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // fallback if window.open is restricted
    }
  }
}

export async function triggerBugReport(): Promise<{
  copied: boolean;
}> {
  const report = buildBugReport();
  openGitHubIssueWithReport(report);
  const copied = await copyReportToClipboard(report);
  return { copied };
}
