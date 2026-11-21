import { SCORE_KEYS, type Breed, type ScoreKey } from "./breed.schema";

export interface ScoreComparisonValue {
  slug: string;
  score: number;
}

export interface ScoreComparisonRow {
  criterion: ScoreKey;
  values: ScoreComparisonValue[];
  maxScore: number;
  minScore: number;
  spread: number;
  hasNotableDifference: boolean;
  leaderSlugs: string[];
}

export interface BreedComparison {
  breeds: Breed[];
  rows: ScoreComparisonRow[];
}

export function compareBreeds(breeds: readonly Breed[]): BreedComparison {
  if (breeds.length < 2) {
    throw new Error("Sélectionnez au moins 2 races à comparer.");
  }
  if (breeds.length > 3) {
    throw new Error("Vous pouvez comparer au maximum 3 races à la fois.");
  }

  const uniqueSlugs = new Set(breeds.map((breed) => breed.slug));
  if (uniqueSlugs.size !== breeds.length) {
    throw new Error("Les races sélectionnées doivent être distinctes.");
  }

  const rows: ScoreComparisonRow[] = SCORE_KEYS.map((criterion) => {
    const values: ScoreComparisonValue[] = breeds.map((breed) => ({
      slug: breed.slug,
      score: breed.scores[criterion],
    }));

    const numericScores = values.map((entry) => entry.score);
    const maxScore = Math.max(...numericScores);
    const minScore = Math.min(...numericScores);
    const spread = maxScore - minScore;
    const hasNotableDifference = spread >= 2;
    const leaderSlugs =
      spread === 0
        ? []
        : values
            .filter((entry) => entry.score === maxScore)
            .map((entry) => entry.slug);

    return {
      criterion,
      values,
      maxScore,
      minScore,
      spread,
      hasNotableDifference,
      leaderSlugs,
    };
  });

  return {
    breeds: [...breeds],
    rows,
  };
}
