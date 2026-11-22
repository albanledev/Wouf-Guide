import fs from "node:fs";

const FORBIDDEN_PATTERNS = [
  {
    pattern: /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*\s+(\/|~|\$HOME|\.git\b)/,
    reason: "Suppression récursive destructrice interdite (/, ~ ou .git).",
  },
  {
    pattern: /\bgit\s+push\b.*(--force\b|-f\b)/,
    reason: "git push --force interdit par la politique de sécurité du dépôt.",
  },
  {
    pattern: /\bgit\s+reset\s+--hard\b/,
    reason: "git reset --hard interdit sans validation manuelle de l'utilisateur.",
  },
  {
    pattern: /\bgit\s+commit\b.*--no-verify\b/,
    reason: "Contournement des vérifications (--no-verify) interdit.",
  },
];

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

const commandLine = String(payload?.toolCall?.args?.CommandLine ?? "");

for (const rule of FORBIDDEN_PATTERNS) {
  if (rule.pattern.test(commandLine)) {
    process.stdout.write(
      JSON.stringify({
        decision: "deny",
        reason: `[woufguide-safety-guard] ${rule.reason} Commande bloquée : "${commandLine}"`,
      }),
    );
    process.exit(0);
  }
}

process.stdout.write(JSON.stringify({ decision: "allow" }));
