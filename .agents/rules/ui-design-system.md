---
trigger: glob
globs: "**/src/components/**/*.tsx, **/src/app/**/*.tsx, **/src/app/**/*.css"
---

# Règles Design System & UI (`src/components/`, `src/app/`)

- **Direction artistique** : interface **ludique, chaleureuse et colorée** en français — évite les rendus « SaaS générique IA » (dégradés violet/bleu par défaut, cartes grises uniformes, murs de texte).
- **Palette sémantique & accessibilité** : fond chaud (crème/sable doux), accents vifs et lisibles avec contraste WCAG AA minimum ; distingue visuellement les **Avantages** (vert/émeraude franc) et les **Inconvénients** (corail/framboise lisible) avec un **poids visuel strictement égal** (honnêteté avant marketing).
- **Architecture Next.js App Router** : **Server Components par défaut** ; n'ajoute `"use client"` que sur les composants interactifs feuilles (filtres, sélection du comparateur, étapes du quiz).
- **Zéro logique métier dans l'UI** : délègue filtrage, comparaison et scoring aux fonctions pures de `@/domain/*`.
- **Sémantique & responsive** : conception mobile-first, balises HTML sémantiques (`button`, `label`, `nav`, `main`) et attributs `alt` descriptifs sur tous les portraits de chiens.
