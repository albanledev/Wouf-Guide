# ADR-001 — Stockage local des races validé par Zod

- **Statut** : Accepté
- **Date** : 2026-11-21
- **Décideurs** : Équipe WoufGuide (Atelier Context Engineering)

---

## Contexte

WoufGuide présente un catalogue éditorial de **12 à 15 races de chiens** en français, accompagné de portraits illustrés locaux, de filtres, d'un comparateur et d'un quiz.  
Ce contenu est principalement en lecture seule, évolue par ajout ponctuel de fiches revues dans Git, et doit respecter des règles d'intégrité strictes (6 scores de `1` à `5`, minimum 3 avantages et 3 inconvénients, unicité des slugs, présence réelle des images sur le disque).

Nous devons choisir comment stocker et valider ces données sans sur-complexifier l'architecture ni affaiblir les garde-fous automatiques de l'agent.

---

## Décision

Stocker le catalogue des races **directement dans le dépôt Git** (`src/data/breeds.ts` ou JSON typé), validé par un **schéma Zod unique** défini dans `src/domain/breed.schema.ts` et vérifié à chaque exécution de `pnpm check` (compilation TypeScript + tests Vitest d'intégrité).

Les portraits illustrés sont stockés en fichiers statiques locaux sous `public/images/breeds/<slug>.png` et leur existence sur le disque est contrôlée par test automatisé.

---

## Alternatives envisagées et écartées

1. **Base de données externe (PostgreSQL / Supabase / SQLite distante)**
   - *Raison du rejet* : introduit des migrations, des variables d'environnement, du provisioning et un risque de désynchronisation entre l'environnement local et les tests automatisés, alors que le volume est de 12–15 fiches éditoriales sans comptes utilisateurs ni écritures temps réel.
2. **CMS Headless (Sanity, Strapi, Contentful)**
   - *Raison du rejet* : dépendance réseau et compte tiers ; les fiches ne sont plus versionnées au même endroit que le code et le build peut casser silencieusement si un champ change côté CMS.
3. **Fichiers Markdown avec frontmatter parsé à la main**
   - *Raison du rejet* : moins ergonomique pour le typage strict et la validation fine des structures imbriquées (scores, poids, listes d'avantages/inconvénients) qu'un objet validé directement par Zod.

---

## Conséquences

### Positives
- **Oracle déterministe immédiat** : toute faute de frappe, score hors bornes ou image manquante fait échouer `pnpm check` en quelques millisecondes.
- **Zéro latence et zéro coût d'infrastructure** : Next.js peut pré-rendre les pages statiquement (SSG) sans appel réseau.
- **Historique Git complet** : chaque nouvelle race ou retouche éditoriale est traçable, diffable et réversible.
- **Idéal pour le Context Engineering** : le schéma Zod sert à la fois de documentation vivante et de contrat exécutable pour l'agent IA.

### Négatives / Limites assumées
- Ajouter ou corriger une fiche nécessite un commit et un redéploiement (pas d'interface d'administration web).
- Non adapté tel quel si le projet évoluait vers des centaines de races éditées par des contributeurs non techniques ou vers des données utilisateurs (avis, favoris persistés).

### Réversibilité
- **Forte** : comme toute la logique métier (`src/domain/`) consomme un tableau `Breed[]` pur sans connaître la source des données, remplacer `src/data/breeds.ts` par un adaptateur SQL ou CMS ultérieurement ne toucherait ni le domaine ni les composants UI.
