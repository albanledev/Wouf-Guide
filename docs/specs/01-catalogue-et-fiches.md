# Spec 01 — Catalogue et fiches de races

> **Périmètre** : modèle de données d'une race (`Breed`), catalogue filtrable (`/`) et fiche détaillée (`/races/[slug]`).  
> **Objectif** : chaque règle ci-dessous doit pouvoir se traduire directement en schéma Zod (Étape 4) ou en test Vitest (Étape 5) sans interprétation vague.

---

## 1. Modèle de données d'une race (`Breed`)

Le catalogue contient entre **12 et 15 races** de chiens rédigées en français (extensible ultérieurement).

### Champs obligatoires

| Champ | Type / Contrainte | Règle testable |
| :--- | :--- | :--- |
| `slug` | `string` | Format kebab-case minuscule (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), **unique** dans tout le catalogue. |
| `name` | `string` | Nom usuel en français, non vide (2 à 60 caractères). |
| `tagline` | `string` | Accroche courte et ludique (10 à 120 caractères). |
| `summary` | `string` | Présentation honnête en 2–3 phrases (40 à 400 caractères). |
| `origin` | `string` | Pays ou région d'origine (ex. `"Écosse"`). |
| `size` | `"small" \| "medium" \| "large"` | Gabarit adulte : petit (< 10 kg), moyen (10–25 kg), grand (> 25 kg). |
| `weightKg` | `{ min: number; max: number }` | Entiers positifs avec `min < max`. |
| `lifespanYears` | `{ min: number; max: number }` | Entiers positifs (entre 5 et 20) avec `min <= max`. |
| `budgetLevel` | `1 \| 2 \| 3` | Budget global indicatif (alimentation, entretien, vétérinaire) : `1` modéré, `2` moyen, `3` élevé. |
| `scores` | Objet de 6 scores | Chaque score est un **entier compris entre `1` et `5` inclus**. |
| `pros` | `string[]` | **Minimum 3** avantages concrets (chaque élément ≥ 15 caractères). |
| `cons` | `string[]` | **Minimum 3** inconvénients réalistes (chaque élément ≥ 15 caractères). |
| `idealFor` | `string` | Profil de foyer idéal (≥ 20 caractères). |
| `avoidIf` | `string` | Profil de foyer à éviter (≥ 20 caractères). |
| `imagePath` | `string` | Chemin public `/images/breeds/<slug>.png` correspondant à un **fichier réellement présent** dans `public/images/breeds/`. |
| `imageAlt` | `string` | Texte alternatif descriptif en français (≥ 10 caractères). |

### Les 6 scores calibrés (`scores`)

| Clé | Libellé UI | Sens de l'échelle (`1` → `5`) |
| :--- | :--- | :--- |
| `energy` | Énergie & dépense | `1` calme / peu sportif → `5` athlète infatigable (≥ 1h30–2h/jour) |
| `apartment` | Vie en appartement | `1` très difficile en appartement → `5` s'adapte très bien en appartement |
| `family` | Vie de famille & enfants | `1` tolérance limitée / foyer calme requis → `5` très patient et sociable |
| `aloneTime` | Tolérance à la solitude | `1` supporte très mal la solitude → `5` indépendant, gère bien la journée seul |
| `grooming` | Facilité d'entretien | `1` entretien lourd (brossage quotidien / toilettage / forte mue) → `5` entretien minimal |
| `trainability` | Facilité d'éducation | `1` très têtu / exigeant (déconseillé débutant) → `5` très coopératif et rapide à éduquer |

> **Convention de sens** : pour les 5 critères d'adaptation (`apartment`, `family`, `aloneTime`, `grooming`, `trainability`), **`5` = plus facile / plus tolérant**. Pour `energy`, **`5` = besoin de dépense très élevé** (ni bien ni mal : dépend du mode de vie).

---

## 2. Catalogue et moteur de filtrage (`/`)

Le filtrage est implémenté dans une fonction pure `filterBreeds(breeds, filters)` dans `src/domain/`.

### Critères supportés (`BreedFilters`)

Tous les champs sont optionnels. Quand plusieurs filtres sont actifs simultanément, ils se combinent avec un **ET logique**.

1. **`query` (`string`)** :
   - Recherche textuelle **insensible à la casse** et **insensible aux accents** (ex. `"berger"` matche `"Berger Australien"`, `"ecosse"` matche `"Écosse"`).
   - Les espaces en début/fin sont ignorés (`trim`). Une chaîne vide ou blanche ne filtre rien.
   - Porte sur : `name`, `tagline` et `origin`.
2. **`size` (`"small" | "medium" | "large"`)** :
   - Garde uniquement les races dont `breed.size === filters.size`.
3. **`minApartment` (`1..5`)** :
   - Garde uniquement les races dont `breed.scores.apartment >= filters.minApartment`.
4. **`minFamily` (`1..5`)** :
   - Garde uniquement les races dont `breed.scores.family >= filters.minFamily`.
5. **`minAloneTime` (`1..5`)** :
   - Garde uniquement les races dont `breed.scores.aloneTime >= filters.minAloneTime`.
6. **`maxEnergy` (`1..5`)** :
   - Garde uniquement les races dont `breed.scores.energy <= filters.maxEnergy`.
7. **`maxBudget` (`1..3`)** :
   - Garde uniquement les races dont `breed.budgetLevel <= filters.maxBudget`.

### Ordre et immutabilité

- **Tri par défaut** : ordre alphabétique français sur `name` (`localeCompare("fr")`).
- **Immutabilité** : `filterBreeds` retourne toujours un **nouveau tableau** sans muter le tableau d'entrée.
- **Cas limites** :
  - Aucun filtre fourni (`{}`) → retourne toutes les races triées par `name`.
  - Aucune race ne correspond → retourne `[]` (l'UI affiche un état vide avec un bouton « Réinitialiser les filtres »).

---

## 3. Page fiche détaillée (`/races/[slug]`)

- Résolution stricte par `slug`.
- Si le `slug` n'existe pas dans le catalogue → page **404** (`notFound()`).
- Contenu obligatoire affiché sur la fiche :
  1. Portrait (`imagePath` + `imageAlt`), nom, accroche, origine, gabarit, poids, espérance de vie, niveau de budget.
  2. Les 6 scores sous forme de jauges visuelles lisibles de `1` à `5`.
  3. Le bloc **Avantages / Inconvénients** avec un poids visuel strictement égal.
  4. Le verdict rapide : **Profil idéal** (`idealFor`) et **Profil à éviter** (`avoidIf`).
  5. Un lien d'action vers `/comparateur?races=<slug>` pour comparer cette race avec d'autres.

---

## 4. Critères d'acceptation testables

- **CA-01** : Un catalogue valide passe `BreedCatalogSchema.parse(breeds)` sans erreur et contient 12 à 15 races aux `slug` uniques.
- **CA-02** : Une race avec seulement 2 inconvénients, un score à `6` ou un `slug` avec majuscule est rejetée par Zod.
- **CA-03** : Chaque `imagePath` du catalogue correspond à un fichier existant sur le disque sous `public/`.
- **CA-04** : `filterBreeds(breeds, { query: "ecosse" })` trouve une race dont `origin` est `"Écosse"`.
- **CA-05** : `filterBreeds(breeds, { size: "small", minApartment: 4 })` ne retourne que des petites races avec `scores.apartment >= 4`.
- **CA-06** : `filterBreeds(breeds, { query: "dragon" })` retourne `[]`.
