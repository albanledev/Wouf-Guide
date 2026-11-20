export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 inline-flex items-center rounded-full bg-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-950">
        Étape 1 — Socle prêt
      </span>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        WoufGuide 🐾
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-700">
        Le socle Next.js, TypeScript strict, Tailwind CSS, Zod et Vitest est en
        place. Prochaine étape : structurer l&apos;architecture de contexte IA.
      </p>
    </main>
  );
}
