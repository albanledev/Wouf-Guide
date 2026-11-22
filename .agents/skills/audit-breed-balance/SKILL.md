---
name: audit-breed-balance
description: "Auditer l'honnêteté éditoriale, l'équilibre avantages/inconvénients et la calibration des scores (1 à 5) des fiches de races dans src/data/breeds.ts. À utiliser quand l'utilisateur demande d'auditer le catalogue, vérifier qu'aucune race n'est idéalisée ou contrôler la qualité des fiches."
---

# Skill : Auditer l'équilibre du catalogue (`audit-breed-balance`)

Ce runbook combine une analyse **déterministe** (script Node) et une relecture éditoriale pour repérer les races trop idéalisées, les biais de notation ou les clichés.

## Étapes obligatoires

1. **Lancer le script d'audit déterministe**
   ```bash
   node .agents/skills/audit-breed-balance/scripts/audit-breeds.mjs
   ```
   Le script contrôle automatiquement pour chaque race :
   - **Inflation de notes** : alerte si la moyenne des 5 scores d'adaptation (`apartment`, `family`, `aloneTime`, `grooming`, `trainability`) dépasse `4.0` ou si plus de `3` scores valent `5`.
   - **Équilibre quantitatif** : compare le nombre de `pros` vs `cons` (alerte si écart > 1).
   - **Équilibre rédactionnel** : compare la longueur moyenne des `cons` par rapport aux `pros` (alerte si les inconvénients sont expédiés en < 70 % de la longueur des avantages).

2. **Relecture qualitative selon le guide éditorial**
   - Charger `.agents/rules/breed-editorial-guide.md`.
   - Sur les races signalées (ou un échantillon demandé), vérifier l'absence de clichés vagues (*« chien affectueux »*, *« sportif »*) au profit de scènes concrètes.

3. **Restituer un rapport actionnable**
   - Présenter un tableau synthétique (OK vs alertes) et proposer des ajustements précis avant de modifier `src/data/breeds.ts`.
   - Si des modifications sont appliquées, valider impérativement avec `pnpm check`.
