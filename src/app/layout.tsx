import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WoufGuide — Races de chiens, avantages et inconvénients sans filtre",
  description:
    "Découvrez 12 races de chiens avec leurs vraies qualités et leurs contraintes quotidiennes, comparez-les côte à côte et trouvez votre compagnon grâce au quiz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#fffdf7] text-[#241b15] antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="mt-12 border-t border-[#e8ddd0] bg-[#fbf3e4]/70">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-[#5c4d42] sm:flex-row sm:px-6 sm:text-left">
            <p>
              <strong className="font-display text-[#241b15]">WoufGuide</strong> — On adore les
              chiens, alors on assume aussi les poils, les flaques et les sorties sous la pluie.
            </p>
            <p className="text-xs">12 fiches vérifiées • Zéro pub, 100 % lucide</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
