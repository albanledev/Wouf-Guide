import Image from "next/image";
import Link from "next/link";
import type { Breed } from "@/domain/breed.schema";
import { BUDGET_SHORT, SIZE_LABELS } from "./breed-labels";
import { ScoreBar } from "./score-bar";

interface BreedCardProps {
  breed: Breed;
}

export function BreedCard({ breed }: BreedCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-[#e8ddd0] bg-white shadow-[0_8px_24px_rgba(36,27,21,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#d94e1f]/50 hover:shadow-[0_14px_32px_rgba(36,27,21,0.09)]">
      <Link
        href={`/races/${breed.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-[#fffdf7] p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f]"
      >
        <Image
          src={breed.imagePath}
          alt={breed.imageAlt}
          width={512}
          height={512}
          className="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full border border-[#e8ddd0] bg-[#fffdf7]/95 px-2.5 py-1 text-xs font-semibold text-[#241b15] shadow-xs">
          {SIZE_LABELS[breed.size]}
        </span>
        <span
          aria-label={`Budget niveau ${breed.budgetLevel} sur 3`}
          className="absolute top-3 right-3 rounded-full bg-[#241b15]/85 px-2.5 py-1 text-xs font-bold text-[#fffdf7]"
        >
          {BUDGET_SHORT[breed.budgetLevel]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-[#241b15]">
              <Link
                href={`/races/${breed.slug}`}
                className="transition-colors hover:text-[#d94e1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f]"
              >
                {breed.name}
              </Link>
            </h2>
            <span className="shrink-0 text-xs font-medium text-[#7a695c]">
              {breed.origin}
            </span>
          </div>
          <p className="text-pretty text-sm leading-relaxed text-[#5c4d42]">{breed.tagline}</p>
        </div>

        <div className="space-y-2.5 border-t border-[#f2e8db] pt-3.5">
          <ScoreBar criterion="apartment" score={breed.scores.apartment} compact />
          <ScoreBar criterion="energy" score={breed.scores.energy} compact />
          <ScoreBar criterion="family" score={breed.scores.family} compact />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/races/${breed.slug}`}
            className="flex-1 rounded-xl bg-[#241b15] px-3.5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#d94e1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f]"
          >
            Voir la fiche
          </Link>
          <Link
            href={`/comparateur?races=${breed.slug}`}
            className="rounded-xl border border-[#e8ddd0] bg-[#fbf3e4]/70 px-3 py-2.5 text-sm font-semibold text-[#241b15] transition-colors hover:border-[#d94e1f] hover:text-[#d94e1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f]"
          >
            Comparer
          </Link>
        </div>
      </div>
    </article>
  );
}
