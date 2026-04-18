/**
 * local:up — start the Next.js dev server in the background
 *
 * Writes the PID to .local/server.pid so local:down can kill it.
 * Polls /api/health until the server is ready (max 30s).
 */
import { spawn } from "child_process";
import { mkdirSync, writeFileSync, createWriteStream } from "fs";
import { join } from "path";

const PORT = Number(process.env.PORT ?? 3000);
const PID_DIR = join(process.cwd(), ".local");
const PID_FILE = join(PID_DIR, "server.pid");
const LOG_FILE = join(PID_DIR, "server.log");
const READY_TIMEOUT = 30_000;
const POLL_INTERVAL = 800;

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

async function main() {
  // ── Check if already running ──────────────────────────────────────────────
  try {
    const res = await fetch(`http://localhost:${PORT}/api/health`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      console.log(`${GREEN}Server already running${RESET} on port ${PORT}`);
      process.exit(0);
    }
  } catch {
    // not running — proceed
  }

  mkdirSync(PID_DIR, { recursive: true });

  console.log(`\n${BOLD}local:up${RESET}  starting dev server on port ${PORT}…\n`);

  const log = createWriteStream(LOG_FILE, { flags: "w" });
  const child = spawn("npm", ["run", "dev", "--", "--port", String(PORT)], {
    detached: true,
    stdio: ["ignore", log, log],
    cwd: process.cwd(),
  });
  child.unref();

  writeFileSync(PID_FILE, String(child.pid));
  console.log(`${DIM}PID ${child.pid} → ${PID_FILE}${RESET}`);
  console.log(`${DIM}logs → ${LOG_FILE}${RESET}\n`);

  // ── Poll until ready ────────────────────────────────────────────────────────
  const deadline = Date.now() + READY_TIMEOUT;
  let ready = false;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    try {
      const res = await fetch(`http://localhost:${PORT}/api/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) { ready = true; break; }
    } catch {
      process.stdout.write(".");
    }
  }

  console.log();
  if (ready) {
    console.log(`${GREEN}${BOLD}Ready${RESET}  http://localhost:${PORT}`);
    process.exit(0);
  } else {
    console.log(`${RED}Server did not become ready within ${READY_TIMEOUT / 1000}s${RESET}`);
    console.log(`Check logs: ${LOG_FILE}`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
