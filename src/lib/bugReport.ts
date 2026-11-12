import { useRLStore } from "@/stores/rlStore";
import { formatLogsForReport, getConsoleLogs } from "./consoleLogger";

const GITHUB_REPO_ISSUES_URL =
  "https://github.com/mrishab/RL-Playground/issues/new";
const MAX_URL_BODY_LENGTH = 3500;

export function buildBugReport(): string {
  const rl = useRLStore.getState();

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "Unknown";
  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";
  const screenResolution =
    typeof window !== "undefined"
      ? `${window.innerWidth}x${window.innerHeight}`
      : "Unknown";
  const timestamp = new Date().toISOString();

  const totalLogs = getConsoleLogs().length;
  const consoleLogs = formatLogsForReport(50);

  return `## 🐛 Bug Report

### Description
<!-- Please briefly describe what went wrong or what you experienced -->

### Steps to Reproduce
1.
2.
3.

### 📊 Application State
- **URL:** \`${currentUrl}\`
- **Algorithm:** ${rl.params.algorithm}
- **Grid Size:** ${rl.gridSize}x${rl.gridSize}
- **Episodes Trained:** ${rl.totalEpisodes}
- **Success Count:** ${rl.successCount}
- **Learning Rate (α):** ${rl.params.learningRate}
- **Discount Factor (γ):** ${rl.params.discountFactor}
- **Exploration Rate (ε):** ${rl.params.explorationRate}

### 💻 Environment
- **Timestamp:** ${timestamp}
- **User Agent:** \`${userAgent}\`
- **Screen Resolution:** ${screenResolution}

### 📋 Console Logs (${totalLogs} total captured)
\`\`\`
${consoleLogs}
\`\`\`
`;
}

export function openBugReportInGitHub(): void {
  const issueBody = buildBugReport();
  const title = "[Bug]: ";

  if (issueBody.length > MAX_URL_BODY_LENGTH) {
    const truncatedNotice = "\n\n... [Log truncated due to URL length limit]";
    const truncatedBody =
      issueBody.substring(0, MAX_URL_BODY_LENGTH - truncatedNotice.length) +
      truncatedNotice;

    const params = new URLSearchParams({
      title,
      body: truncatedBody,
      labels: "bug",
    });

    const url = `${GITHUB_REPO_ISSUES_URL}?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const params = new URLSearchParams({
    title,
    body: issueBody,
    labels: "bug",
  });

  const url = `${GITHUB_REPO_ISSUES_URL}?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function triggerBugReport(): Promise<void> {
  const report = buildBugReport();
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(report);
    } catch {
      // ignore
    }
  }
  openBugReportInGitHub();
}
