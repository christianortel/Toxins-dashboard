/**
 * local:status — check runtime state
 *
 * Reports:
 * - Whether the dev server is reachable at localhost:3000
 * - /api/health response
 * - Node version
 */
const PORT = Number(process.env.PORT ?? 3000);
const BASE = `http://localhost:${PORT}`;

const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function label(s: string) { return `${DIM}${s}${RESET}`; }
function ok(s: string) { return `${GREEN}${s}${RESET}`; }
function err(s: string) { return `${RED}${s}${RESET}`; }

async function main() {
  console.log(`\n${BOLD}local:status${RESET}\n`);
  console.log(`  ${label("target")}  ${BASE}`);
  console.log(`  ${label("node")}    ${process.version}`);

  let serverUp = false;
  try {
    const res = await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    serverUp = res.ok;
    if (res.ok) {
      const health = await res.json() as Record<string, unknown>;
      console.log(`  ${label("server")}  ${ok("UP")}`);
      console.log(`  ${label("mode")}    ${health.dataMode ?? "unknown"}`);
      console.log(`  ${label("entities")} ${health.totalEntities ?? "?"}`);
      console.log(`  ${label("layers")}  ${health.totalLayers ?? "?"}`);
      if (health.readyForLocalUse) console.log(`  ${label("local")}   ${ok("ready")}`);
    } else {
      console.log(`  ${label("server")}  HTTP ${res.status}`);
    }
  } catch {
    console.log(`  ${label("server")}  ${err("DOWN")}  (start with: npm run dev)`);
  }

  console.log();
  process.exit(serverUp ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
