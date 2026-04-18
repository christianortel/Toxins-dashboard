/**
 * local:verify — full local verification run
 *
 * 1. Runs all offline QA validators
 * 2. Checks that the dev server is reachable
 * 3. Runs live API validation if server is up
 *
 * Exits 0 only if everything passes.
 */
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const tsx = join(__dir, "../../node_modules/.bin/tsx");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function run(script: string, env: Record<string, string> = {}): boolean {
  const result = spawnSync(tsx, [script], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  return result.status === 0;
}

async function main() {
  console.log(`\n${BOLD}local:verify${RESET}\n`);

  let allOk = true;

  // ── Offline validators ──────────────────────────────────────────────────────
  console.log(`${BOLD}── offline ──────────────────────────────────────────${RESET}`);
  const offline = [
    "scripts/qa/validate-home-atlas-cache.ts",
    "scripts/qa/validate-zoom-drilldown.ts",
    "scripts/qa/validate-local-focus-priority.ts",
    "scripts/qa/validate-browser-interactions.ts",
    "scripts/qa/validate-pfas-coverage-notes.ts",
  ];

  for (const script of offline) {
    if (!run(script)) allOk = false;
  }

  // ── Live API check ──────────────────────────────────────────────────────────
  console.log(`\n${BOLD}── live api (${BASE_URL}) ─────────────────────────${RESET}`);

  let serverUp = false;
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
    serverUp = res.ok;
  } catch { /* not running */ }

  if (serverUp) {
    if (!run("scripts/qa/validate-live-api.ts", { BASE_URL })) {
      allOk = false;
    }
  } else {
    console.log(`${YELLOW}  ⚠ Server not reachable — skipping live-api checks${RESET}`);
    console.log(`${YELLOW}    Run 'npm run local:up' first, then re-run local:verify${RESET}\n`);
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (allOk) {
    console.log(`\n${GREEN}${BOLD}✓ All checks passed${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`\n${RED}${BOLD}✗ Some checks failed${RESET}\n`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
