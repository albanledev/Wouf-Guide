import { describe, expect, it } from "vitest";
import { z } from "zod";

const SmokeBreedSchema = z.object({
  slug: z.string().min(1),
  energy: z.number().int().min(1).max(5),
});

describe("Smoke harness check", () => {
  it("accepte un score valide et rejette un score hors bornes", () => {
    const valid = SmokeBreedSchema.safeParse({
      slug: "golden-retriever",
      energy: 4,
    });
    expect(valid.success).toBe(true);

    const invalid = SmokeBreedSchema.safeParse({
      slug: "golden-retriever",
      energy: 6,
    });
    expect(invalid.success).toBe(false);
  });
});
