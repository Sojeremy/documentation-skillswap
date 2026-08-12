# Fiche: Stratégie de Tests

!!! danger "Lire avant d'utiliser cette fiche"
    Une version antérieure de cette fiche présentait la stratégie de l'ADR-010
    comme **réalisée** (« ~25 stories Storybook », « ~14 tests Vitest »,
    « 4 tests E2E », « 100% de couverture composants »). **Ces chiffres étaient
    faux.** Storybook, Vitest, Playwright et TypeDoc ne sont pas installés dans
    le livrable certifié. Ne récitez aucun de ces chiffres devant le jury.

## En une phrase

L'ADR-010 documente une **stratégie de tests cible** ; ce qui a été **livré**,
c'est une couche de tests d'intégration backend en Node Test Runner natif —
le frontend n'est pas testé automatiquement.

## Ce qui existe réellement dans le livrable

| Périmètre | Outil | Réalité |
|-----------|-------|---------|
| Backend — intégration | `node --test` natif (Node 24) | **7 fichiers `*.spec.test.ts`** : `auth.controller`, `conv`, `message`, `profile.controller`, `follow.controller`, `search.controller`, `realtime/socket` |
| Backend — unitaire | `node --test` | Script `test:unit` déclaré, **0 fichier `*.unit.test.ts`** |
| Frontend — unitaire | — | **Aucun** (Vitest non installé) |
| Frontend — E2E | — | **Aucun** (Playwright non installé) |
| Composants UI | — | **Aucun** catalogue (Storybook non installé) |
| Couverture | — | **Non mesurée**, aucun outil branché en CI |

Vérifiable en une commande sur le dépôt de production :
`grep -iE 'vitest|playwright|storybook|typedoc' frontend/package.json` → 0 résultat.
Le `frontend/package.json` livré ne contient que `dev`, `build`, `start`,
`lint`, `format`.

État d'implémentation détaillé : [ADR-010 §Statut d'implémentation](../../documentation-implementation/arc42/09-decisions/010-testing-strategy.md).
État des tests backend (dont les échecs sur fixture) : [10.2 Tests](../../documentation-implementation/arc42/10-quality/testing.md).

## Questions probables du jury

### Q1 : « Comment testez-vous votre application ? »

**R** : « Sur le backend, par des tests d'intégration : 7 fichiers de specs qui
montent l'application Express et tapent sur les routes réelles avec une base de
test, plus un fichier dédié aux events Socket.IO. J'ai utilisé le Node Test
Runner natif plutôt qu'un framework tiers, pour ne pas ajouter de dépendance
là où la plateforme fournit déjà l'outil. Le frontend, lui, n'a pas de tests
automatisés dans le livrable : c'est une dette que j'assume. »

### Q2 : « Pourquoi pas de tests frontend ? »

**R** : « Arbitrage de temps sur la période projet. La stratégie était décidée
et documentée — l'ADR-010 prévoit Vitest pour la logique métier, Playwright
pour les parcours critiques et Storybook pour les composants — mais elle n'a
pas été implémentée avant la soutenance. J'ai préféré documenter honnêtement
l'écart entre la cible et le réalisé plutôt que d'afficher une couverture que
je n'avais pas. »

### Q3 : « Que testeriez-vous en priorité si vous repreniez le projet ? »

**R** : « Trois choses, dans cet ordre. D'abord les schémas Zod et les
utilitaires purs — c'est rapide et ça sécurise les entrées. Ensuite un E2E sur
le parcours inscription → recherche → follow → message, parce que c'est le
chemin critique du produit et qu'il traverse toutes les couches. Enfin les
hooks de messagerie, qui concentrent la logique asynchrone et le temps réel,
donc le risque de régression le plus élevé. »

### Q4 : « Vos tests backend passent-ils tous ? »

**R** : à préparer honnêtement à partir de
[10.2 Tests](../../documentation-implementation/arc42/10-quality/testing.md),
qui documente l'état réel d'exécution de la suite. Ne pas affirmer « tout
passe » sans avoir relancé la suite.

## Liens

- ADR : [ADR-010 Testing Strategy](../../documentation-implementation/arc42/09-decisions/010-testing-strategy.md)
- État réel des tests : [10.2 Tests](../../documentation-implementation/arc42/10-quality/testing.md)
- Plans (intentions non implémentées) : [08-storybook.md](../../documentation-strategy/08-storybook.md), [09-typedoc.md](../../documentation-strategy/09-typedoc.md), [10-tests.md](../../documentation-strategy/10-tests.md)

## Métriques à retenir

| Métrique | Valeur |
|----------|--------|
| Fichiers de tests backend | **7** (`*.spec.test.ts`) |
| Fichiers de tests frontend | **0** |
| Stories Storybook | **0** |
| Tests E2E | **0** |
| Couverture mesurée | **aucune** |
| Runner utilisé | `node --test` natif (aucune dépendance de test) |
