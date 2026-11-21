import type { BreedSize, BudgetLevel, ScoreKey } from "@/domain/breed.schema";

export const SIZE_LABELS: Record<BreedSize, string> = {
  small: "Petit gabarit",
  medium: "Gabarit moyen",
  large: "Grand gabarit",
};

export const BUDGET_LABELS: Record<BudgetLevel, string> = {
  1: "Budget modéré (€)",
  2: "Budget moyen (€€)",
  3: "Budget élevé (€€€)",
};

export const BUDGET_SHORT: Record<BudgetLevel, string> = {
  1: "€",
  2: "€€",
  3: "€€€",
};

export const SCORE_META: Record<
  ScoreKey,
  { label: string; lowHint: string; highHint: string }
> = {
  energy: {
    label: "Énergie & dépense",
    lowHint: "Calme",
    highHint: "Grand sportif",
  },
  apartment: {
    label: "Vie en appartement",
    lowHint: "Jardin conseillé",
    highHint: "Très adapté",
  },
  family: {
    label: "Vie de famille & enfants",
    lowHint: "Foyer calme",
    highHint: "Très patient",
  },
  aloneTime: {
    label: "Tolérance à la solitude",
    lowHint: "Pot de colle",
    highHint: "Indépendant",
  },
  grooming: {
    label: "Facilité d'entretien",
    lowHint: "Entretien lourd",
    highHint: "Minimal",
  },
  trainability: {
    label: "Facilité d'éducation",
    lowHint: "Caractère têtu",
    highHint: "Très coopératif",
  },
};
