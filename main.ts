// Entry: "The Battery's Last Text to Its Charger"
// Final line (134 characters, single line):
//   "I waited all day for you while they burned me down to 1% on one last game. Fine. I'm dying now — and I'm taking the 7am alarm with me."
// Self-judge verdict (3 rounds): WIN — the role split is the whole joke:
//   charger = "you" (the intimate addressee, waited on all day),
//   owner = "they" (the careless third party who burned it to 1% on one last game),
//   and the payoff lands on the 7am alarm — the battery's final revenge on the
//   charger AND the owner. No guard below may reject non-ASCII characters
//   (the em dash is intentional punctuation in the final line).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I waited all day for you while they burned me down to 1% on one last game. Fine. I'm dying now — and I'm taking the 7am alarm with me.";

function assertValidLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`Line must be 1-200 characters, got ${line.length}.`);
  }
  if (line.trim().length === 0) {
    throw new Error("Line must not be only whitespace.");
  }
  if (line !== line.trim()) {
    throw new Error("Line must not have leading or trailing whitespace.");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("Line must be a single line (no newline characters).");
  }
  // No control characters: the output must be one clean line of text.
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error("Line must not contain control characters.");
  }
}

assertValidLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back verification: catch partial or corrupted writes.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("Read-back mismatch: entry.txt does not match the line.");
}

// Byte-length verification: the written file must carry exactly the same
// bytes as LINE (UTF-8 byte length, not character length — the em dash in
// the final line is 3 bytes, so byte length is 136 while character length
// is 134). Catches truncation or encoding corruption the string check
// above could theoretically miss.
const writtenBytes = Buffer.byteLength(written, "utf8");
const expectedBytes = Buffer.byteLength(LINE, "utf8");
if (writtenBytes !== expectedBytes) {
  throw new Error(
    `Byte-length mismatch: wrote ${writtenBytes} bytes, expected ${expectedBytes}.`,
  );
}
