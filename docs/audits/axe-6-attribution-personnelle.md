# Audit attribution personnelle (axe 6 / S2)

**Date** : 2026-05-07 · **Commit correctif** : `cc03dcd`

## Objectif

Vérifier que la doc publiée (MkDocs Arc42, Docusaurus user-docs, Storybook) ne contient aucune attribution personnelle, conformément à la stratégie éditoriale du projet (écriture au passif au nom du projet).

## Périmètre scanné

Audit conduit sur : `docs/documentation-implementation/`, `user-docs/docs/`, `frontend/src/components/`, `frontend/.storybook/`, `README.md`, `DEPLOYMENT.md`, `frontend/README.md`, `devops/README.md`.

Extensions retenues : `*.md`, `*.mdx`, `*.tsx`, `*.ts`. Exclusions : `node_modules/`, `.next/`, `dist/`, `generated/`, `migrations/`.

Hors-scope intentionnel (docs internes à la 1ʳᵉ personne par nature) : `docs/carnet-de-bord.md`, `docs/documentation-strategy/`, `docs/audits/`, `docs/soutenance/`.

## Commande de scan

```bash
grep -rEn -i \
  --include='*.md' --include='*.mdx' --include='*.tsx' --include='*.ts' \
  --exclude-dir='node_modules' --exclude-dir='.next' --exclude-dir='dist' \
  --exclude-dir='generated' --exclude-dir='migrations' \
  -e "\bj'ai\b" -e "\bje \b" -e "\b(mon|ma|mes|moi)\b" \
  -e "démarche personnelle" -e "mon parcours" \
  -e "j'ai (mis en place|installé|choisi|ajouté|enrichi|documenté|configuré|décidé|implémenté|développé)" \
  -e "notre démarche" \
  -e "nous avons (décidé|mis en place|ajouté|installé|choisi|implémenté)" \
  docs/documentation-implementation/ user-docs/docs/ \
  frontend/src/components/ frontend/.storybook/ \
  README.md DEPLOYMENT.md frontend/README.md devops/README.md
```

8 patterns couvrant 1ʳᵉ personne du singulier, mots-signaux d'attribution, et 1ʳᵉ personne du pluriel ambiguë.

## Résultats : 75 hits — classification produite

| # | Catégorie | Hits | Statut |
|---|---|---:|---|
| 1 | Titres Reference Diataxis (troubleshooting symptôme + FAQ question) | 24 | **Corrigés** (commit `cc03dcd`) |
| 2 | Voix utilisateur Diataxis (tutorials + how-to) | 22 | Faux positifs (forme attendue dans ces types Diataxis) |
| 3 | UI labels de l'app (boutons, sections, libellés français) | 14 | Faux positifs (descriptions de l'interface) |
| 4 | mockData de stories Storybook (contenu de message simulé) | 7 | Faux positifs (données fictives illustratives) |
| 5 | UI literals cités dans corps de réponse (entre guillemets) | 3 | Faux positifs (citation littérale du libellé UI) |
| 6 | Commentaires SQL d'exemple (perspective du scénario utilisateur) | 2 | Faux positifs (commentaire didactique) |
| 7 | FAQ technique devops (Q&A développeur) | 2 | Faux positifs (question formulée naturellement) |
| 8 | Payload JSON d'exemple API (contenu de message simulé) | 1 | Faux positif (donnée d'illustration) |

**24 vrais positifs corrigés** / **51 faux positifs documentés**.

## Corrections appliquées (commit `cc03dcd`)

- **`user-docs/docs/reference/troubleshooting.md`** (11 titres) — reformulation au format symptôme factuel, alignée avec les conventions de documentation produit AWS Docs / Stripe Docs / GitHub Docs (gain de trouvabilité moteur de recherche).
- **`user-docs/docs/reference/faq.md`** (13 titres) — reformulation au format question impersonnelle : remplacement de pronoms (`mon → son`, `mes → ses`) ou refonte syntaxique complète selon le cas. Ex. : `Le membre sait-il que je le suis ?` → `Le membre est-il informé qu'il est suivi ?` pour lever l'ambiguïté grammaticale `être`/`suivre`.

Aucune modification du corps des réponses, aucune touche hors des 24 titres listés.

## Vérification post-correction

- **Titres** : 0 hit résiduel ✓
- **Corps** : 4 hits dans `faq.md`, tous attendus :
  - L33, L47 : citations UI literal entre guillemets (`"Supprimer mon compte"`, `"Mes compétences"`), conservées intentionnellement.
  - L63, L64 : artefacts regex `\bma\b` matchant `ma` dans `maîtrise` / `maîtrisez`. Comportement connu de `\b` avec caractères UTF-8 non-ASCII en locale par défaut. Aucun signal d'attribution personnelle.

## Conclusion

La stratégie d'écriture au passif au nom du projet a tenu sur la phase 1 du sprint doc Arc42 (sept commits, sept chantiers). Aucune attribution personnelle non documentée (« j'ai installé », « ma démarche », « mon parcours ») n'a été détectée dans la doc publiée. L'écart résiduel se concentrait exclusivement sur la section Reference Diataxis du guide utilisateur, normalisée par le commit `cc03dcd` sans perte de qualité UX.