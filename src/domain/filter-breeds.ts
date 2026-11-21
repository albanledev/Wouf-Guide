import type { Breed, BreedSize, BudgetLevel } from "./breed.schema";

export interface BreedFilters {
  query?: string;
  size?: BreedSize;
  minApartment?: number;
  minFamily?: number;
  minAloneTime?: number;
  maxEnergy?: number;
  maxBudget?: BudgetLevel;
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterBreeds(
  breeds: readonly Breed[],
  filters: BreedFilters,
): Breed[] {
  const normalizedQuery = filters.query ? normalizeText(filters.query) : "";

  return breeds
    .filter((breed) => {
      if (normalizedQuery.length > 0) {
        const haystack = normalizeText(
          `${breed.name} ${breed.tagline} ${breed.origin}`,
        );
        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (filters.size !== undefined && breed.size !== filters.size) {
        return false;
      }

      if (
        filters.minApartment !== undefined &&
        breed.scores.apartment < filters.minApartment
      ) {
        return false;
      }

      if (
        filters.minFamily !== undefined &&
        breed.scores.family < filters.minFamily
      ) {
        return false;
      }

      if (
        filters.minAloneTime !== undefined &&
        breed.scores.aloneTime < filters.minAloneTime
      ) {
        return false;
      }

      if (
        filters.maxEnergy !== undefined &&
        breed.scores.energy > filters.maxEnergy
      ) {
        return false;
      }

      if (
        filters.maxBudget !== undefined &&
        breed.budgetLevel > filters.maxBudget
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}
