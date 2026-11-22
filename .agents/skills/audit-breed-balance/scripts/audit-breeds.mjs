import fs from "node:fs";
import path from "node:path";

const breedsFile = path.resolve(process.cwd(), "src/data/breeds.ts");
const source = fs.readFileSync(breedsFile, "utf8");

// Extraction légère des fiches depuis RAW_BREEDS sans dépendance externe
const arrayMatch = source.match(/const RAW_BREEDS:\s*Breed\[\]\s*=\s*(\[[\s\S]*?\n\]);/);
if (!arrayMatch) {
  console.error("Impossible de localiser RAW_BREEDS dans src/data/breeds.ts");
  process.exit(1);
}

// Évaluation sandboxée simple d'un littéral de tableau JS pur
const breeds = new Function(`return (${arrayMatch[1]});`)();

let warnings = 0;

console.log(`\n🔎 Audit éditorial déterministe — ${breeds.length} races analysées\n`);

for (const breed of breeds) {
  const issues = [];
  const adaptScores = [
    breed.scores.apartment,
    breed.scores.family,
    breed.scores.aloneTime,
    breed.scores.grooming,
    breed.scores.trainability,
  ];
  const avgAdapt = adaptScores.reduce((a, b) => a + b, 0) / adaptScores.length;
  const fivesCount = Object.values(breed.scores).filter((v) => v === 5).length;

  if (avgAdapt > 4.0) {
    issues.push(`moyenne adaptation élevée (${avgAdapt.toFixed(2)}/5 — risque de race "parfaite")`);
  }
  if (fivesCount > 3) {
    issues.push(`${fivesCount} scores à 5/5 (inflation possible)`);
  }
  if (Math.abs(breed.pros.length - breed.cons.length) > 1) {
    issues.push(`déséquilibre nombre pros (${breed.pros.length}) vs cons (${breed.cons.length})`);
  }

  const prosChars = breed.pros.join(" ").length;
  const consChars = breed.cons.join(" ").length;
  const consRatio = prosChars > 0 ? consChars / prosChars : 0;
  if (consRatio < 0.7) {
    issues.push(`inconvénients trop courts (${Math.round(consRatio * 100)}% de la longueur des avantages)`);
  }

  if (issues.length === 0) {
    console.log(
      `  ✅ ${breed.name.padEnd(24)} | adapt: ${avgAdapt.toFixed(1)}/5 | pros/cons: ${breed.pros.length}/${breed.cons.length} (${Math.round(consRatio * 100)}%)`,
    );
  } else {
    warnings += issues.length;
    console.log(`  ⚠️  ${breed.name} :`);
    for (const issue of issues) {
      console.log(`     - ${issue}`);
    }
  }
}

console.log(
  warnings === 0
    ? `\n🎉 Aucune alerte d'équilibre détectée sur les ${breeds.length} fiches.\n`
    : `\n⚠️  ${warnings} alerte(s) éditoriale(s) à examiner.\n`,
);
