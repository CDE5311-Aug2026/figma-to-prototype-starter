// Fails if source code uses hard-coded design values instead of tokens.
// Run with: npm run tokens:check   (also part of `npm run check`)
// To allow a rare exception, add the comment: token-check-ignore  (on the same line)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["src", "examples"];
const EXTENSIONS = [".ts", ".tsx", ".css", ".html"];
const SKIP = ["tokens.generated.css", "node_modules", ".next"];

const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone";
const UTILITY =
  "bg|text|border|ring|fill|stroke|from|to|via|divide|outline|accent|caret|decoration|shadow|placeholder";

const rules = [
  {
    name: "hex colour",
    regex: /#[0-9a-fA-F]{3,8}\b/,
    hint: "Use a colour token from tokens/tokens.json (e.g. bg-primary).",
    // ignore things like HTML entities / anchors / ids by requiring a hex-only match with 3,4,6 or 8 digits
    verify: (m) => [3, 4, 6, 8].includes(m[0].length - 1),
  },
  {
    name: "rgb()/hsl() colour",
    regex: /\b(rgb|rgba|hsl|hsla|oklch)\(/,
    hint: "Use a colour token instead of a raw colour function.",
  },
  {
    name: "arbitrary Tailwind value",
    regex: /\b[a-z-]+-\[(#|-?\d+(\.\d+)?(px|rem|em|%|vh|vw))[^\]]*\]/,
    hint: "Use a spacing/size/colour token (p-4, rounded-lg, text-sm) instead of bg-[#fff] or p-[13px].",
  },
  {
    name: "default Tailwind palette colour",
    regex: new RegExp(`\\b(${UTILITY})-(${PALETTE})-\\d{2,3}\\b`),
    hint: "The default palette is disabled. Use a semantic token like bg-primary or text-muted.",
  },
  {
    name: "white/black colour class",
    regex: new RegExp(`\\b(${UTILITY})-(white|black)\\b`),
    hint: "Use a token such as bg-background, text-foreground or text-primary-foreground.",
  },
  {
    name: "inline pixel/colour style",
    regex: /style=\{\{[^}]*(color|background|padding|margin|fontSize)\s*:/,
    hint: "Use Tailwind classes backed by tokens instead of inline styles.",
  },
];

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.includes(entry)) continue;
    const full = join(dir, entry);
    const info = statSync(full);
    if (info.isDirectory()) files = files.concat(walk(full));
    else if (EXTENSIONS.some((ext) => full.endsWith(ext))) files.push(full);
  }
  return files;
}

const problems = [];

for (const dir of SCAN_DIRS) {
  const abs = join(root, dir);
  try {
    statSync(abs);
  } catch {
    continue;
  }
  for (const file of walk(abs)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (line.includes("token-check-ignore")) return;
      for (const rule of rules) {
        // Report every match on the line, not just the first one.
        const regex = new RegExp(rule.regex.source, "g");
        for (const match of line.matchAll(regex)) {
          if (rule.verify && !rule.verify(match)) continue;
          problems.push({
            file: relative(root, file),
            line: index + 1,
            rule: rule.name,
            found: match[0],
            hint: rule.hint,
          });
        }
      }
    });
  }
}

if (problems.length === 0) {
  console.log("tokens:check passed - no hard-coded design values found.");
  process.exit(0);
}

console.error(`tokens:check found ${problems.length} hard-coded design value(s):\n`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}  [${p.rule}]  ${p.found}\n      -> ${p.hint}`);
}
console.error(
  "\nFix them by using tokens from tokens/tokens.json. Add a token there if one is missing.",
);
process.exit(1);
