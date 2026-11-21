"use client";

import { useMemo, useState } from "react";
import type { Breed, BreedSize, BudgetLevel } from "@/domain/breed.schema";
import { filterBreeds, type BreedFilters } from "@/domain/filter-breeds";
import { BreedCard } from "./breed-card";

interface BreedCatalogClientProps {
  breeds: readonly Breed[];
}

const INITIAL_FILTERS: BreedFilters = {
  query: "",
};

export function BreedCatalogClient({ breeds }: BreedCatalogClientProps) {
  const [filters, setFilters] = useState<BreedFilters>(INITIAL_FILTERS);

  const filteredBreeds = useMemo(
    () => filterBreeds(breeds, filters),
    [breeds, filters],
  );

  const hasActiveFilters =
    Boolean(filters.query?.trim()) ||
    filters.size !== undefined ||
    filters.minApartment !== undefined ||
    filters.minFamily !== undefined ||
    filters.minAloneTime !== undefined ||
    filters.maxEnergy !== undefined ||
    filters.maxBudget !== undefined;

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  return (
    <section aria-label="Catalogue filtrable des races" className="space-y-6">
      <div className="rounded-3xl border border-[#e8ddd0] bg-[#fbf3e4]/80 p-5 shadow-xs sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <label
              htmlFor="breed-search"
              className="mb-1.5 block text-xs font-bold tracking-wide text-[#5c4d42] uppercase"
            >
              Rechercher une race, une origine…
            </label>
            <input
              id="breed-search"
              type="search"
              value={filters.query ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, query: event.target.value }))
              }
              placeholder="Ex. Golden, Écosse, renard, canapé…"
              className="w-full rounded-2xl border border-[#dccdb9] bg-white px-4 py-2.5 text-sm text-[#241b15] placeholder:text-[#6b5b4e] focus:border-[#c24115] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-3">
            <label
              htmlFor="filter-size"
              className="mb-1.5 block text-xs font-bold tracking-wide text-[#5c4d42] uppercase"
            >
              Gabarit
            </label>
            <div className="relative">
              <select
                id="filter-size"
                value={filters.size ?? ""}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    size: (event.target.value || undefined) as BreedSize | undefined,
                  }))
                }
                className="w-full appearance-none rounded-2xl border border-[#dccdb9] bg-white py-2.5 pr-10 pl-3.5 text-sm font-medium text-[#241b15] focus:border-[#c24115] focus:outline-none"
              >
                <option value="">Tous les gabarits</option>
                <option value="small">Petit (&lt; 10 kg)</option>
                <option value="medium">Moyen (10–25 kg)</option>
                <option value="large">Grand (&gt; 25 kg)</option>
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#5c4d42]"
              >
                <path
                  d="M5.5 7.5L10 12l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="filter-energy"
              className="mb-1.5 block text-xs font-bold tracking-wide text-[#5c4d42] uppercase"
            >
              Énergie max
            </label>
            <div className="relative">
              <select
                id="filter-energy"
                value={filters.maxEnergy ?? ""}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxEnergy: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
                className="w-full appearance-none rounded-2xl border border-[#dccdb9] bg-white py-2.5 pr-10 pl-3.5 text-sm font-medium text-[#241b15] focus:border-[#c24115] focus:outline-none"
              >
                <option value="">Peu importe</option>
                <option value="2">Calme (≤ 2/5)</option>
                <option value="3">Modéré (≤ 3/5)</option>
                <option value="4">Actif (≤ 4/5)</option>
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#5c4d42]"
              >
                <path
                  d="M5.5 7.5L10 12l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="filter-budget"
              className="mb-1.5 block text-xs font-bold tracking-wide text-[#5c4d42] uppercase"
            >
              Budget max
            </label>
            <div className="relative">
              <select
                id="filter-budget"
                value={filters.maxBudget ?? ""}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxBudget: event.target.value
                      ? (Number(event.target.value) as BudgetLevel)
                      : undefined,
                  }))
                }
                className="w-full appearance-none rounded-2xl border border-[#dccdb9] bg-white py-2.5 pr-10 pl-3.5 text-sm font-medium text-[#241b15] focus:border-[#c24115] focus:outline-none"
              >
                <option value="">Tous</option>
                <option value="1">Modéré (€)</option>
                <option value="2">Moyen (€€)</option>
                <option value="3">Élevé (€€€)</option>
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#5c4d42]"
              >
                <path
                  d="M5.5 7.5L10 12l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8ddd0] pt-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minApartment: prev.minApartment === 4 ? undefined : 4,
                }))
              }
              aria-pressed={filters.minApartment === 4}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                filters.minApartment === 4
                  ? "border-[#d94e1f] bg-[#d94e1f] text-white"
                  : "border-[#dccdb9] bg-white text-[#241b15] hover:border-[#d94e1f]"
              }`}
            >
              🏢 Top appartement (≥ 4/5)
            </button>

            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minFamily: prev.minFamily === 4 ? undefined : 4,
                }))
              }
              aria-pressed={filters.minFamily === 4}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                filters.minFamily === 4
                  ? "border-[#d94e1f] bg-[#d94e1f] text-white"
                  : "border-[#dccdb9] bg-white text-[#241b15] hover:border-[#d94e1f]"
              }`}
            >
              👨‍👩‍👧‍👦 Top famille (≥ 4/5)
            </button>

            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minAloneTime: prev.minAloneTime === 3 ? undefined : 3,
                }))
              }
              aria-pressed={filters.minAloneTime === 3}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                filters.minAloneTime === 3
                  ? "border-[#d94e1f] bg-[#d94e1f] text-white"
                  : "border-[#dccdb9] bg-white text-[#241b15] hover:border-[#d94e1f]"
              }`}
            >
              🔑 Gère la solitude (≥ 3/5)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#5c4d42]">
              {filteredBreeds.length} race{filteredBreeds.length > 1 ? "s" : ""} affichée
              {filteredBreeds.length > 1 ? "s" : ""}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-[#241b15] px-3 py-1.5 text-xs font-bold text-[#241b15] transition-colors hover:bg-[#241b15] hover:text-white"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredBreeds.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d8c7b2] bg-white p-10 text-center">
          <p className="font-display text-2xl font-bold text-[#241b15]">
            Aucun chien ne coche toutes ces cases…
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5c4d42]">
            Chaque race a ses compromis ! Essayez d&apos;assouplir un filtre ou de lancer le
            quiz pour trouver le meilleur équilibre.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-2xl bg-[#d94e1f] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b83d14]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBreeds.map((breed) => (
            <BreedCard key={breed.slug} breed={breed} />
          ))}
        </div>
      )}
    </section>
  );
}
