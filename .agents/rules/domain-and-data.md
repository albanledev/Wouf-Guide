---
trigger: glob
globs: "**/src/domain/**/*.ts, **/src/data/**/*.ts, **/src/data/**/*.json"
---

# Règles Domaine & Données (`src/domain/`, `src/data/`)

- **Isolation pure** : aucun import depuis `react`, `next/*` ou les APIs du DOM dans `src/domain/` et `src/data/`.
- **Source unique de vérité Zod** : définis les structures de données avec Zod (`src/domain/breed.schema.ts`) et dérive les types TypeScript via `z.infer<typeof ...>` (jamais d'interface dupliquée à la main).
- **Fonctions pures & déterministes** : aucune mutation des tableaux reçus en argument, aucun `Math.random()` ni dépendance à l'horloge dans les moteurs de filtrage, comparaison ou quiz (mêmes entrées = mêmes sorties).
- **TDD obligatoire sur le domaine** : écris ou ajuste d'abord un test Vitest qui échoue (**Rouge**) avant d'écrire le code minimal qui le fait passer (**Vert**), en couvrant les cas limites (tableaux vides, égalités de scores, bornes `1` et `5`).
- **Intégrité des données** : toute race ajoutée dans `src/data/` doit passer la validation Zod, posséder un `slug` unique en kebab-case et pointer vers un portrait existant sous `public/images/breeds/`.
