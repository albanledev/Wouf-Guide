---
name: add-breed
description: "Procédure complète pour ajouter une nouvelle race de chien au catalogue WoufGuide (portrait illustré cohérent, fiche équilibrée conforme au guide éditorial et au schéma Zod, puis validation pnpm check). À utiliser dès que l'utilisateur demande d'ajouter ou créer une nouvelle race dans le site."
---

# Skill : Ajouter une nouvelle race (`add-breed`)

Ce runbook décrit la procédure complète de A à Z pour ajouter une nouvelle race sans casser le schéma Zod, le style visuel ni l'équilibre éditorial.

## Prérequis
- Lire `.agents/rules/breed-editorial-guide.md` pour le ton, la calibration des scores (1 à 5) et l'équilibre Avantages / Inconvénients.
- Consulter `src/domain/breed.schema.ts` si besoin de vérifier les bornes exactes des champs.

## Étapes obligatoires

1. **Vérifier la disponibilité du slug et la capacité du catalogue**
   - Ouvrir `src/data/breeds.ts` et vérifier que la race n'existe pas déjà.
   - Choisir un `slug` en kebab-case minuscule sans accents (ex. `corgi-pembroke`, `samoyede`, `dalmatien`).
   - Vérifier la limite du catalogue dans `src/data/__tests__/breeds.test.ts` (12 à 15 races par défaut ; si on dépasse 15, prévenir l'utilisateur avant d'ajuster la borne).

2. **Générer le portrait illustré cohérent**
   - Lire `references/portrait-prompt.md` pour réutiliser exactement le style gouache éditorial du catalogue.
   - Déléguer la génération au subagent `image-generator` avec un cercle pastel harmonieux et zéro texte.
   - Convertir l'image générée en PNG carré 512×512 dans `public/images/breeds/<slug>.png` via `sips -s format png -Z 512 <source> --out public/images/breeds/<slug>.png`.

3. **Rédiger et insérer la fiche dans `src/data/breeds.ts`**
   - Renseigner tous les champs requis par `BreedSchema` (`slug`, `name`, `tagline`, `summary`, `origin`, `size`, `weightKg`, `lifespanYears`, `budgetLevel`, `scores`, `pros` ≥ 3, `cons` ≥ 3, `idealFor`, `avoidIf`, `imagePath: "/images/breeds/<slug>.png"`, `imageAlt`).
   - Appliquer strictement la calibration des scores (`5` réservé aux extrêmes réels, convention : `5` = plus facile/tolérant sauf `energy` où `5` = très sportif).
   - Remplacer tout adjectif vague par des scènes de vie concrètes.

4. **Vérifier de façon déterministe**
   - Exécuter `pnpm check` (`typecheck` + `lint` + `test` + `build`).
   - Exécuter `node .agents/skills/audit-breed-balance/scripts/audit-breeds.mjs` pour confirmer que la nouvelle fiche ne souffre ni d'inflation de notes ni de déséquilibre pros/cons.

5. **Rendre compte clairement**
   - Résumer les scores choisis, le profil idéal / à éviter, et confirmer que `pnpm check` (incluant la génération statique `/races/<slug>`) est 100 % vert.
