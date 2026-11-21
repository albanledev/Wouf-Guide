import { describe, expect, it } from "vitest";
import type { Breed } from "./breed.schema";
import { filterBreeds } from "./filter-breeds";

function makeBreed(overrides: Partial<Breed> & Pick<Breed, "slug" | "name">): Breed {
  return {
    tagline: "Compagnon fidèle et curieux pour toute la famille.",
    summary:
      "Un chien équilibré avec de vraies qualités et quelques contraintes quotidiennes à connaître avant d'adopter.",
    origin: "France",
    size: "medium",
    weightKg: { min: 10, max: 18 },
    lifespanYears: { min: 11, max: 14 },
    budgetLevel: 2,
    scores: {
      energy: 3,
      apartment: 3,
      family: 3,
      aloneTime: 3,
      grooming: 3,
      trainability: 3,
    },
    pros: [
      "Très agréable au quotidien avec un caractère stable.",
      "S'adapte facilement aux balades variées en ville ou nature.",
      "Entretien raisonnable qui reste simple chaque semaine.",
    ],
    cons: [
      "Demande du temps chaque jour pour ne pas s'ennuyer.",
      "Budget vétérinaire et alimentation à prévoir sur la durée.",
      "Éducation cohérente nécessaire dès les premiers mois.",
    ],
    idealFor: "Foyer disponible qui aime marcher régulièrement et s'investir.",
    avoidIf: "Personne sans temps libre ni envie de sortir par temps de pluie.",
    imagePath: `/images/breeds/${overrides.slug}.png`,
    imageAlt: `Portrait illustré de ${overrides.name}`,
    ...overrides,
  };
}

const SAMPLE_BREEDS: Breed[] = [
  makeBreed({
    slug: "golden-retriever",
    name: "Golden Retriever",
    origin: "Écosse",
    tagline: "Le meilleur pote qui repeint votre canapé en blond.",
    size: "large",
    budgetLevel: 3,
    scores: { energy: 4, apartment: 2, family: 5, aloneTime: 2, grooming: 1, trainability: 5 },
  }),
  makeBreed({
    slug: "bouledogue-francais",
    name: "Bouledogue Français",
    origin: "France",
    tagline: "Un clown ronfleur taillé pour le canapé.",
    size: "small",
    budgetLevel: 3,
    scores: { energy: 2, apartment: 5, family: 4, aloneTime: 3, grooming: 4, trainability: 3 },
  }),
  makeBreed({
    slug: "bichon-frise",
    name: "Bichon Frisé",
    origin: "France / Belgique",
    tagline: "Un petit nuage joyeux sans poils sur vos pulls.",
    size: "small",
    budgetLevel: 2,
    scores: { energy: 2, apartment: 5, family: 5, aloneTime: 1, grooming: 1, trainability: 4 },
  }),
  makeBreed({
    slug: "shiba-inu",
    name: "Shiba Inu",
    origin: "Japon",
    tagline: "Un chat dans un corps de petit renard.",
    size: "medium",
    budgetLevel: 2,
    scores: { energy: 3, apartment: 4, family: 3, aloneTime: 4, grooming: 3, trainability: 2 },
  }),
];

describe("filterBreeds", () => {
  it("retourne toutes les races triées alphabétiquement en français sans muter l'entrée", () => {
    const originalOrder = SAMPLE_BREEDS.map((b) => b.slug);
    const result = filterBreeds(SAMPLE_BREEDS, {});

    expect(result.map((b) => b.name)).toEqual([
      "Bichon Frisé",
      "Bouledogue Français",
      "Golden Retriever",
      "Shiba Inu",
    ]);
    expect(SAMPLE_BREEDS.map((b) => b.slug)).toEqual(originalOrder);
    expect(result).not.toBe(SAMPLE_BREEDS);
  });

  it("filtre par recherche textuelle insensible à la casse, aux accents et aux espaces (CA-04)", () => {
    expect(filterBreeds(SAMPLE_BREEDS, { query: "  ecosse  " }).map((b) => b.slug)).toEqual([
      "golden-retriever",
    ]);
    expect(filterBreeds(SAMPLE_BREEDS, { query: "FRISE" }).map((b) => b.slug)).toEqual([
      "bichon-frise",
    ]);
    expect(filterBreeds(SAMPLE_BREEDS, { query: "renard" }).map((b) => b.slug)).toEqual([
      "shiba-inu",
    ]);
  });

  it("combine les filtres en ET logique (CA-05)", () => {
    const result = filterBreeds(SAMPLE_BREEDS, {
      size: "small",
      minApartment: 4,
      minAloneTime: 3,
    });
    expect(result.map((b) => b.slug)).toEqual(["bouledogue-francais"]);

    const budgetFriendly = filterBreeds(SAMPLE_BREEDS, {
      maxEnergy: 3,
      maxBudget: 2,
      minFamily: 4,
    });
    expect(budgetFriendly.map((b) => b.slug)).toEqual(["bichon-frise"]);
  });

  it("retourne un tableau vide quand aucune race ne correspond ou si l'entrée est vide (CA-06)", () => {
    expect(filterBreeds(SAMPLE_BREEDS, { query: "dragon" })).toEqual([]);
    expect(filterBreeds([], { size: "small" })).toEqual([]);
  });
});
