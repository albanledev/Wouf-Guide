import { describe, expect, it } from "vitest";
import type { Breed } from "./breed.schema";
import { matchBreedsForQuiz, type QuizAnswers } from "./quiz-matcher";

function makeBreed(slug: string, name: string, scores: Breed["scores"]): Breed {
  return {
    slug,
    name,
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
    imageAlt: `Portrait illustré de ${name}`,
  };
}

const CALM_APARTMENT_DOG = makeBreed("calme-appart", "Calme Appart", {
  energy: 2,
  apartment: 5,
  family: 5,
  aloneTime: 5,
  grooming: 5,
  trainability: 5,
});

const WORK_ATHLETE_DOG = makeBreed("athlete-travail", "Athlète Travail", {
  energy: 5,
  apartment: 1,
  family: 2,
  aloneTime: 1,
  grooming: 1,
  trainability: 2,
});

const BALANCED_DOG = makeBreed("equilibre", "Équilibré", {
  energy: 3,
  apartment: 3,
  family: 4,
  aloneTime: 3,
  grooming: 3,
  trainability: 4,
});

const EXTRA_DOG = makeBreed("quatrieme", "Quatrième", {
  energy: 4,
  apartment: 2,
  family: 3,
  aloneTime: 2,
  grooming: 2,
  trainability: 3,
});

describe("matchBreedsForQuiz", () => {
  it("retourne un tableau vide si le catalogue est vide (CA-13)", () => {
    const answers: QuizAnswers = {
      housing: "apartment",
      activityLevel: 2,
      hasChildren: false,
      dailyAbsence: "medium",
      groomingTolerance: "medium",
      experience: "beginner",
    };
    expect(matchBreedsForQuiz([], answers)).toEqual([]);
  });

  it("classe mieux un chien calme d'appartement qu'un athlète exigeant pour un profil citadin débutant (CA-11)", () => {
    const answers: QuizAnswers = {
      housing: "apartment",
      activityLevel: 2,
      hasChildren: true,
      dailyAbsence: "high",
      groomingTolerance: "low",
      experience: "beginner",
    };

    const results = matchBreedsForQuiz(
      [WORK_ATHLETE_DOG, EXTRA_DOG, BALANCED_DOG, CALM_APARTMENT_DOG],
      answers,
    );

    expect(results).toHaveLength(3);
    expect(results[0]?.breed.slug).toBe("calme-appart");
    expect(results[0]?.matchPercentage).toBe(100);
    expect(results[0]?.strengths.length).toBeGreaterThanOrEqual(1);
    expect(results[0]?.strengths.length).toBeLessThanOrEqual(2);
    expect(results[0]?.watchOut).toBeNull();

    expect(results[1]?.breed.slug).toBe("equilibre");
    expect(results[1]?.watchOut).not.toBeNull();
    expect(results.map((r) => r.breed.slug)).not.toContain("athlete-travail");
  });

  it("est 100 % déterministe et départage les égalités parfaites par ordre alphabétique de slug (CA-12)", () => {
    const cloneZ = makeBreed("z-race", "Z Race", {
      energy: 3,
      apartment: 4,
      family: 4,
      aloneTime: 3,
      grooming: 3,
      trainability: 4,
    });
    const cloneA = makeBreed("a-race", "A Race", {
      energy: 3,
      apartment: 4,
      family: 4,
      aloneTime: 3,
      grooming: 3,
      trainability: 4,
    });

    const answers: QuizAnswers = {
      housing: "house_large_yard",
      activityLevel: 3,
      hasChildren: false,
      dailyAbsence: "low",
      groomingTolerance: "high",
      experience: "experienced",
    };

    const run1 = matchBreedsForQuiz([cloneZ, cloneA], answers);
    const run2 = matchBreedsForQuiz([cloneZ, cloneA], answers);

    expect(run1).toEqual(run2);
    expect(run1.map((r) => r.breed.slug)).toEqual(["a-race", "z-race"]);
    expect(run1[0]?.matchPercentage).toBe(100);
  });
});
