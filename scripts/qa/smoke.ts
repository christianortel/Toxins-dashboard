/**
 * QA smoke: runs all offline validators (no server required).
 *
 * Skips live-api by default. Set RUN_LIVE=1 to include it.
 *
 * Exits 0 if all pass, 1 if any fail.
 */
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { suite, pass, fail, summary } from "./_reporter";

const __dir = dirname(fileURLToPath(import.meta.url));
const tsx = join(__dir, "../../node_modules/.bin/tsx");
const RUN_LIVE = process.env.RUN_LIVE === "1";

const offline = [
  "scripts/qa/validate-home-atlas-cache.ts",
  "scripts/qa/validate-zoom-drilldown.ts",
  "scripts/qa/validate-local-focus-priority.ts",
  "scripts/qa/validate-browser-interactions.ts",
  "scripts/qa/validate-pfas-coverage-notes.ts",
];

const live = [
  "scripts/qa/validate-live-api.ts",
];

const scripts = RUN_LIVE ? [...offline, ...live] : offline;

if (!RUN_LIVE) {
  console.log("\nSkipping live-api (set RUN_LIVE=1 to include)\n");
}

suite("smoke");

let allOk = true;
for (const script of scripts) {
  const name = script.replace("scripts/qa/", "").replace(".ts", "");
  const result = spawnSync(tsx, [script], {
    cwd: process.cwd(),
    stdio: "pipe",
    encoding: "utf-8",
  });

  const output = (result.stdout + result.stderr).trim();
  for (const line of output.split("\n")) {
    if (line.trim()) process.stdout.write(`  ${line}\n`);
  }

  if (result.status === 0) {
    pass(name);
  } else {
    fail(name, `exit ${result.status}`);
    allOk = false;
  }
}

const { ok } = summary();
process.exit(ok ? 0 : 1);
