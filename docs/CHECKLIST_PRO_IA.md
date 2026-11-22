# Checklist Pro — Context Engineering & Agent Harness

> Mémo réutilisable en 1 page pour démarrer n'importe quel projet IA-first proprement (issu de l'atelier WoufGuide).

---

## 1. Socle & Oracles déterministes (Jour 1)
- [ ] Initialiser Git dès la minute 1 (`git init`, commits fréquents et propres).
- [ ] Créer **une commande unique de vérité** (`pnpm check` = `typecheck` + `lint` + `test` + `build`).
- [ ] Activer TypeScript strict (`noImplicitAny`, zéro `any` / `@ts-ignore` / `eslint-disable`).

## 2. Context Engineering hiérarchique (*Progressive Disclosure*)
- [ ] Un `AGENTS.md` racine **court (< 60 lignes)** : carte du dépôt, commande de vérification, invariants globaux.
- [ ] Règles locales dans `.agents/rules/*.md` avec `trigger: glob` (domaine, UI, infra) pour zéro *context rot*.
- [ ] Règles transverses rares en `trigger: model_decision` avec une `description` précise orientée cas d'usage.

## 3. Mémoire anti-amnésie (`docs/`)
- [ ] Des **Specs courtes et testables** (`docs/specs/`) avec critères d'acceptation numérotés (`CA-01`, `CA-02`…).
- [ ] Des **ADR** (`docs/adr/`) qui documentent le *pourquoi* des choix structurants et les alternatives écartées.

## 4. Contrats exécutables & TDD
- [ ] Valider les données par un schéma exécutable (**Zod**) et dériver les types (`z.infer`) — jamais de duplication.
- [ ] Isoler la logique métier pure (`src/domain/`, zéro React/DOM) pour des tests en < 200 ms.
- [ ] Appliquer le **TDD Rouge → Vert** sur les moteurs critiques et les cas limites (vide, égalités, bornes).

## 5. Boucle visuelle & Design System
- [ ] Documenter les tokens et anti-patterns dans `DESIGN.md`.
- [ ] Chaîner la règle UI vers un **Skill + détecteur déterministe** (ex. Impeccable) pour vérifier contraste WCAG AA et mise en page.
- [ ] Inspecter le rendu réel dans un navigateur (desktop + mobile) avant de valider une page.

## 6. Automatisation : Skills, Hooks, Subagents, MCP & Plugins
- [ ] **Skill** (`.agents/skills/<nom>/SKILL.md` + `references/` + `scripts/`) : pour toute procédure répétitive multi-étapes.
- [ ] **Hook** (`.agents/hooks.json`) : pour ce qui **ne doit jamais être oublié** (sécurité `PreToolUse`, qualité `Stop` avec garde-fou anti-boucle).
- [ ] **Subagent** : pour paralléliser (génération d'assets, QA navigateur) ou isoler un audit sans polluer le contexte principal.
- [ ] **MCP vs Script CLI** : créer un serveur MCP (`stdio` local ou Streamable HTTP distant) quand **plusieurs clients/sessions** ont besoin d'outils structurés réutilisables ; un simple script + Skill suffit pour un besoin ponctuel.
- [ ] **Plugin** (`.agents/plugins/<nom>/`) : empaqueter `plugin.json` + `mcp_config.json` + `rules/` + `skills/` pour partager le kit à toute une équipe.
