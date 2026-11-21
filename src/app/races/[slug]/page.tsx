import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUDGET_LABELS, SIZE_LABELS } from "@/components/breed-labels";
import { ScoreBar } from "@/components/score-bar";
import { BREEDS } from "@/data/breeds";
import { SCORE_KEYS } from "@/domain/breed.schema";

interface BreedPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BREEDS.map((breed) => ({ slug: breed.slug }));
}

export async function generateMetadata({ params }: BreedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const breed = BREEDS.find((item) => item.slug === slug);
  if (!breed) {
    return { title: "Race introuvable — WoufGuide" };
  }
  return {
    title: `${breed.name} : avantages, inconvénients & scores — WoufGuide`,
    description: breed.summary,
  };
}

export default async function BreedDetailPage({ params }: BreedPageProps) {
  const { slug } = await params;
  const breed = BREEDS.find((item) => item.slug === slug);

  if (!breed) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5c4d42] transition-colors hover:text-[#d94e1f]"
        >
          ← Retour au catalogue
        </Link>
        <Link
          href={`/comparateur?races=${breed.slug}`}
          className="rounded-xl bg-[#c24115] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#9f3410]"
        >
          Comparer le {breed.name}
        </Link>
      </div>

      <section className="grid items-center gap-8 rounded-[2rem] border border-[#e8ddd0] bg-white p-6 shadow-[0_10px_28px_rgba(36,27,21,0.05)] sm:p-8 lg:grid-cols-12">
        <div className="mx-auto w-full max-w-sm lg:col-span-5">
          <Image
            src={breed.imagePath}
            alt={breed.imageAlt}
            width={512}
            height={512}
            priority
            className="aspect-square w-full rounded-3xl border border-[#f2e8db] bg-[#fffdf7] object-cover"
          />
        </div>

        <div className="space-y-5 lg:col-span-7">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-[#fbf3e4] px-3 py-1 text-xs font-bold text-[#b83d14]">
              Origine : {breed.origin}
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[#241b15]">
              {breed.name}
            </h1>
            <p className="font-display text-lg font-medium text-[#5c4d42]">
              « {breed.tagline} »
            </p>
          </div>

          <p className="text-base leading-relaxed text-[#241b15]">{breed.summary}</p>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-[#fbf3e4]/80 p-3.5">
              <dt className="text-xs font-semibold text-[#7a695c]">Gabarit</dt>
              <dd className="mt-1 text-sm font-bold text-[#241b15]">
                {SIZE_LABELS[breed.size]}
              </dd>
            </div>
            <div className="rounded-2xl bg-[#fbf3e4]/80 p-3.5">
              <dt className="text-xs font-semibold text-[#7a695c]">Poids adulte</dt>
              <dd className="mt-1 text-sm font-bold text-[#241b15]">
                {breed.weightKg.min}–{breed.weightKg.max} kg
              </dd>
            </div>
            <div className="rounded-2xl bg-[#fbf3e4]/80 p-3.5">
              <dt className="text-xs font-semibold text-[#7a695c]">Espérance de vie</dt>
              <dd className="mt-1 text-sm font-bold text-[#241b15]">
                {breed.lifespanYears.min}–{breed.lifespanYears.max} ans
              </dd>
            </div>
            <div className="rounded-2xl bg-[#fbf3e4]/80 p-3.5">
              <dt className="text-xs font-semibold text-[#7a695c]">Budget</dt>
              <dd className="mt-1 text-sm font-bold text-[#241b15]">
                {BUDGET_LABELS[breed.budgetLevel]}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="scores-heading"
        className="rounded-[2rem] border border-[#e8ddd0] bg-white p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="scores-heading" className="font-display text-2xl font-bold text-[#241b15]">
            Les 6 scores calibrés
          </h2>
          <p className="text-xs font-medium text-[#7a695c]">
            Échelle de 1 (très faible) à 5 (trait dominant)
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SCORE_KEYS.map((key) => (
            <ScoreBar key={key} criterion={key} score={breed.scores[key]} />
          ))}
        </div>
      </section>

      <section aria-label="Avantages et inconvénients" className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border-2 border-[#b7e5cf] bg-[#ebf8f1] p-6 sm:p-8">
          <h2 className="font-display flex items-center gap-2 text-2xl font-bold text-[#116645]">
            <span aria-hidden="true">✓</span> Ce qu&apos;on adore (Avantages)
          </h2>
          <ul className="mt-5 space-y-3.5">
            {breed.pros.map((pro) => (
              <li
                key={pro}
                className="flex items-start gap-3 text-sm leading-relaxed text-[#163a2a] sm:text-base"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#147a53]"
                />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border-2 border-[#f5c2cb] bg-[#fdecef] p-6 sm:p-8">
          <h2 className="font-display flex items-center gap-2 text-2xl font-bold text-[#a62638]">
            <span aria-hidden="true">!</span> Ce qu&apos;il faut assumer (Inconvénients)
          </h2>
          <ul className="mt-5 space-y-3.5">
            {breed.cons.map((con) => (
              <li
                key={con}
                className="flex items-start gap-3 text-sm leading-relaxed text-[#4c151e] sm:text-base"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#b83244]"
                />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-label="Verdict rapide"
        className="grid gap-6 rounded-[2rem] border border-[#e8ddd0] bg-[#fbf3e4] p-6 sm:p-8 md:grid-cols-2"
      >
        <div className="space-y-2 rounded-2xl bg-white p-5">
          <h2 className="font-display text-lg font-bold text-[#116645]">
            🎯 Profil idéal
          </h2>
          <p className="text-sm leading-relaxed text-[#241b15]">{breed.idealFor}</p>
        </div>
        <div className="space-y-2 rounded-2xl bg-white p-5">
          <h2 className="font-display text-lg font-bold text-[#a62638]">
            ⛔ Profil à éviter
          </h2>
          <p className="text-sm leading-relaxed text-[#241b15]">{breed.avoidIf}</p>
        </div>
      </section>
    </div>
  );
}
