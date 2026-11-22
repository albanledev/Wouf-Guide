#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const REPO_ROOT = process.env.WOUFGUIDE_ROOT || path.resolve(import.meta.dirname, "..");

const SCORE_KEYS = [
  "energy",
  "apartment",
  "family",
  "aloneTime",
  "grooming",
  "trainability",
];

function loadBreeds() {
  const breedsFile = path.join(REPO_ROOT, "src/data/breeds.ts");
  const source = fs.readFileSync(breedsFile, "utf8");
  const match = source.match(/const RAW_BREEDS:\s*Breed\[\]\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) {
    throw new Error("Impossible de lire RAW_BREEDS dans src/data/breeds.ts");
  }
  return new Function(`return (${match[1]});`)();
}

function normalize(text) {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function handleSearchBreeds(args = {}) {
  const breeds = loadBreeds();
  const query = normalize(args.query || "");
  const matches = breeds
    .filter((breed) => {
      if (query) {
        const haystack = normalize(`${breed.name} ${breed.tagline} ${breed.origin}`);
        if (!haystack.includes(query)) return false;
      }
      if (args.size && breed.size !== args.size) return false;
      if (args.minApartment !== undefined && breed.scores.apartment < args.minApartment) {
        return false;
      }
      if (args.maxEnergy !== undefined && breed.scores.energy > args.maxEnergy) {
        return false;
      }
      if (args.maxBudget !== undefined && breed.budgetLevel > args.maxBudget) {
        return false;
      }
      return true;
    })
    .map((breed) => ({
      slug: breed.slug,
      name: breed.name,
      origin: breed.origin,
      size: breed.size,
      budgetLevel: breed.budgetLevel,
      scores: breed.scores,
      tagline: breed.tagline,
    }));

  return { count: matches.length, breeds: matches };
}

function handleCompareBreeds(args = {}) {
  const slugs = Array.isArray(args.slugs) ? args.slugs : [];
  if (slugs.length < 2 || slugs.length > 3) {
    throw new Error("Fournissez entre 2 et 3 slugs distincts à comparer.");
  }
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Les slugs fournis doivent être distincts.");
  }

  const breeds = loadBreeds();
  const selected = slugs.map((slug) => {
    const found = breeds.find((b) => b.slug === slug);
    if (!found) throw new Error(`Race inconnue : "${slug}".`);
    return found;
  });

  const rows = SCORE_KEYS.map((criterion) => {
    const values = selected.map((b) => ({ slug: b.slug, score: b.scores[criterion] }));
    const maxScore = Math.max(...values.map((v) => v.score));
    const minScore = Math.min(...values.map((v) => v.score));
    const spread = maxScore - minScore;
    return {
      criterion,
      values,
      spread,
      hasNotableDifference: spread >= 2,
      leaderSlugs:
        spread === 0 ? [] : values.filter((v) => v.score === maxScore).map((v) => v.slug),
    };
  });

  return { breeds: selected.map((b) => b.name), rows };
}

function handleAuditCatalogGaps() {
  const breeds = loadBreeds();
  const bySize = { small: 0, medium: 0, large: 0 };
  const byBudget = { 1: 0, 2: 0, 3: 0 };

  for (const breed of breeds) {
    bySize[breed.size] = (bySize[breed.size] || 0) + 1;
    byBudget[breed.budgetLevel] = (byBudget[breed.budgetLevel] || 0) + 1;
  }

  const gaps = [];
  if (byBudget[1] === 0) {
    gaps.push("Aucune race au budget modéré (budgetLevel = 1).");
  }
  if (!breeds.some((b) => b.size === "large" && b.scores.energy <= 2)) {
    gaps.push("Aucun grand chien très calme (size = large, energy <= 2).");
  }
  if (!breeds.some((b) => b.scores.aloneTime >= 5)) {
    gaps.push("Aucune race notée 5/5 en tolérance à la solitude.");
  }

  return {
    totalBreeds: breeds.length,
    bySize,
    byBudget,
    detectedGaps: gaps,
  };
}

const TOOLS = [
  {
    name: "search_breeds",
    description:
      "Recherche et filtre les races du catalogue WoufGuide par texte, gabarit, appartement, énergie max et budget max.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Mot-clé (nom, origine, accroche)" },
        size: { type: "string", enum: ["small", "medium", "large"] },
        minApartment: { type: "integer", minimum: 1, maximum: 5 },
        maxEnergy: { type: "integer", minimum: 1, maximum: 5 },
        maxBudget: { type: "integer", minimum: 1, maximum: 3 },
      },
    },
  },
  {
    name: "compare_breeds",
    description:
      "Compare 2 à 3 races du catalogue WoufGuide sur leurs 6 scores et identifie les écarts marqués (>= 2 pts).",
    inputSchema: {
      type: "object",
      required: ["slugs"],
      properties: {
        slugs: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 3,
        },
      },
    },
  },
  {
    name: "audit_catalog_gaps",
    description:
      "Analyse la couverture du catalogue WoufGuide (gabarits, budgets, profils extrêmes) et identifie les manques éditoriaux.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function handleMessage(msg) {
  if (!msg || typeof msg !== "object") return;
  const { id, method, params } = msg;

  // Les notifications n'attendent pas de réponse
  if (id === undefined) return;

  try {
    if (method === "initialize") {
      send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "woufguide-catalog", version: "1.0.0" },
        },
      });
      return;
    }

    if (method === "tools/list") {
      send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
      return;
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments ?? {};
      let data;

      if (toolName === "search_breeds") {
        data = handleSearchBreeds(toolArgs);
      } else if (toolName === "compare_breeds") {
        data = handleCompareBreeds(toolArgs);
      } else if (toolName === "audit_catalog_gaps") {
        data = handleAuditCatalogGaps();
      } else {
        throw new Error(`Outil inconnu : ${toolName}`);
      }

      send({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        },
      });
      return;
    }

    send({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Méthode non supportée : ${method}` },
    });
  } catch (err) {
    send({
      jsonrpc: "2.0",
      id,
      result: {
        isError: true,
        content: [{ type: "text", text: err instanceof Error ? err.message : String(err) }],
      },
    });
  }
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    handleMessage(JSON.parse(trimmed));
  } catch {
    // Ignore lignes non-JSON
  }
});
