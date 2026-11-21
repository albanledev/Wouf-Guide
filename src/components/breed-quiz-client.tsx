"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Breed } from "@/domain/breed.schema";
import {
  matchBreedsForQuiz,
  type DailyAbsenceLevel,
  type GroomingTolerance,
  type HousingType,
  type OwnerExperience,
  type QuizAnswers,
} from "@/domain/quiz-matcher";

interface BreedQuizClientProps {
  breeds: readonly Breed[];
}

const DEFAULT_ANSWERS: QuizAnswers = {
  housing: "apartment",
  activityLevel: 3,
  hasChildren: false,
  dailyAbsence: "medium",
  groomingTolerance: "medium",
  experience: "beginner",
};

const MEDALS = ["🥇 #1 Coup de cœur", "🥈 #2 Très bon match", "🥉 #3 À envisager"];

export function BreedQuizClient({ breeds }: BreedQuizClientProps) {
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_ANSWERS);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(
    () => (submitted ? matchBreedsForQuiz(breeds, answers) : []),
    [breeds, answers, submitted],
  );

  const compareUrl =
    results.length >= 2
      ? `/comparateur?races=${results.map((item) => item.breed.slug).join(",")}`
      : "/comparateur";

  return (
    <div className="space-y-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-6 rounded-[2rem] border border-[#e8ddd0] bg-white p-6 shadow-[0_8px_24px_rgba(36,27,21,0.05)] sm:p-8"
      >
        {/* Question 1 */}
        <fieldset className="space-y-3">
          <legend className="font-display text-lg font-bold text-[#241b15]">
            1. Où vivez-vous au quotidien ?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                { value: "apartment", label: "🏢 Appartement", hint: "Ascenseur ou escaliers" },
                {
                  value: "house_small_yard",
                  label: "🏡 Maison + petit jardin",
                  hint: "Extérieur modéré",
                },
                {
                  value: "house_large_yard",
                  label: "🌳 Maison + grand terrain",
                  hint: "Beaucoup d'espace",
                },
              ] as const satisfies readonly { value: HousingType; label: string; hint: string }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={answers.housing === option.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, housing: option.value }));
                  setSubmitted(false);
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  answers.housing === option.value
                    ? "border-[#d94e1f] bg-[#fbf3e4] ring-2 ring-[#d94e1f]/25"
                    : "border-[#e8ddd0] bg-[#fffdf7] hover:border-[#d94e1f]/60"
                }`}
              >
                <span className="block text-sm font-bold text-[#241b15]">{option.label}</span>
                <span className="mt-0.5 block text-xs text-[#5c4d42]">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Question 2 */}
        <fieldset className="space-y-3 border-t border-[#f2e8db] pt-6">
          <legend className="font-display text-lg font-bold text-[#241b15]">
            2. Quel rythme de sorties pouvez-vous tenir chaque jour ?
          </legend>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {(
              [
                { value: 1, label: "1 — Très calme", hint: "30 min cool" },
                { value: 2, label: "2 — Tranquille", hint: "45 min / jour" },
                { value: 3, label: "3 — Équilibré", hint: "1h active" },
                { value: 4, label: "4 — Sportif", hint: "1h30 / jour" },
                { value: 5, label: "5 — Infatigable", hint: "2h+ sport/jeu" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={answers.activityLevel === option.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, activityLevel: option.value }));
                  setSubmitted(false);
                }}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  answers.activityLevel === option.value
                    ? "border-[#d94e1f] bg-[#fbf3e4] ring-2 ring-[#d94e1f]/25"
                    : "border-[#e8ddd0] bg-[#fffdf7] hover:border-[#d94e1f]/60"
                }`}
              >
                <span className="block text-xs font-bold text-[#241b15]">{option.label}</span>
                <span className="mt-0.5 block text-[11px] text-[#5c4d42]">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Question 3 */}
        <fieldset className="space-y-3 border-t border-[#f2e8db] pt-6">
          <legend className="font-display text-lg font-bold text-[#241b15]">
            3. Y a-t-il des enfants dans le foyer (ou très souvent en visite) ?
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { value: true, label: "👨‍👩‍👧‍👦 Oui, vie de famille animée" },
                { value: false, label: "🧘 Non, foyer adulte / calme" },
              ] as const
            ).map((option) => (
              <button
                key={String(option.value)}
                type="button"
                aria-pressed={answers.hasChildren === option.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, hasChildren: option.value }));
                  setSubmitted(false);
                }}
                className={`rounded-2xl border p-4 text-left text-sm font-bold transition-all ${
                  answers.hasChildren === option.value
                    ? "border-[#d94e1f] bg-[#fbf3e4] text-[#241b15] ring-2 ring-[#d94e1f]/25"
                    : "border-[#e8ddd0] bg-[#fffdf7] text-[#241b15] hover:border-[#d94e1f]/60"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Question 4 */}
        <fieldset className="space-y-3 border-t border-[#f2e8db] pt-6">
          <legend className="font-display text-lg font-bold text-[#241b15]">
            4. Combien de temps le chien restera-t-il seul par jour ?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                { value: "low", label: "≤ 3 heures", hint: "Télétravail ou présence continue" },
                { value: "medium", label: "4 à 6 heures", hint: "Demi-journées ou pause midi" },
                { value: "high", label: "7 heures et +", hint: "Journée complète au bureau" },
              ] as const satisfies readonly {
                value: DailyAbsenceLevel;
                label: string;
                hint: string;
              }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={answers.dailyAbsence === option.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, dailyAbsence: option.value }));
                  setSubmitted(false);
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  answers.dailyAbsence === option.value
                    ? "border-[#d94e1f] bg-[#fbf3e4] ring-2 ring-[#d94e1f]/25"
                    : "border-[#e8ddd0] bg-[#fffdf7] hover:border-[#d94e1f]/60"
                }`}
              >
                <span className="block text-sm font-bold text-[#241b15]">{option.label}</span>
                <span className="mt-0.5 block text-xs text-[#5c4d42]">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Question 5 */}
        <fieldset className="space-y-3 border-t border-[#f2e8db] pt-6">
          <legend className="font-display text-lg font-bold text-[#241b15]">
            5. Votre patience face au brossage, au toilettage et aux poils ?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                { value: "low", label: "Entretien minimal", hint: "Je veux le plus simple possible" },
                { value: "medium", label: "Hebdomadaire ok", hint: "1–2 brossages par semaine" },
                { value: "high", label: "Tout est ok", hint: "Toilettage pro ou gros aspirateur" },
              ] as const satisfies readonly {
                value: GroomingTolerance;
                label: string;
                hint: string;
              }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={answers.groomingTolerance === option.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, groomingTolerance: option.value }));
                  setSubmitted(false);
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  answers.groomingTolerance === option.value
                    ? "border-[#d94e1f] bg-[#fbf3e4] ring-2 ring-[#d94e1f]/25"
                    : "border-[#e8ddd0] bg-[#fffdf7] hover:border-[#d94e1f]/60"
                }`}
              >
                <span className="block text-sm font-bold text-[#241b15]">{option.label}</span>
                <span className="mt-0.5 block text-xs text-[#5c4d42]">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Question 6 */}
        <fieldset className="space-y-3 border-t border-[#f2e8db] pt-6">
          <legend className="font-display text-lg font-bold text-[#241b15]">
            6. Votre expérience avec l&apos;éducation canine ?
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: "beginner",
                  label: "🌱 Premier chien / débutant",
                  hint: "Je préfère une race coopérative",
                },
                {
                  value: "experienced",
                  label: "🧭 Déjà expérimenté",
                  hint: "Les caractères têtus ne me font pas peur",
                },
              ] as const satisfies readonly {
                value: OwnerExperience;
                label: string;
                hint: string;
              }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={answers.experience === option.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, experience: option.value }));
                  setSubmitted(false);
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  answers.experience === option.value
                    ? "border-[#d94e1f] bg-[#fbf3e4] ring-2 ring-[#d94e1f]/25"
                    : "border-[#e8ddd0] bg-[#fffdf7] hover:border-[#d94e1f]/60"
                }`}
              >
                <span className="block text-sm font-bold text-[#241b15]">{option.label}</span>
                <span className="mt-0.5 block text-xs text-[#5c4d42]">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e8ddd0] pt-6">
          <p className="text-xs text-[#5c4d42]">
            Calcul 100 % transparent et déterministe sur les 6 critères de chaque race.
          </p>
          <button
            type="submit"
            className="rounded-2xl bg-[#c24115] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#9f3410]"
          >
            Découvrir mon Top 3 personnalisé
          </button>
        </div>
      </form>

      {submitted && results.length > 0 && (
        <section aria-label="Votre podium Top 3" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#241b15]">
                Votre podium Top 3
              </h2>
              <p className="text-sm text-[#5c4d42]">
                Avec les points forts… et le point de vigilance honnête à ne pas oublier.
              </p>
            </div>
            <Link
              href={compareUrl}
              className="rounded-2xl border border-[#241b15] bg-white px-4 py-2.5 text-sm font-bold text-[#241b15] transition-colors hover:bg-[#241b15] hover:text-white"
            >
              Comparer mon Top 3 côte à côte →
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {results.map((item, index) => (
              <article
                key={item.breed.slug}
                className={`flex flex-col justify-between gap-5 rounded-[2rem] border bg-white p-6 shadow-[0_10px_28px_rgba(36,27,21,0.06)] ${
                  index === 0 ? "border-2 border-[#d94e1f]" : "border-[#e8ddd0]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#fbf3e4] px-3 py-1 text-xs font-bold text-[#241b15]">
                      {MEDALS[index] ?? `#${index + 1}`}
                    </span>
                    <span className="rounded-full bg-[#c24115] px-3 py-1 text-sm font-bold text-white">
                      {item.matchPercentage} %
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Image
                      src={item.breed.imagePath}
                      alt={item.breed.imageAlt}
                      width={96}
                      height={96}
                      className="h-20 w-20 shrink-0 rounded-2xl border border-[#e8ddd0] bg-[#fffdf7] object-cover"
                    />
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#241b15]">
                        {item.breed.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#5c4d42]">
                        {item.breed.tagline}
                      </p>
                    </div>
                  </div>

                  {item.strengths.length > 0 && (
                    <div className="rounded-2xl border border-[#b7e5cf] bg-[#ebf8f1] p-3.5">
                      <p className="text-[11px] font-bold tracking-wide text-[#116645] uppercase">
                        Pourquoi ça matche
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-[#163a2a]">
                        {item.strengths.map((reason) => (
                          <li key={reason}>✓ {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.watchOut && (
                    <div className="rounded-2xl border border-[#f5c2cb] bg-[#fdecef] p-3.5">
                      <p className="text-[11px] font-bold tracking-wide text-[#a62638] uppercase">
                        Point de vigilance
                      </p>
                      <p className="mt-1 text-xs text-[#4c151e]">! {item.watchOut}</p>
                    </div>
                  )}
                </div>

                <Link
                  href={`/races/${item.breed.slug}`}
                  className="rounded-xl bg-[#241b15] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#d94e1f]"
                >
                  Lire la fiche complète
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
