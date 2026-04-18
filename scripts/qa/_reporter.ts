/**
 * Minimal pass/fail reporter for QA scripts.
 * No external deps — plain console output.
 */

const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
const WARN = "\x1b[33m⚠\x1b[0m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

let _suite = "";
let _passed = 0;
let _failed = 0;
const _failures: string[] = [];

export function suite(name: string) {
  _suite = name;
  console.log(`\n${BOLD}${name}${RESET}`);
}

export function pass(label: string, detail?: string) {
  _passed++;
  console.log(`  ${PASS} ${label}${detail ? ` ${DIM}(${detail})${RESET}` : ""}`);
}

export function fail(label: string, detail?: string) {
  _failed++;
  const msg = `${_suite} › ${label}${detail ? `: ${detail}` : ""}`;
  _failures.push(msg);
  console.log(`  ${FAIL} ${label}${detail ? ` ${DIM}(${detail})${RESET}` : ""}`);
}

export function warn(label: string, detail?: string) {
  console.log(`  ${WARN} ${label}${detail ? ` ${DIM}(${detail})${RESET}` : ""}`);
}

export function assert(cond: boolean, label: string, detail?: string) {
  if (cond) pass(label, detail);
  else fail(label, detail);
}

export function assertGte(actual: number, min: number, label: string) {
  assert(actual >= min, label, `${actual} >= ${min}`);
}

export function assertRange(actual: number, min: number, max: number, label: string) {
  assert(actual >= min && actual <= max, label, `${actual} in [${min}, ${max}]`);
}

export function summary(): { passed: number; failed: number; ok: boolean } {
  const ok = _failed === 0;
  const color = ok ? "\x1b[32m" : "\x1b[31m";
  console.log(
    `\n${color}${BOLD}${ok ? "PASS" : "FAIL"}${RESET}  ${_passed} passed, ${_failed} failed`
  );
  if (_failures.length > 0) {
    console.log(`\n${BOLD}Failures:${RESET}`);
    for (const f of _failures) console.log(`  ${FAIL} ${f}`);
  }
  return { passed: _passed, failed: _failed, ok };
}

export function exitWithSummary() {
  const { ok } = summary();
  process.exit(ok ? 0 : 1);
}
