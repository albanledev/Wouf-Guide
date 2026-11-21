import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BreedCatalogSchema } from "@/domain/breed.schema";
import { BREEDS } from "../breeds";

describe("Catalogue des races (src/data/breeds.ts)", () => {
  it("contient entre 12 et 15 races conformes au schéma Zod (CA-01)", () => {
    expect(BREEDS.length).toBeGreaterThanOrEqual(12);
    expect(BREEDS.length).toBeLessThanOrEqual(15);
    expect(() => BreedCatalogSchema.parse(BREEDS)).not.toThrow();
  });

  it("possède des slugs uniques sur tout le catalogue", () => {
    const slugs = BREEDS.map((breed) => breed.slug);
    expect(new Set(slugs).size).toBe(BREEDS.length);
  });

  it("référence uniquement des portraits réellement présents sur disque sous public/ (CA-03)", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    for (const breed of BREEDS) {
      const relativePath = breed.imagePath.replace(/^\//, "");
      const fullPath = path.join(publicDir, relativePath);
      expect(fs.existsSync(fullPath), `Portrait manquant : ${fullPath}`).toBe(true);
    }
  });
});
