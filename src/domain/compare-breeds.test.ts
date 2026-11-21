import { describe, expect, it } from "vitest";
import type { Breed } from "./breed.schema";
import { compareBreeds } from "./compare-breeds";

function makeBreed(slug: string, scores: Breed["scores"]): Breed {
  return {
    slug,
    name: slug,
    tagline: "Compagnon fidèle et curieux pour toute la famille.",
    summary:
      "Un chien équilibré avec de vraies qualités et quelques contraintes quotidiennes à connaître avant d'adopter.",
    origin: "France",
    size: "medium",
    weightKg: { min: 10, max: 18 },
    lifespanYears: { min: 11, max: 14 },
    budgetLevel: 2,
    scores,
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
    imagePath: `/images/breeds/${slug}.png`,
    imageAlt: `Portrait illustré de ${slug}`,
  };
}

const BREED_A = makeBreed("race-a", {
  energy: 5,
  apartment: 2,
  family: 4,
  aloneTime: 2,
  grooming: 3,
  trainability: 5,
});

const BREED_B = makeBreed("race-b", {
  energy: 2,
  apartment: 5,
  family: 4,
  aloneTime: 3,
  grooming: 3,
  trainability: 4,
});

const BREED_C = makeBreed("race-c", {
  energy: 5,
  apartment: 3,
  family: 4,
  aloneTime: 5,
  grooming: 1,
  trainability: 2,
});

const BREED_D = makeBreed("race-d", {
  energy: 3,
  apartment: 3,
  family: 3,
  aloneTime: 3,
  grooming: 3,
  trainability: 3,
});

describe("compareBreeds", () => {
  it("lève une erreur explicite si moins de 2 ou plus de 3 races sont fournies (CA-07)", () => {
    expect(() => compareBreeds([])).toThrow("Sélectionnez au moins 2 races à comparer.");
    expect(() => compareBreeds([BREED_A])).toThrow("Sélectionnez au moins 2 races à comparer.");
    expect(() => compareBreeds([BREED_A, BREED_B, BREED_C, BREED_D])).toThrow(
      "Vous pouvez comparer au maximum 3 races à la fois.",
    );
  });

  it("lève une erreur explicite en cas de doublon de slug (CA-08)", () => {
    expect(() => compareBreeds([BREED_A, BREED_A])).toThrow(
      "Les races sélectionnées doivent être distinctes.",
    );
  });

  it("gère les égalités parfaites sans vainqueur artificiel (CA-09)", () => {
    const result = compareBreeds([BREED_A, BREED_B]);
    const familyRow = result.rows.find((row) => row.criterion === "family");

    expect(familyRow).toEqual({
      criterion: "family",
      values: [
        { slug: "race-a", score: 4 },
        { slug: "race-b", score: 4 },
      ],
      maxScore: 4,
      minScore: 4,
      spread: 0,
      hasNotableDifference: false,
      leaderSlugs: [],
    });
  });

  it("identifie les écarts notables (>= 2) et les leaders, y compris les co-leaders à 3 races (CA-10)", () => {
    const twoWay = compareBreeds([BREED_A, BREED_B]);
    const energyTwo = twoWay.rows.find((row) => row.criterion === "energy");
    expect(energyTwo?.spread).toBe(3);
    expect(energyTwo?.hasNotableDifference).toBe(true);
    expect(energyTwo?.leaderSlugs).toEqual(["race-a"]);

    const trainabilityTwo = twoWay.rows.find((row) => row.criterion === "trainability");
    expect(trainabilityTwo?.spread).toBe(1);
    expect(trainabilityTwo?.hasNotableDifference).toBe(false);
    expect(trainabilityTwo?.leaderSlugs).toEqual(["race-a"]);

    const threeWay = compareBreeds([BREED_A, BREED_B, BREED_C]);
    const energyThree = threeWay.rows.find((row) => row.criterion === "energy");
    expect(energyThree?.spread).toBe(3);
    expect(energyThree?.leaderSlugs).toEqual(["race-a", "race-c"]);
  });
});
