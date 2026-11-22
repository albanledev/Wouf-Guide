import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";

const serverPath = path.resolve(process.cwd(), "mcp-server/index.mjs");
const proc = spawn("node", [serverPath], {
  env: { ...process.env, WOUFGUIDE_ROOT: process.cwd() },
  stdio: ["pipe", "pipe", "pipe"],
});

const responses = [];
let buffer = "";

proc.stdout.on("data", (chunk) => {
  buffer += chunk.toString("utf8");
  let idx;
  while ((idx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (line) responses.push(JSON.parse(line));
  }
});

function sendRpc(obj) {
  proc.stdin.write(`${JSON.stringify(obj)}\n`);
}

sendRpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} });
sendRpc({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
sendRpc({
  jsonrpc: "2.0",
  id: 3,
  method: "tools/call",
  params: { name: "search_breeds", arguments: { query: "allemagne" } },
});
sendRpc({
  jsonrpc: "2.0",
  id: 4,
  method: "tools/call",
  params: { name: "compare_breeds", arguments: { slugs: ["golden-retriever", "berger-allemand"] } },
});
sendRpc({
  jsonrpc: "2.0",
  id: 5,
  method: "tools/call",
  params: { name: "audit_catalog_gaps", arguments: {} },
});
proc.stdin.end();

await new Promise((resolve) => proc.on("close", resolve));

assert.equal(responses.length, 5, "5 réponses JSON-RPC attendues");
assert.equal(responses[0].result.serverInfo.name, "woufguide-catalog");
assert.equal(responses[1].result.tools.length, 3);

const searchResult = JSON.parse(responses[2].result.content[0].text);
assert.equal(searchResult.count, 2); // Teckel + Berger Allemand
console.log("✅ MCP search_breeds (allemagne) :", searchResult.breeds.map((b) => b.name).join(", "));

const compareResult = JSON.parse(responses[3].result.content[0].text);
assert.equal(compareResult.rows.length, 6);
console.log("✅ MCP compare_breeds :", compareResult.breeds.join(" vs "));

const gapsResult = JSON.parse(responses[4].result.content[0].text);
assert.equal(gapsResult.totalBreeds, 13);
console.log("✅ MCP audit_catalog_gaps :", gapsResult.totalBreeds, "races | manques détectés :", gapsResult.detectedGaps);

console.log("\n🎉 Serveur MCP stdio validé de bout en bout !");
