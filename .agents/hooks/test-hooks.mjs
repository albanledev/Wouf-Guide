import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";

const hooksDir = path.resolve(process.cwd(), ".agents/hooks");

function runHook(scriptName, payload) {
  const stdout = execFileSync("node", [path.join(hooksDir, scriptName)], {
    input: JSON.stringify(payload),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
}

// 1. Sabotage contrôlé : commande destructrice bloquée par PreToolUse
const blockedRm = runHook("safety-guard.mjs", {
  hookEventName: "PreToolUse",
  toolCall: { name: "run_command", args: { CommandLine: "rm -rf .git" } },
});
assert.equal(blockedRm.decision, "deny");
assert.match(blockedRm.reason, /woufguide-safety-guard/);
console.log("✅ Sabotage 1 intercepté (rm -rf .git) :", blockedRm.reason);

// 2. Sabotage contrôlé : git push --force bloqué
const blockedForce = runHook("safety-guard.mjs", {
  hookEventName: "PreToolUse",
  toolCall: { name: "run_command", args: { CommandLine: "git push --force origin main" } },
});
assert.equal(blockedForce.decision, "deny");
console.log("✅ Sabotage 2 intercepté (git push --force) :", blockedForce.reason);

// 3. Commande normale autorisée
const allowedCmd = runHook("safety-guard.mjs", {
  hookEventName: "PreToolUse",
  toolCall: { name: "run_command", args: { CommandLine: "pnpm check" } },
});
assert.equal(allowedCmd.decision, "allow");
console.log("✅ Commande normale autorisée (pnpm check) :", allowedCmd.decision);

// 4. Stop hook sur dépôt sain
const stopOk = runHook("quality-gate.mjs", {
  hookEventName: "Stop",
  terminationReason: "NO_TOOL_CALL",
  continuationActive: false,
  cwd: process.cwd(),
});
assert.equal(stopOk.decision, "allow");
console.log("✅ Stop hook qualité sur dépôt sain :", stopOk.decision);

// 5. Stop hook anti-boucle (continuationActive = true)
const stopAntiLoop = runHook("quality-gate.mjs", {
  hookEventName: "Stop",
  terminationReason: "NO_TOOL_CALL",
  continuationActive: true,
  cwd: process.cwd(),
});
assert.equal(stopAntiLoop.decision, "allow");
console.log("✅ Stop hook anti-boucle vérifié :", stopAntiLoop.decision);

console.log("\n🎉 Tous les tests de contrat stdin/stdout des hooks passent !");
