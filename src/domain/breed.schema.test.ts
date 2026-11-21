import { describe, expect, it } from "vitest";
import { BreedCatalogSchema, BreedSchema, type Breed } from "./breed.schema";

function createValidBreed(overrides: Partial<Breed> = {}): Breed {
  return {
    slug: "golden-retriever",
    name: "Golden Retriever",
    tagline: "Le meilleur pote qui repeint votre canapé en blond.",
    summary:
      "Chien de famille solaire et ultra coopératif, le Golden Retriever reste un chien de chasse d'eau enthousiaste qui demande de vraies sorties et accepte volontiers la boue.",
    origin: "Écosse",
    size: "large",
    weightKg: { min: 25, max: 34 },
    lifespanYears: { min: 10, max: 12 },
    budgetLevel: 3,
    scores: {
      energy: 4,
      apartment: 2,
      family: 5,
      aloneTime: 2,
      grooming: 1,
      trainability: 5,
    },
    pros: [
      "Patience remarquable avec les enfants et les invités du foyer.",
      "Très motivé par la nourriture, ce qui rend l'éducation fluide dès chiot.",
      "Sociable avec la majorité des chiens rencontrés au parc ou en balade.",
    ],
    cons: [
      "Perd d'importantes quantités de sous-poil toute l'année, aspirateur indispensable.",
      "Plonge dans chaque flaque ou étang croisé, impliquant séchage et rinçage réguliers.",
      "Supporte mal les longues journées seul sans compagnie ni activité mentale.",
    ],
    idealFor:
      "Foyer présent et actif qui aime marcher par tous les temps et tolère les poils sur le canapé.",
    avoidIf:
      "Personne absente 9h par jour en appartement ou maniaque d'un intérieur sans poils.",
    imagePath: "/images/breeds/golden-retriever.png",
    imageAlt: "Portrait illustré d'un Golden Retriever souriant au pelage doré",
    ...overrides,
  };
}

describe("BreedSchema", () => {
  it("accepte une fiche de race valide complète", () => {
    const breed = createValidBreed();
    expect(() => BreedSchema.parse(breed)).not.toThrow();
  });

  it("rejette un slug qui n'est pas en kebab-case minuscule", () => {
    expect(() => BreedSchema.parse(createValidBreed({ slug: "Golden-Retriever" }))).toThrow();
    expect(() => BreedSchema.parse(createValidBreed({ slug: "golden_retriever" }))).toThrow();
    expect(() => BreedSchema.parse(createValidBreed({ slug: "golden retriever" }))).toThrow();
  });

  it("rejette un score hors bornes (0 ou 6) ou non entier", () => {
    const base = createValidBreed();
    expect(() =>
      BreedSchema.parse({ ...base, scores: { ...base.scores, energy: 0 } }),
    ).toThrow();
    expect(() =>
      BreedSchema.parse({ ...base, scores: { ...base.scores, family: 6 } }),
    ).toThrow();
    expect(() =>
      BreedSchema.parse({ ...base, scores: { ...base.scores, apartment: 3.5 } }),
    ).toThrow();
  });

  it("rejette moins de 3 avantages ou moins de 3 inconvénients", () => {
    const base = createValidBreed();
    expect(() =>
      BreedSchema.parse({ ...base, pros: base.pros.slice(0, 2) }),
    ).toThrow();
    expect(() =>
      BreedSchema.parse({ ...base, cons: base.cons.slice(0, 2) }),
    ).toThrow();
  });

  it("rejette des bornes de poids ou d'espérance de vie incohérentes", () => {
    expect(() =>
      BreedSchema.parse(createValidBreed({ weightKg: { min: 30, max: 30 } })),
    ).toThrow();
    expect(() =>
      BreedSchema.parse(createValidBreed({ lifespanYears: { min: 14, max: 10 } })),
    ).toThrow();
  });

  it("rejette un imagePath qui ne correspond pas au slug", () => {
    expect(() =>
      BreedSchema.parse(
        createValidBreed({
          slug: "golden-retriever",
          imagePath: "/images/breeds/autre-chien.png",
        }),
      ),
    ).toThrow();
  });
});

describe("BreedCatalogSchema", () => {
  it("rejette un catalogue contenant des slugs en doublon", () => {
    const breedA = createValidBreed({ slug: "golden-retriever" });
    const breedB = createValidBreed({ slug: "golden-retriever", name: "Golden Bis" });
    expect(() => BreedCatalogSchema.parse([breedA, breedB])).toThrow();
  });
});
