# Spec 02 — Comparateur côte à côte et Quiz « Quelle race pour moi ? »

> **Périmètre** : logique métier pure et règles fonctionnelles du Comparateur (`/comparateur`) et du Quiz (`/quiz`).  
> **Invariant** : 100 % déterministe (mêmes entrées = mêmes sorties, zéro hasard, zéro dépendance React/DOM).

---

## 1. Comparateur côte à côte (`/comparateur`)

Implémenté dans une fonction pure `compareBreeds(breeds)` dans `src/domain/compare-breeds.ts`.

### Règles de sélection

- Accepte entre **2 et 3 races** distinctes.
- Validation explicite dans le domaine :
  - Moins de 2 races → erreur métier (`"Sélectionnez au moins 2 races à comparer."`).
  - Plus de 3 races → erreur métier (`"Vous pouvez comparer au maximum 3 races à la fois."`).
  - Doublons de `slug` → erreur métier (`"Les races sélectionnées doivent être distinctes."`).

### Structure du résultat (`BreedComparison`)

Pour chacun des 6 critères de `scores` (`energy`, `apartment`, `family`, `aloneTime`, `grooming`, `trainability`), le comparateur calcule une ligne `ScoreComparisonRow` :

| Champ | Règle de calcul |
| :--- | :--- |
| `criterion` | Clé du critère (`energy`, `apartment`, etc.). |
| `values` | Tableau `{ slug: string; score: number }[]` dans l'ordre des races fournies. |
| `maxScore` | Score maximal parmi les races comparées. |
| `minScore` | Score minimal parmi les races comparées. |
| `spread` | Écart `maxScore - minScore`. |
| `hasNotableDifference` | `true` si `spread >= 2`, `false` sinon. |
| `leaderSlugs` | Liste des `slug` ayant `score === maxScore`. Si toutes les races ont le même score (`spread === 0`), `leaderSlugs` est vide `[]` (égalité parfaite, pas de vainqueur artificiel). |

### Affichage UI (`/comparateur`)

- L'utilisateur peut pré-remplir la sélection via l'URL (`/comparateur?races=slug1,slug2`) ou choisir 2 à 3 races dans l'interface.
- Les lignes avec `hasNotableDifference === true` sont mises en valeur pour aider à trancher rapidement.
- Les blocs **Avantages** et **Inconvénients** de chaque race restent visibles côte à côte.

---

## 2. Quiz « Quelle race pour moi ? » (`/quiz`)

Implémenté dans une fonction pure `matchBreedsForQuiz(breeds, answers)` dans `src/domain/quiz-matcher.ts`.

### Les 6 questions (`QuizAnswers`)

Chaque question correspond directement à une contrainte de vie concrète :

| # | Champ | Valeurs possibles | Critère évalué |
| :--- | :--- | :--- | :--- |
| 1 | `housing` | `"apartment"` \| `"house_small_yard"` \| `"house_large_yard"` | `scores.apartment` |
| 2 | `activityLevel` | `1 \| 2 \| 3 \| 4 \| 5` (temps & intensité de sortie souhaités) | `scores.energy` |
| 3 | `hasChildren` | `boolean` (foyer avec jeunes enfants ou visites fréquentes) | `scores.family` |
| 4 | `dailyAbsence` | `"low"` (≤ 3h) \| `"medium"` (4–6h) \| `"high"` (≥ 7h) | `scores.aloneTime` |
| 5 | `groomingTolerance` | `"low"` (minimal) \| `"medium"` (hebdo) \| `"high"` (quotidien ok) | `scores.grooming` |
| 6 | `experience` | `"beginner"` \| `"experienced"` | `scores.trainability` |

*(Un 7ᵉ filtre optionnel `preferredSize: "any" | "small" | "medium" | "large"` peut être ajouté sans changer la formule : s'il vaut `"any"`, score plein ; s'il correspond au gabarit de la race, bonus complet ; sinon malus modéré.)*

### Algorithme déterministe de scoring (sur 100)

Pour chaque race, on calcule **6 notes unitaires** comprises entre `0` et `1` :

1. **Logement (`housingScore`)** :
   - Si `"apartment"` : `(scores.apartment - 1) / 4` (un `5` vaut `1.0`, un `1` vaut `0.0`).
   - Si `"house_small_yard"` : `Math.min(1, (scores.apartment + 1) / 5)` (moins strict, mais favorise encore les chiens adaptables).
   - Si `"house_large_yard"` : `1.0` (toutes les races conviennent).
2. **Activité (`energyScore`)** :
   - Écart absolu `diff = Math.abs(scores.energy - answers.activityLevel)`.
   - `1 - diff / 4` (alignement exact = `1.0`, écart de 4 = `0.0`).
3. **Famille (`familyScore`)** :
   - Si `hasChildren === true` : `(scores.family - 1) / 4`.
   - Si `hasChildren === false` : `1.0` (critère neutre).
4. **Solitude (`aloneScore`)** :
   - Cible minimale : `"low"` → `1`, `"medium"` → `3`, `"high"` → `5`.
   - Si `scores.aloneTime >= target` → `1.0`.
   - Sinon → `Math.max(0, 1 - (target - scores.aloneTime) / 4)`.
5. **Entretien (`groomingScore`)** :
   - Cible minimale de facilité : `"low"` (veut peu d'entretien) → `5`, `"medium"` → `3`, `"high"` (ok entretien lourd) → `1`.
   - Si `scores.grooming >= target` → `1.0`.
   - Sinon → `Math.max(0, 1 - (target - scores.grooming) / 4)`.
6. **Éducation (`trainabilityScore`)** :
   - Si `"beginner"` : `(scores.trainability - 1) / 4`.
   - Si `"experienced"` : `1.0` (un maître expérimenté gère tous les niveaux).

**Pondération** :
- `housing` : **25 %**
- `energy` : **25 %**
- `aloneTime` : **20 %**
- `family` : **10 %**
- `grooming` : **10 %**
- `trainability` : **10 %**

**Score final** :
`matchPercentage = Math.round(sommePonderee * 100)` (entier de `0` à `100`).

### Classement, départage et explications

- **Tri** : décroissant sur `matchPercentage`.
- **Départage en cas d'égalité exacte** : ordre alphabétique croissant sur `breed.slug` (garantit un résultat 100 % déterministe).
- **Sortie** : le **Top 3** (ou moins si le catalogue contient moins de 3 races).
- **Transparence par résultat** (`QuizMatchResult`) :
  - `breed` : la race correspondante.
  - `matchPercentage` : entier `0..100`.
  - `strengths` (`string[]`) : jusqu'à 2 points forts expliquant **pourquoi** la race correspond (critères ayant obtenu `>= 0.75`).
  - `watchOut` (`string | null`) : le point de vigilance principal (critère le plus faible si `< 0.75`, sinon `null`) — pour garder l'honnêteté éditoriale jusque dans le quiz.

---

## 3. Critères d'acceptation testables

- **CA-07** : `compareBreeds([breedA])` et `compareBreeds([a, b, c, d])` lèvent une erreur métier explicite.
- **CA-08** : `compareBreeds([breedA, breedA])` lève une erreur pour doublon.
- **CA-09** : Si 2 races ont toutes deux `scores.family = 4`, `spread === 0`, `hasNotableDifference === false` et `leaderSlugs === []`.
- **CA-10** : Si race A a `scores.energy = 5` et race B a `scores.energy = 2`, `spread === 3`, `hasNotableDifference === true` et `leaderSlugs === [raceA.slug]`.
- **CA-11** : Un profil `apartment` + `activityLevel: 2` + `dailyAbsence: "high"` + `beginner` classe mieux un chien calme, indépendant et facile en appartement qu'un chien de travail très énergique et sensible à la solitude.
- **CA-12** : Deux appels identiques à `matchBreedsForQuiz` retournent strictement le même Top 3 dans le même ordre ; en cas d'égalité de score, le `slug` alphabétiquement inférieur passe devant.
- **CA-13** : Si `breeds` est vide `[]`, `matchBreedsForQuiz([], answers)` retourne `[]`.
