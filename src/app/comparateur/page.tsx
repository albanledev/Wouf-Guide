import type { Metadata } from "next";
import { BreedComparatorClient } from "@/components/breed-comparator-client";
import { BREEDS } from "@/data/breeds";

export const metadata: Metadata = {
  title: "Comparateur de races — WoufGuide",
  description:
    "Comparez 2 à 3 races de chiens côte à côte sur leurs 6 scores, leur budget, leurs avantages et leurs vraies contraintes.",
};

interface ComparatorPageProps {
  searchParams: Promise<{ races?: string }>;
}

export default async function ComparatorPage({ searchParams }: ComparatorPageProps) {
  const { races } = await searchParams;
  const validSlugs = new Set(BREEDS.map((breed) => breed.slug));

  const requested = races
    ? Array.from(
        new Set(
          races
            .split(",")
            .map((slug) => slug.trim())
            .filter((slug) => validSlugs.has(slug)),
        ),
      ).slice(0, 3)
    : [];

  let initialSlugs: string[] = requested;
  if (initialSlugs.length === 0) {
    initialSlugs = ["golden-retriever", "bouledogue-francais"];
  } else if (initialSlugs.length === 1) {
    const fallback = BREEDS.find((breed) => breed.slug !== initialSlugs[0]);
    if (fallback) {
      initialSlugs = [...initialSlugs, fallback.slug];
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="inline-block rounded-full bg-[#fbf3e4] px-3 py-1 text-xs font-bold tracking-wide text-[#b83d14] uppercase">
          Face-à-face transparent
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#241b15]">
          Comparateur de races
        </h1>
        <p className="max-w-2xl text-base text-[#5c4d42]">
          Mettez 2 ou 3 races côte à côte : les écarts importants (≥ 2 points) ressortent
          automatiquement pour vous aider à trancher sans mauvaise surprise.
        </p>
      </header>

      <BreedComparatorClient breeds={BREEDS} initialSlugs={initialSlugs} />
    </div>
  );
}
