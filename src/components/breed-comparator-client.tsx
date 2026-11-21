"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Breed } from "@/domain/breed.schema";
import { compareBreeds } from "@/domain/compare-breeds";
import { BUDGET_LABELS, SCORE_META, SIZE_LABELS } from "./breed-labels";

interface BreedComparatorClientProps {
  breeds: readonly Breed[];
  initialSlugs: string[];
}

export function BreedComparatorClient({
  breeds,
  initialSlugs,
}: BreedComparatorClientProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);

  const selectedBreeds = useMemo(
    () =>
      selectedSlugs
        .map((slug) => breeds.find((breed) => breed.slug === slug))
        .filter((breed): breed is Breed => breed !== undefined),
    [breeds, selectedSlugs],
  );

  const comparison = useMemo(() => {
    if (selectedBreeds.length < 2 || selectedBreeds.length > 3) {
      return null;
    }
    return compareBreeds(selectedBreeds);
  }, [selectedBreeds]);

  function toggleBreed(slug: string) {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, slug];
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#e8ddd0] bg-[#fbf3e4]/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-[#241b15]">
            Choisissez 2 ou 3 races ({selectedSlugs.length}/3 sélectionnées)
          </h2>
          <p className="text-xs font-medium text-[#5c4d42]">
            Cliquez sur une race pour l&apos;ajouter ou la retirer du duel.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {breeds.map((breed) => {
            const isSelected = selectedSlugs.includes(breed.slug);
            const isDisabled = !isSelected && selectedSlugs.length >= 3;
            return (
              <button
                key={breed.slug}
                type="button"
                disabled={isDisabled}
                aria-pressed={isSelected}
                onClick={() => toggleBreed(breed.slug)}
                className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm ${
                  isSelected
                    ? "border-[#c24115] bg-[#c24115] text-white shadow-xs"
                    : isDisabled
                      ? "cursor-not-allowed border-[#e8ddd0] bg-white/50 text-[#a59588]"
                      : "border-[#dccdb9] bg-white text-[#241b15] hover:border-[#c24115] hover:text-[#c24115]"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {breed.name}
              </button>
            );
          })}
        </div>
      </section>

      {!comparison ? (
        <div className="rounded-3xl border border-dashed border-[#d8c7b2] bg-white p-10 text-center">
          <p className="font-display text-2xl font-bold text-[#241b15]">
            Sélectionnez au moins 2 races pour lancer la comparaison
          </p>
          <p className="mt-2 text-sm text-[#5c4d42]">
            Vous pouvez comparer jusqu&apos;à 3 races côte à côte pour repérer immédiatement
            les vrais écarts.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="overflow-x-auto rounded-[2rem] border border-[#e8ddd0] bg-white p-5 shadow-[0_8px_24px_rgba(36,27,21,0.05)] sm:p-6">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e8ddd0]">
                  <th className="w-52 pb-5 pr-4 align-bottom text-xs font-bold tracking-wide text-[#7a695c] uppercase">
                    Critère
                  </th>
                  {comparison.breeds.map((breed) => (
                    <th key={breed.slug} className="px-3 pb-5 text-center align-bottom">
                      <Link
                        href={`/races/${breed.slug}`}
                        className="group inline-flex flex-col items-center gap-2"
                      >
                        <Image
                          src={breed.imagePath}
                          alt={breed.imageAlt}
                          width={96}
                          height={96}
                          className="h-20 w-20 rounded-2xl border border-[#e8ddd0] bg-[#fffdf7] object-cover transition-transform group-hover:scale-105"
                        />
                        <span className="font-display text-base font-bold text-[#241b15] group-hover:text-[#d94e1f]">
                          {breed.name}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2e8db] text-sm">
                <tr>
                  <th className="py-3.5 pr-4 font-semibold text-[#5c4d42]">Gabarit & poids</th>
                  {comparison.breeds.map((breed) => (
                    <td key={breed.slug} className="px-3 py-3.5 text-center font-semibold text-[#241b15]">
                      {SIZE_LABELS[breed.size]}
                      <span className="block text-xs font-normal text-[#7a695c]">
                        {breed.weightKg.min}–{breed.weightKg.max} kg
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="py-3.5 pr-4 font-semibold text-[#5c4d42]">Budget indicatif</th>
                  {comparison.breeds.map((breed) => (
                    <td key={breed.slug} className="px-3 py-3.5 text-center font-semibold text-[#241b15]">
                      {BUDGET_LABELS[breed.budgetLevel]}
                    </td>
                  ))}
                </tr>
                {comparison.rows.map((row) => {
                  const meta = SCORE_META[row.criterion];
                  return (
                    <tr
                      key={row.criterion}
                      className={row.hasNotableDifference ? "bg-[#fbf3e4]/60" : undefined}
                    >
                      <th className="py-4 pr-4 font-semibold text-[#241b15]">
                        <span>{meta.label}</span>
                        {row.hasNotableDifference && (
                          <span className="mt-1 block w-fit rounded-full bg-[#f8ded0] px-2 py-0.5 text-[11px] font-bold text-[#8f2d0d]">
                            Écart marqué ({row.spread} pts)
                          </span>
                        )}
                      </th>
                      {row.values.map((entry) => {
                        const isLeader = row.leaderSlugs.includes(entry.slug);
                        return (
                          <td key={entry.slug} className="px-3 py-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-sm font-bold ${
                                isLeader
                                  ? "bg-[#ebf8f1] text-[#116645] ring-1 ring-[#b7e5cf]"
                                  : "bg-[#f8f2e9] text-[#241b15]"
                              }`}
                            >
                              {entry.score} / 5
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section
            aria-label="Comparaison des avantages et inconvénients"
            className={`grid gap-6 ${
              comparison.breeds.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {comparison.breeds.map((breed) => (
              <article
                key={breed.slug}
                className="flex flex-col gap-5 rounded-3xl border border-[#e8ddd0] bg-white p-5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#f2e8db] pb-3">
                  <h3 className="font-display text-xl font-bold text-[#241b15]">
                    {breed.name}
                  </h3>
                  <Link
                    href={`/races/${breed.slug}`}
                    className="shrink-0 whitespace-nowrap text-xs font-bold text-[#c24115] hover:underline"
                  >
                    Fiche complète →
                  </Link>
                </div>

                <div className="border-l-4 border-[#147a53] pl-3.5">
                  <h4 className="text-xs font-bold tracking-wide text-[#116645] uppercase">
                    ✓ Points forts
                  </h4>
                  <ul className="mt-2 space-y-2 text-pretty text-xs leading-relaxed text-[#163a2a]">
                    {breed.pros.slice(0, 3).map((pro) => (
                      <li key={pro}>• {pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-4 border-[#b83244] pl-3.5">
                  <h4 className="text-xs font-bold tracking-wide text-[#a62638] uppercase">
                    ! Contraintes réelles
                  </h4>
                  <ul className="mt-2 space-y-2 text-pretty text-xs leading-relaxed text-[#4c151e]">
                    {breed.cons.slice(0, 3).map((con) => (
                      <li key={con}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
