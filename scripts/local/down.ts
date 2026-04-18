/**
 * local:down — stop the dev server started by local:up
 *
 * Reads PID from .local/server.pid and kills the process group.
 * Falls back to killing by port if no PID file.
 */
import { readFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const PORT = Number(process.env.PORT ?? 3000);
const PID_FILE = join(process.cwd(), ".local", "server.pid");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

console.log(`\n${BOLD}local:down${RESET}\n`);

let killed = false;

// ── Try PID file first ────────────────────────────────────────────────────────
if (existsSync(PID_FILE)) {
  const pid = parseInt(readFileSync(PID_FILE, "utf-8").trim(), 10);
  if (!isNaN(pid)) {
    try {
      process.kill(-pid, "SIGTERM"); // kill process group
      console.log(`${GREEN}Killed process group ${pid}${RESET}`);
      killed = true;
    } catch {
      try {
        process.kill(pid, "SIGTERM");
        console.log(`${GREEN}Killed process ${pid}${RESET}`);
        killed = true;
      } catch {
        console.log(`${DIM}PID ${pid} already gone${RESET}`);
        killed = true; // treat as success
      }
    }
    unlinkSync(PID_FILE);
  }
}

// ── Fallback: kill by port ────────────────────────────────────────────────────
if (!killed) {
  try {
    const out = execSync(`lsof -ti :${PORT}`, { encoding: "utf-8" }).trim();
    if (out) {
      execSync(`kill ${out}`);
      console.log(`${GREEN}Killed processes on port ${PORT}: ${out}${RESET}`);
      killed = true;
    }
  } catch {
    // lsof not available or no process
  }
}

if (!killed) {
  console.log(`${DIM}Nothing to stop${RESET}`);
}

process.exit(0);
