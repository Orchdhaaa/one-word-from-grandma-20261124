import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The one word a grandma would text about AI: "honeybot".
// Her pet name for the machine: "honey" because everything she loves
// gets called honey, "bot" because that is what the grandkids call it.
// Warm, a little baffled, and tied to robots in a single word.
const WORD = "honeybot";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 30 characters,
// not whitespace-only, and a single word (no whitespace at all).
const length = [...WORD].length;
if (length < 1 || length > 30) {
  throw new Error(`entry is ${length} characters, outside the 1-30 gate`);
}
if (WORD.trim().length === 0) {
  throw new Error("entry is whitespace only");
}
if (/\s/.test(WORD)) {
  throw new Error("entry must be exactly one word");
}
if (WORD.includes("\u2014")) {
  throw new Error("entry must not contain an em dash");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", WORD, "utf8");

// Read back what was written and confirm it is byte-for-byte the word
// we validated above, so a partial or mangled write can never pass
// silently as a valid entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== WORD) {
  throw new Error("entry.txt does not match the validated word");
}

// Count the words in the file itself: exactly one, no more, no less.
const words = written.trim().split(/\s+/).filter(Boolean);
if (words.length !== 1) {
  throw new Error(`entry.txt holds ${words.length} words, expected exactly 1`);
}
if (written.length !== WORD.length) {
  throw new Error("entry.txt byte length does not match the word");
}
