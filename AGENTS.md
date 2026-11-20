# WoufGuide — Instructions projet

Tu assistes l'utilisateur sur **WoufGuide**, un guide web ludique et honnête des races de chiens en français (Next.js App Router, TypeScript strict, Tailwind CSS, Zod, Vitest).

## Mode Atelier Pédagogique

- Suis la progression dans `ATELIER_ROADMAP.md` et réponds toujours en français.
- Explique brièvement les concepts IA appliqués à chaque étape pour que l'utilisateur monte en compétence.

## Carte du dépôt

- `ATELIER_ROADMAP.md` : progression de l'atelier et étape en cours.
- `docs/specs/` & `docs/adr/` : source de vérité produit et décisions d'architecture (à lire avant d'implémenter une fonctionnalité).
- `src/domain/` : schémas Zod et logique métier pure (zéro dépendance React/Next).
- `src/data/` : catalogue des races de chiens et tests d'intégrité.
- `src/components/` & `src/app/` : interface Next.js App Router et styles Tailwind.

## Oracle de vérification

- Exécute `pnpm check` (`typecheck` + `lint` + `test` + `build`) après toute modification de code ou de données et avant d'annoncer qu'une tâche est terminée.

## Invariants globaux

- Ne contourne jamais les garde-fous : aucun `any`, `@ts-ignore`, `eslint-disable` ni test désactivé.
- Sépare strictement la logique métier (`src/domain/`) de l'interface (`src/components/`, `src/app/`).
- Ne modifie pas de fichiers hors du périmètre de l'étape demandée sans accord explicite.
