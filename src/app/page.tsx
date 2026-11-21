import Link from "next/link";
import { BreedCatalogClient } from "@/components/breed-catalog-client";
import { BREEDS } from "@/data/breeds";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#e8ddd0] bg-[#fbf3e4] px-6 py-10 sm:px-10 sm:py-12">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#241b15] sm:text-5xl">
            Adoptez une race pour sa vraie vie, pas juste pour sa bouille.
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-[#5c4d42] sm:text-lg">
            Chez <strong className="text-[#241b15]">WoufGuide</strong>, nos 12 fiches donnent
            le même poids aux coups de cœur qu&apos;aux vraies contraintes : perte de poils,
            solitude, budget véto et sorties sous la pluie.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/quiz"
              className="rounded-2xl bg-[#c24115] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#9f3410]"
            >
              Faire le quiz « Quelle race pour moi ? »
            </Link>
            <Link
              href="/comparateur"
              className="rounded-2xl border border-[#241b15] bg-[#fffdf7] px-5 py-3 text-sm font-bold text-[#241b15] transition-colors hover:bg-[#241b15] hover:text-white"
            >
              Comparer 2 à 3 races côte à côte
            </Link>
          </div>
        </div>
      </section>

      <BreedCatalogClient breeds={BREEDS} />
    </div>
  );
}
