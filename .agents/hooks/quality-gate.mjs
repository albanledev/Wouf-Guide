import { execSync } from "node:child_process";
import fs from "node:fs";

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

const raw = readStdin().trim();
if (!raw) {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

// Ne jamais bloquer en boucle si un Stop hook a déjà relancé ce tour,
// ni sur une annulation/erreur système.
if (payload.continuationActive || payload.terminationReason !== "NO_TOOL_CALL") {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const repoDir = payload.cwd || process.cwd();

let changedFiles = "";
try {
  changedFiles = execSync("git status --porcelain", {
    cwd: repoDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
} catch {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const touchedCriticalCode = changedFiles
  .split("\n")
  .some((line) => /\bsrc\/(domain|data)\//.test(line));

if (!touchedCriticalCode) {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

try {
  execSync("pnpm test", {
    cwd: repoDir,
    stdio: "ignore",
  });
  process.stdout.write(JSON.stringify({ decision: "allow" }));
} catch {
  process.stdout.write(
    JSON.stringify({
      decision: "continue",
      reason:
        "[woufguide-quality-gate] Des fichiers dans src/domain/ ou src/data/ ont été modifiés et `pnpm test` échoue. Corrige les tests avant de conclure.",
    }),
  );
}
