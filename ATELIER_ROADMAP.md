# 🐾 Feuille de route de l'Atelier — Context Engineering & Agent Harness (De 0 à Pro)

> **Projet fil rouge** : Un site web **ludique & coloré** en **français** répertoriant **12 à 15 races de chiens** (catalogue filtrable, fiches détaillées *Avantages / Inconvénients* honnêtes avec portraits illustrés locaux, comparateur côte à côte et quiz interactif *« Quelle race pour moi ? »*).  
> **Stack technique** : **Next.js (App Router) + TypeScript strict + Tailwind CSS + Zod + Vitest + ESLint** (`pnpm`, Git).  
> **Format** : **Atelier guidé étape par étape** — à chaque étape : explication du *pourquoi IA* → implémentation → vérification concrète → ton feu vert avant de passer à la suite.

---

## 📊 Tableau de progression (suivi vivant)

| Fait | Étape | Brique Produit | Concept IA maîtrisé |
| :---: | :--- | :--- | :--- |
| [x] | **Étape 1** | Table rase, Git & socle Next.js / TS / Vitest | Oracles déterministes & commande unique de vérité |
| [x] | **Étape 2** | `AGENTS.md` + règles `.agents/rules/` | Budget de contexte & *Progressive Disclosure* |
| [x] | **Étape 3** | Cahier des charges & décisions (`docs/`) | *Spec-Driven Development* & ADR anti-amnésie |
| [x] | **Étape 4** | Schéma Zod, 12–15 fiches & portraits locaux | Contrats exécutables vs consignes vagues |
| [x] | **Étape 5** | Filtres, Comparateur & Quiz en logique pure | Boucle de feedback rapide & TDD strict (Rouge → Vert) |
| [x] | **Étape 6** | Pages Next.js ludiques & parcours complets | Skill externe (Impeccable), règles UI scopées & boucle visuelle |
| [x] | **Étape 7** | Runbooks `.agents/skills/` (+ test live) | *Rules* (passives) vs *Skills* (procédures actives) |
| [ ] | **Étape 8** | Garde-fous `.agents/hooks.json` | Contrôle déterministe sur le cycle de vie agent |
| [ ] | **Étape 9** | Serveur MCP maison, Subagent & Plugin | *Model Context Protocol*, délégation & packaging Pro |

---

## 🧠 Module 0 — Partir de 0 : le modèle mental de l'IA agentique

Avant d'écrire la moindre ligne de code ou de configuration, voici les **4 idées fondamentales** pour comprendre comment pense et travaille un agent de code moderne.

### 1. Token & Fenêtre de contexte = la « table de travail » (RAM) du modèle
- L'IA ne « lit » pas des mots comme nous : elle découpe le texte en **tokens** (environ 3 à 4 caractères ou un bout de mot).
- Sa **fenêtre de contexte** (*context window*) est sa mémoire vive immédiate : c'est une grande table de travail sur laquelle on pose les instructions système, vos messages, les fichiers lus, les résultats de commandes et ses propres réponses.
- **Point crucial** : entre deux nouvelles conversations, cette table est entièrement vidée. L'agent est **amnésique** d'une session à l'autre, sauf pour ce qui est écrit dans les fichiers du projet.

### 2. Le *Context Rot* (pourrissement du contexte)
- Plus on empile d'informations inutiles, contradictoires ou obsolètes sur la table de travail (un `AGENTS.md` de 600 lignes, des logs interminables, des règles CSS alors qu'on écrit du calcul pur), plus l'attention du modèle se **dilue**.
- Résultat : l'agent oublie des consignes importantes, hallucine ou prend des raccourcis. En IA, **moins de bruit = plus d'intelligence**.

### 3. Les 3 étages de maîtrise
1. **Prompt Engineering** : savoir bien formuler *une* demande ponctuelle dans le chat (*« Crée-moi cette page »*). Utile, mais insuffisant dès qu'un projet grandit.
2. **Context Engineering** : concevoir l'**architecture d'information** autour du modèle (règles hiérarchiques, specs, schémas, exemples) pour injecter **le bon contexte, au bon format, au bon moment**.
3. **Agent Harness (le harnais)** : construire tout l'environnement **mécanique et déterministe** autour du modèle (compilateur TypeScript, linter, suite de tests, hooks de cycle de vie, navigateur réel, outils MCP) pour contraindre, guider et **vérifier automatiquement** son travail.

> **Règle d'or #1 du Context Engineering :**  
> *« Ne demande jamais en langage naturel à un LLM ce qu'un outil déterministe (compilateur, schéma Zod, test unitaire, linter ou hook) peut vérifier à 100 %. »*

### 4. Carte panoramique des briques Antigravity

| Brique | Où ça se place ? | Quand est-ce chargé ? | À quoi ça sert ? |
| :--- | :--- | :--- | :--- |
| **Règle racine** | `AGENTS.md` (ou `GEMINI.md`) | **Toujours** (dès qu'on travaille dans le dossier) | Carte minimale du repo, commande de vérification, invariants globaux |
| **Règles scopées** | `.agents/rules/*.md` | Selon le `trigger` (`always_on`, `glob`, `model_decision`, `manual`) | Conventions locales chargées **uniquement** sur les bons fichiers ou sujets |
| **Skills** | `.agents/skills/<nom>/SKILL.md` | **À la demande** (seuls nom + description sont préchargés) | Procédures réutilisables étape par étape (ex. ajouter une race complète) |
| **Hooks** | `.agents/hooks.json` | Sur **événement** (`PreToolUse`, `PostToolUse`, `Stop`…) | Scripts shell déterministes (sécurité, vérifications automatiques) |
| **Serveur MCP** | `mcp_config.json` (global ou plugin) | Au démarrage de session / activation du plugin | Donner à l'agent de nouveaux outils/données structurés (protocole standard) |
| **Subagents** | Délégation par l'agent principal | À la demande, dans leur **propre contexte isolé** | Confier une revue ou recherche lourde sans polluer le contexte principal |
| **Plugins** | `.agents/plugins/<nom>/` | Quand le plugin est activé | Empaqueter Rules + Skills + Hooks + MCP dans un kit partageable |

> **Bon à savoir (budgets réels dans Antigravity)** : chaque fichier de règle est plafonné à **24 KB**, et les règles toujours actives partagent un budget dédié de **20 000 tokens**. Au-delà, elles ne sont plus injectées en entier mais réduites à un simple chemin de fichier. D'où l'intérêt majeur du découpage et de la *progressive disclosure* !

---

## 🗺️ Parcours détaillé des 9 Étapes

### [x] Étape 1 — Table rase, Git & Harness déterministe (Les Oracles)
- **🧠 Concept IA (niveau 0)** : Un agent sans **oracle déterministe** (un outil qui répond *Vrai* ou *Faux* sans ambiguïté) code à l'aveugle et croit souvent avoir fini quand ça ne compile même pas. On découvre aussi pourquoi `git init` est double emploi en IA : c'est à la fois ton filet de sécurité pour annuler/comparer, et la racine à partir de laquelle Antigravity remonte pour découvrir tes règles. Enfin, on crée **une commande unique de vérité** (`pnpm check`).
- **🐶 Livrable produit** :
  - Suppression de `module1/` et de l'ancien `AGENTS.md` (Java).
  - Initialisation du dépôt Git (`git init`, `.gitignore` propre).
  - Socle **Next.js (App Router) + TypeScript strict + Tailwind CSS + Zod + Vitest + ESLint** prêt à tourner, avec le script `pnpm check` (`typecheck` + `lint` + `test` + `build`).
- **🛠️ Fichiers & outils** : `package.json`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`, `.gitignore`, squelette minimal `src/app/`.
- **✅ Comment on vérifie** : `pnpm check` passe à 100 % au vert + premier commit Git propre.

---

### [x] Étape 2 — Context Engineering hiérarchique (`AGENTS.md` + `.agents/rules/`)
- **🧠 Concept IA (niveau 0)** : Mettre toutes les consignes dans un seul `AGENTS.md` provoque du *context rot*. On applique la **Progressive Disclosure** (divulgation progressive) en 3 niveaux :
  1. **Niveau 1 — Toujours là, ultra-léger** : `AGENTS.md` (< 60 lignes) avec la carte du projet, la commande `pnpm check` et les invariants non négociables.
  2. **Niveau 2 — Chargé par chemin (`trigger: glob`)** : les règles ne s'activent que si l'agent touche aux fichiers correspondants.
  3. **Niveau 3 — Chargé par pertinence (`trigger: model_decision`)** : l'agent lit une description courte et ne charge la règle complète que s'il en a besoin.
- **🐶 Livrable produit** : L'architecture de contexte complète du projet, commentée ensemble ligne par ligne.
- **🛠️ Fichiers & outils** :
  - `AGENTS.md` (racine lean)
  - `.agents/rules/domain-and-data.md` (`trigger: glob` sur `**/src/domain/**/*.ts, **/src/data/**/*.ts, **/src/data/**/*.json`)
  - `.agents/rules/ui-design-system.md` (`trigger: glob` sur `**/src/components/**/*.tsx, **/src/app/**/*.tsx`)
  - `.agents/rules/breed-editorial-guide.md` (`trigger: model_decision` — guide de ton ludique mais honnête sur les défauts des races)
- **✅ Comment on vérifie** : Audit de la taille, absence de redondance entre fichiers, et validation exacte des en-têtes YAML (`trigger`, `globs`, `description`).

---

### [x] Étape 3 — *Spec-Driven Development* & Mémoire de projet (`docs/`)
- **🧠 Concept IA (niveau 0)** : Comment empêcher l'agent de réinventer les règles du site au fil des conversations (*spec drift*) et contourner son amnésie ? En stockant la **source de vérité produit et technique** directement dans le dépôt sous forme de **spécifications courtes et testables** et d'**ADR** (*Architecture Decision Records* : pourquoi on a choisi telle solution plutôt qu'une autre).
- **🐶 Livrable produit** :
  - Les règles précises des fiches races, des filtres, du comparateur et du calcul de compatibilité du Quiz.
  - La trace écrite du choix de stockage local + Zod.
- **🛠️ Fichiers & outils** :
  - `docs/specs/01-catalogue-et-fiches.md`
  - `docs/specs/02-comparateur-et-quiz.md`
  - `docs/adr/001-donnees-zod-locales.md`
- **✅ Comment on vérifie** : Relecture critique ensemble — chaque règle fonctionnelle écrite doit pouvoir se traduire directement en test automatisé sans interprétation vague.

---

### [x] Étape 4 — Contrats exécutables (Zod), Catalogue (12–15 races) & Portraits locaux
- **🧠 Concept IA (niveau 0)** : Passer de la *consigne polie* (« s'il te plaît mets des avantages et inconvénients équilibrés ») au **contrat exécutable**. Un schéma **Zod** + des tests d'intégrité transforment tes attentes éditoriales et techniques en erreurs bloquantes si une donnée manque ou dérive.
- **🐶 Livrable produit** :
  - Schéma `Breed` strict (identité, gabarit, 6 scores de 1 à 5 : énergie, appartement, famille, solitude, toilettage, éducation ; minimum 3 avantages et 3 inconvénients concrets ; coût/budget indicatif ; chemin portrait).
  - **12 à 15 races emblématiques** rédigées en français (ton ludique, complice mais lucide sur les contraintes).
  - **Portraits illustrés cohérents** générés localement dans `public/images/breeds/`.
- **🛠️ Fichiers & outils** : `src/domain/breed.schema.ts`, `src/data/breeds.ts` (ou JSON), `src/data/__tests__/breeds.test.ts`, `public/images/breeds/*.png`.
- **✅ Comment on vérifie** : `pnpm check` valide 100 % des fiches contre le schéma Zod, vérifie l'unicité des `slug`, les bornes 1–5, l'équilibre avantages/inconvénients, et contrôle que **chaque image référencée existe vraiment sur le disque**.

---

### [x] Étape 5 — Logique métier pure (Filtres, Comparateur, Quiz) en TDD strict
- **🧠 Concept IA (niveau 0)** : La **boucle de feedback fermée**. En isolant la logique pure dans `src/domain/` (zéro dépendance React/DOM), l'agent exécute ses tests en quelques millisecondes. On pratique le **TDD (Test-Driven Development)** : écrire d'abord le test qui échoue (**Rouge**), puis le code minimal pour le faire passer (**Vert**). C'est l'un des meilleurs leviers anti-hallucination en IA.
- **🐶 Livrable produit** :
  - Moteur de filtrage multicritères et recherche textuelle.
  - Moteur de comparaison côte à côte (mise en évidence des écarts et points forts).
  - Algorithme déterministe du Quiz *« Quelle race pour moi ? »* (avec explication claire de pourquoi telle race ressort en Top 3).
- **🛠️ Fichiers & outils** : `src/domain/filter-breeds.ts`, `src/domain/compare-breeds.ts`, `src/domain/quiz-matcher.ts` et leurs fichiers `*.test.ts`.
- **✅ Comment on vérifie** : Constater ensemble un vrai cycle Rouge → Vert dans le terminal, puis `pnpm check` 100 % vert (cas nominaux + cas limites : 0 résultat, égalité de score, filtres vides).

---

### [x] Étape 6 — Interface ludique & colorée + Skill externe Impeccable + Vérification visuelle
- **🧠 Concept IA (niveau 0)** :
  1. **Skill externe vs MCP** : intégrer **[Impeccable](https://impeccable.style/)** — non pas un serveur MCP, mais un pack open-source de **Skills UI** (`SKILL.md` + `DESIGN.md`) et de détecteurs déterministes installés dans `.agents/skills/` (`npx impeccable install`). On disséquera ce vrai exemple pro de *Context Engineering* visuel pour éviter le design générique (« AI slop »).
  2. Observer en direct l'effet de notre règle scopée `ui-design-system.md` (qui n'a pas pollué les étapes précédentes).
  3. **Fermer la boucle sur le visuel** : un test unitaire ne voit pas un bouton coupé, un contraste illisible ou un bug de mise en page mobile. En lançant le site dans un vrai navigateur contrôlé, l'agent inspecte le rendu réel et corrige ce qu'il voit.
- **🐶 Livrable produit** :
  - Installation et adaptation d'**Impeccable** pour notre direction ludique & colorée (`DESIGN.md` / `.agents/skills/`).
  - Page `/` : catalogue coloré avec cartes races, recherche et filtres instantanés.
  - Page `/races/[slug]` : fiche complète avec portrait, jauges visuelles et face-à-face **Pour / Contre**.
  - Page `/comparateur` : comparaison côte à côte de 2 à 3 races.
  - Page `/quiz` : questionnaire interactif fun avec podium Top 3 personnalisé.
- **🛠️ Fichiers & outils** : `.agents/skills/` (Impeccable), `DESIGN.md`, `src/app/**`, `src/components/**`, serveur Next.js local + vérification via le subagent navigateur.
- **✅ Comment on vérifie** : `pnpm check` vert + audit visuel / polish avec Impeccable + inspection visuelle desktop & mobile dans le navigateur + test bout-en-bout des 4 parcours utilisateur.

---

### [x] Étape 7 — Skills métier à la demande (`.agents/skills/`)
- **🧠 Concept IA (niveau 0)** : Quelle différence entre une **Rule** et une **Skill** ?
  - Une **Rule** est un *garde-fou passif* (« respecte toujours ces conventions quand tu touches à ces fichiers »).
  - Une **Skill** est une *procédure active et réutilisable* (« voici le mode d'emploi complet étape par étape pour accomplir telle mission complexe »).
  On apprend l'anatomie exacte d'une Skill (`SKILL.md`, frontmatter `name` et `description` déclencheur, sous-dossiers `references/` et `scripts/` pour ne pas alourdir `SKILL.md`).
- **🐶 Livrable produit** : 2 Skills concrètes :
  1. `.agents/skills/add-breed/SKILL.md` : le runbook complet pour ajouter une nouvelle race de A à Z (données équilibrées, génération du portrait dans le même style, ajout au catalogue, passage de `pnpm check`).
  2. `.agents/skills/audit-breed-balance/SKILL.md` : auditer l'honnêteté et l'équilibre des fiches existantes.
- **🛠️ Fichiers & outils** : `.agents/skills/add-breed/SKILL.md` (+ `references/` ou `scripts/`), `.agents/skills/audit-breed-balance/SKILL.md`.
- **✅ Comment on vérifie** : Test en conditions réelles — tu me demandes d'ajouter une nouvelle race (par ex. le *Shiba Inu*) et on vérifie que la Skill est bien déclenchée et suivie étape par étape jusqu'à `pnpm check` vert.

---

### [ ] Étape 8 — Hooks déterministes (`.agents/hooks.json`)
- **🧠 Concept IA (niveau 0)** : Les consignes écrites dans un prompt restent *probabilistes* (l'IA peut parfois les oublier sur une longue session). Les **Hooks** déplacent la règle **dans le système**, de façon 100 % **déterministe** : avant (`PreToolUse`) ou après (`PostToolUse`) un outil, ou en fin de boucle (`Stop`), un script s'exécute automatiquement, reçoit un payload JSON sur `stdin` et renvoie une décision structurée sur `stdout`.
- **🐶 Livrable produit** :
  - Hook de sécurité `PreToolUse` (empêcher les commandes destructrices accidentelles ou modifications hors cadre).
  - Hook de qualité `PostToolUse` / `Stop` (lancer automatiquement la validation du catalogue / typecheck quand des données ou du code sont modifiés).
- **🛠️ Fichiers & outils** : `.agents/hooks.json` et scripts dans `.agents/hooks/` (avec tests de contrat `stdin`/`stdout`).
- **✅ Comment on vérifie** : **Test de sabotage contrôlé** — on introduit volontairement une erreur dans une fiche ou une commande risquée, et on constate en direct que le hook l'intercepte et la signale automatiquement.

---

### [ ] Étape 9 — Serveur MCP maison, Subagents & Packaging en Plugin (Niveau Pro)
- **🧠 Concept IA (niveau 0)** :
  - **MCP (*Model Context Protocol*)** : souvent comparé au « port USB-C » de l'IA. C'est un protocole ouvert qui expose des outils et ressources externes à n'importe quel client IA compatible. On comprend son transport local **`stdio`** vs distant **Streamable HTTP**, et surtout **quand créer un MCP vs un simple script CLI + Skill** (éviter le sur-engineering !).
  - **Subagents** : confier une mission d'audit (ex. accessibilité/UX ou revue éditoriale) à un agent spécialisé dans un contexte isolé, qui rend un rapport synthétique sans encombrer ta conversation principale.
  - **Plugin** : assembler Rules + Skills + Hooks + MCP dans un seul dossier versionnable et activable/désactivable.
- **🐶 Livrable produit** :
  - Un mini **serveur MCP TypeScript** local (`stdio`) exposant des outils sur notre catalogue (`search_breeds`, `compare_breeds`, `audit_catalog_gaps`).
  - Packaging en plugin workspace `.agents/plugins/dog-catalog-kit/` (`plugin.json` + `mcp_config.json`).
  - Une revue finale déléguée à un **Subagent** + une **Checklist Pro réutilisable** pour tes futurs projets.
- **🛠️ Fichiers & outils** : `mcp-server/` (TypeScript + SDK MCP), `.agents/plugins/dog-catalog-kit/plugin.json`, `mcp_config.json`.
- **✅ Comment on vérifie** : Appel réel des outils MCP depuis l'agent, rapport du Subagent, et `pnpm check` vert sur l'ensemble du projet final.

---

## 📖 Glossaire « De 0 à Pro »

- **Token** : Unité élémentaire de texte traitée par le modèle (~3–4 caractères en moyenne). Tout ce que l'agent lit et écrit consomme des tokens.
- **Fenêtre de contexte** (*Context Window*) : Mémoire active maximale d'un appel au modèle (prompt + règles + fichiers lus + historique + réponse).
- **Context Rot** : Baisse de fiabilité du modèle lorsque sa fenêtre de contexte est encombrée par du texte inutile, redondant ou contradictoire.
- **Prompt Engineering** : Art de rédiger une instruction claire pour une tâche donnée.
- **Context Engineering** : Art d'organiser le dépôt et les sources de connaissance pour livrer au modèle uniquement l'information utile au bon moment.
- **Agent Harness** : Ensemble des garde-fous techniques et boucles de vérification autour du modèle (types, linters, tests, hooks, outils, navigateur).
- **Oracle déterministe** : Programme non-IA qui vérifie objectivement un résultat (`tsc`, `eslint`, `vitest`, Zod) et répond sans ambiguïté *OK* ou *Erreur*.
- **Progressive Disclosure** : Technique consistant à ne charger les détails d'une règle ou d'une procédure que lorsque la tâche en a réellement besoin.
- **`trigger: glob`** : Déclencheur d'une règle Antigravity qui l'active uniquement lorsque l'agent manipule des fichiers correspondant à un motif (ex. `**/src/components/**/*.tsx`).
- **`trigger: model_decision`** : Déclencheur d'une règle dont seule la courte description est visible au départ ; le modèle la lit en entier seulement s'il la juge utile.
- **Spec-Driven Development** : Méthode consistant à écrire et valider de courtes spécifications dans le repo avant de coder, pour éviter les oublis et interprétations.
- **ADR (*Architecture Decision Record*)** : Courte note expliquant *quel* choix technique a été fait et *pourquoi*, afin qu'un futur agent ne le remette pas en cause à l'aveugle.
- **TDD (*Test-Driven Development*)** : Écrire un test qui échoue (**Rouge**) avant d'écrire le code minimal qui le fait passer (**Vert**).
- **Skill** : Paquet de procédure réutilisable (`SKILL.md` + scripts/références) activé à la demande pour exécuter une tâche métier structurée.
- **Hook** : Script déclenché automatiquement par le système à un moment précis de la boucle de l'agent (`PreToolUse`, `PostToolUse`, `Stop`), indépendamment de la « bonne volonté » du modèle.
- **MCP (*Model Context Protocol*)** : Protocole standardisé permettant à un modèle d'appeler des outils ou lire des ressources fournis par un serveur dédié.
- **Subagent** : Agent secondaire lancé dans sa propre fenêtre de contexte pour effectuer une recherche, une revue ou une action isolée et renvoyer une synthèse.
- **Plugin** : Bundle réunissant Rules, Skills, Hooks et configurations MCP pour les activer/partager d'un bloc.

---

## 🔄 Mode d'emploi entre deux sessions

Parce qu'un agent IA est amnésique d'une conversation à l'autre, **ce fichier est notre mémoire partagée**.  
Pour reprendre l'atelier plus tard dans une nouvelle conversation, il te suffit d'écrire :

> *« Lis `ATELIER_ROADMAP.md`, regarde où on en est dans le tableau de progression, et guidons-nous sur la prochaine étape non cochée. »*

À la fin de chaque étape validée ensemble, nous cocherons la case `[x]` correspondante ici même !
