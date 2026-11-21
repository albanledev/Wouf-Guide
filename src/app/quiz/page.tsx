import type { Metadata } from "next";
import { BreedQuizClient } from "@/components/breed-quiz-client";
import { BREEDS } from "@/data/breeds";

export const metadata: Metadata = {
  title: "Quiz « Quelle race pour moi ? » — WoufGuide",
  description:
    "Répondez à 6 questions concrètes sur votre rythme de vie pour obtenir votre Top 3 de races compatibles et leurs points de vigilance.",
};

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="inline-block rounded-full bg-[#fbf3e4] px-3 py-1 text-xs font-bold tracking-wide text-[#b83d14] uppercase">
          6 questions • 1 minute
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#241b15]">
          Quelle race est vraiment faite pour vous ?
        </h1>
        <p className="max-w-2xl text-base text-[#5c4d42]">
          Pas de test magique : on compare vos réponses réelles (logement, temps de sortie,
          absences, entretien) aux 6 scores de nos 12 races pour sortir un Top 3 lucide.
        </p>
      </header>

      <BreedQuizClient breeds={BREEDS} />
    </div>
  );
}
