import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jitiCli = path.resolve(
  __dirname,
  "../node_modules/jiti/lib/jiti-cli.mjs",
);

const testFiles = [
  "rl.test.ts",
  "bandit.test.ts",
  "dp.test.ts",
  "renderCheck.test.ts",
].map((f) => path.resolve(__dirname, f));

let allPassed = true;
for (const file of testFiles) {
  console.log(`\n--- Running ${path.basename(file)} ---`);
  const result = spawnSync("node", [jitiCli, file], {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
  });
  if (result.status !== 0) {
    allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log("\nAll test suites passed successfully!");
}
