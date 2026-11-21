import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8ddd0] bg-[#fffdf7]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-3.5">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f] sm:gap-2.5"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#d94e1f] text-lg text-white shadow-sm transition-transform group-hover:rotate-[-6deg] sm:h-10 sm:w-10 sm:text-xl"
          >
            🐾
          </span>
          <div className="leading-tight">
            <span className="font-display block text-lg font-bold tracking-tight text-[#241b15] sm:text-xl">
              WoufGuide
            </span>
            <span className="hidden text-xs font-medium text-[#5c4d42] sm:block">
              Le guide honnête des races
            </span>
          </div>
        </Link>

        <nav aria-label="Navigation principale" className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="whitespace-nowrap rounded-xl px-2.5 py-2 text-xs font-semibold text-[#241b15] transition-colors hover:bg-[#fbf3e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f] sm:px-3 sm:text-sm"
          >
            Catalogue
          </Link>
          <Link
            href="/comparateur"
            className="whitespace-nowrap rounded-xl px-2.5 py-2 text-xs font-semibold text-[#241b15] transition-colors hover:bg-[#fbf3e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94e1f] sm:px-3 sm:text-sm"
          >
            Comparateur
          </Link>
          <Link
            href="/quiz"
            className="whitespace-nowrap rounded-xl bg-[#c24115] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9f3410] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#241b15] sm:px-3.5 sm:text-sm"
          >
            <span className="sm:hidden">Quiz</span>
            <span className="hidden sm:inline">Quiz compatibilité</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
