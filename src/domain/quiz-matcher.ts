import type { Breed } from "./breed.schema";

export type HousingType = "apartment" | "house_small_yard" | "house_large_yard";
export type DailyAbsenceLevel = "low" | "medium" | "high";
export type GroomingTolerance = "low" | "medium" | "high";
export type OwnerExperience = "beginner" | "experienced";

export interface QuizAnswers {
  housing: HousingType;
  activityLevel: 1 | 2 | 3 | 4 | 5;
  hasChildren: boolean;
  dailyAbsence: DailyAbsenceLevel;
  groomingTolerance: GroomingTolerance;
  experience: OwnerExperience;
}

export interface QuizMatchResult {
  breed: Breed;
  matchPercentage: number;
  strengths: string[];
  watchOut: string | null;
}

interface CriterionEvaluation {
  weight: number;
  score: number;
  strengthLabel: string;
  watchOutLabel: string;
}

function evaluateHousing(breed: Breed, housing: HousingType): number {
  if (housing === "apartment") {
    return (breed.scores.apartment - 1) / 4;
  }
  if (housing === "house_small_yard") {
    return Math.min(1, (breed.scores.apartment + 1) / 5);
  }
  return 1;
}

function evaluateEnergy(breed: Breed, activityLevel: 1 | 2 | 3 | 4 | 5): number {
  const diff = Math.abs(breed.scores.energy - activityLevel);
  return 1 - diff / 4;
}

function evaluateFamily(breed: Breed, hasChildren: boolean): number {
  if (!hasChildren) {
    return 1;
  }
  return (breed.scores.family - 1) / 4;
}

function evaluateAloneTime(breed: Breed, dailyAbsence: DailyAbsenceLevel): number {
  const target = dailyAbsence === "low" ? 1 : dailyAbsence === "medium" ? 3 : 5;
  if (breed.scores.aloneTime >= target) {
    return 1;
  }
  return Math.max(0, 1 - (target - breed.scores.aloneTime) / 4);
}

function evaluateGrooming(breed: Breed, tolerance: GroomingTolerance): number {
  const target = tolerance === "low" ? 5 : tolerance === "medium" ? 3 : 1;
  if (breed.scores.grooming >= target) {
    return 1;
  }
  return Math.max(0, 1 - (target - breed.scores.grooming) / 4);
}

function evaluateTrainability(breed: Breed, experience: OwnerExperience): number {
  if (experience === "experienced") {
    return 1;
  }
  return (breed.scores.trainability - 1) / 4;
}

function evaluateBreed(breed: Breed, answers: QuizAnswers): QuizMatchResult {
  const criteria: CriterionEvaluation[] = [
    {
      weight: 0.25,
      score: evaluateHousing(breed, answers.housing),
      strengthLabel: "Bien adapté à votre logement au quotidien",
      watchOutLabel: "Logement un peu juste pour son besoin d'espace",
    },
    {
      weight: 0.25,
      score: evaluateEnergy(breed, answers.activityLevel),
      strengthLabel: "Niveau d'énergie aligné avec votre rythme de sorties",
      watchOutLabel: "Décalage entre son besoin de dépense et votre rythme",
    },
    {
      weight: 0.2,
      score: evaluateAloneTime(breed, answers.dailyAbsence),
      strengthLabel: "Gère bien vos temps d'absence habituels",
      watchOutLabel: "Supporte difficilement vos horaires d'absence",
    },
    {
      weight: 0.1,
      score: evaluateFamily(breed, answers.hasChildren),
      strengthLabel: "Très à l'aise avec une vie de famille animée",
      watchOutLabel: "Demande beaucoup de vigilance avec de jeunes enfants",
    },
    {
      weight: 0.1,
      score: evaluateGrooming(breed, answers.groomingTolerance),
      strengthLabel: "Entretien du pelage compatible avec votre temps disponible",
      watchOutLabel: "Entretien et perte de poils plus exigeants que souhaité",
    },
    {
      weight: 0.1,
      score: evaluateTrainability(breed, answers.experience),
      strengthLabel: "Éducation accessible pour votre niveau d'expérience",
      watchOutLabel: "Caractère exigeant qui demande une éducation solide",
    },
  ];

  const weightedSum = criteria.reduce(
    (sum, item) => sum + item.score * item.weight,
    0,
  );
  const matchPercentage = Math.round(weightedSum * 100);

  const strengths = [...criteria]
    .filter((item) => item.score >= 0.75)
    .sort((a, b) => b.score - a.score || b.weight - a.weight)
    .slice(0, 2)
    .map((item) => item.strengthLabel);

  const weakest = [...criteria]
    .filter((item) => item.score < 0.75)
    .sort((a, b) => a.score - b.score || b.weight - a.weight)[0];

  return {
    breed,
    matchPercentage,
    strengths,
    watchOut: weakest ? weakest.watchOutLabel : null,
  };
}

export function matchBreedsForQuiz(
  breeds: readonly Breed[],
  answers: QuizAnswers,
): QuizMatchResult[] {
  return breeds
    .map((breed) => evaluateBreed(breed, answers))
    .sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return a.breed.slug.localeCompare(b.breed.slug);
    })
    .slice(0, 3);
}
