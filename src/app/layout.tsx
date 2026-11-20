import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "WoufGuide — Races de chiens, avantages et inconvénients",
  description:
    "Comparez les races de chiens sans filtre : qualités, contraintes et quiz de compatibilité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-amber-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
