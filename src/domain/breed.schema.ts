import { z } from "zod";

const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ScoreSchema = z.number().int().min(1).max(5);

export const BreedSizeSchema = z.enum(["small", "medium", "large"]);

export const BudgetLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const BreedScoresSchema = z.object({
  energy: ScoreSchema,
  apartment: ScoreSchema,
  family: ScoreSchema,
  aloneTime: ScoreSchema,
  grooming: ScoreSchema,
  trainability: ScoreSchema,
});

export const SCORE_KEYS = [
  "energy",
  "apartment",
  "family",
  "aloneTime",
  "grooming",
  "trainability",
] as const;

export const BreedSchema = z
  .object({
    slug: z.string().regex(KEBAB_CASE_REGEX, "Le slug doit être en kebab-case minuscule."),
    name: z.string().min(2).max(60),
    tagline: z.string().min(10).max(120),
    summary: z.string().min(40).max(400),
    origin: z.string().min(2).max(80),
    size: BreedSizeSchema,
    weightKg: z
      .object({
        min: z.number().int().positive(),
        max: z.number().int().positive(),
      })
      .refine((range) => range.min < range.max, {
        message: "weightKg.min doit être strictement inférieur à weightKg.max.",
      }),
    lifespanYears: z
      .object({
        min: z.number().int().min(5).max(20),
        max: z.number().int().min(5).max(20),
      })
      .refine((range) => range.min <= range.max, {
        message: "lifespanYears.min doit être inférieur ou égal à lifespanYears.max.",
      }),
    budgetLevel: BudgetLevelSchema,
    scores: BreedScoresSchema,
    pros: z.array(z.string().min(15)).min(3),
    cons: z.array(z.string().min(15)).min(3),
    idealFor: z.string().min(20),
    avoidIf: z.string().min(20),
    imagePath: z.string().min(1),
    imageAlt: z.string().min(10),
  })
  .refine((breed) => breed.imagePath === `/images/breeds/${breed.slug}.png`, {
    message: "imagePath doit correspondre exactement à /images/breeds/<slug>.png.",
    path: ["imagePath"],
  });

export const BreedCatalogSchema = z.array(BreedSchema).superRefine((breeds, ctx) => {
  const seen = new Set<string>();
  breeds.forEach((breed, index) => {
    if (seen.has(breed.slug)) {
      ctx.addIssue({
        code: "custom",
        message: `Slug en doublon détecté : "${breed.slug}".`,
        path: [index, "slug"],
      });
    }
    seen.add(breed.slug);
  });
});

export type BreedSize = z.infer<typeof BreedSizeSchema>;
export type BudgetLevel = z.infer<typeof BudgetLevelSchema>;
export type BreedScores = z.infer<typeof BreedScoresSchema>;
export type ScoreKey = (typeof SCORE_KEYS)[number];
export type Breed = z.infer<typeof BreedSchema>;
