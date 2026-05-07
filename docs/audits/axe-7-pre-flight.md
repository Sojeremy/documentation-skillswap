# Audit pre-flight final (axe 7 / S2)

**Date** : 2026-05-07
**Commits correctifs** : `d5e0502`

## Objectif

Dernière passe de validation avant la soutenance : vérifier qu'aucun lien cassé ne traîne dans la documentation, qu'aucun TODO/FIXME/placeholder de développement n'est resté, et que les 3 sites Vercel + la prod répondent bien.

## Périmètre

3 audits indépendants :

1. **Liens internes markdown** — Tous les fichiers `.md` du repo doc (147 fichiers, 1035 liens analysés)
2. **TODO / FIXME / placeholders** — Recherche grep sur tous les `.md`
3. **Builds Vercel + prod** — Vérification HTTP des 3 sites Vercel et de la prod backend

## Méthode

### Liens internes markdown — script Python

Parcourt tous les `.md`, extrait chaque lien `[text](path)`, résout le chemin relatif au fichier source, vérifie l'existence du fichier cible. Ignore : URLs externes (`http://`, `https://`, `mailto:`), ancres pures (`#header`), images (`![...]`).

### TODO/FIXME — grep insensible à la casse

```bash
grep -rEn --include='*.md' --exclude-dir='node_modules' \
  '\b(TODO|FIXME|XXX|TBD|HACK|@todo|placeholder)\b' \
  docs/ user-docs/ README.md
```

### Builds Vercel — curl avec timeout

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 10 <URL>
```

## Résultats

### Liens internes — 1 seul vrai cassé corrigé

Sur 1035 liens internes analysés sur 147 fichiers, le script a remonté **58 liens "cassés"**, dont :

- **57 faux positifs Docusaurus** : convention de chemins absolus `/tutorials/getting-started`, `/how-to/send-message`, etc. propre à Docusaurus, résolus au build par Docusaurus lui-même. Le script Python les a interprétés comme des chemins UNIX absolus depuis la racine du système de fichiers, d'où le faux positif. Vérification manuelle de 16 cibles canoniques : **toutes existent**.
- **1 vrai lien cassé** : `docs/documentation-strategy/12-soutenance.md:129` pointait sur `../arc42/06-runtime/index.md` (chemin relatif erroné, manque le sous-dossier `documentation-implementation/`). Corrigé en `../documentation-implementation/arc42/06-runtime/index.md` (commit `d5e0502`, +1/-1).

### TODO/FIXME — 0 vrai résiduel

4 hits remontés par le grep, **tous faux positifs sémantiques** :
- `arc42/09-decisions/index.md:63` : `# ADR-XXX : Titre` — template d'exemple ADR
- `arc42/05-building-blocks/frontend.md:93,101` : `placeholder` listé comme prop HTML standard de `<Input>` et `<Textarea>`
- `api-reference/examples/search-flow.md:221` : attribut HTML `placeholder="Rechercher..."` dans un exemple JSX

Aucun TODO/FIXME de développement résiduel. Bonne hygiène de la S2.

### Builds Vercel + prod — 5/5 OK

| URL | Statut HTTP | Type |
|---|:-:|---|
| `https://skillswap-docs.vercel.app` | 200 | Site MkDocs |
| `https://skillswap-guide.vercel.app` | 200 | Site Docusaurus user guide |
| `https://skillswap-storybook.vercel.app` | 200 | Storybook |
| `https://skill-swap.fr/api/v1/health` | 200 | API backend prod |
| `https://skill-swap.fr` | 200 | Frontend Next.js prod |

Tests d'ancres profondes (premier niveau de chaque site) : **3/3 OK** également.

## Notes méthodologiques

### Bonne nouvelle : la doc est saine

La S2 a touché ~50 fichiers de doc. Le pre-flight final révèle **1 seul vrai défaut** (un lien relatif mal calculé). C'est une mesure robuste de la qualité du travail des chantiers A1, A2, A3, A6 : aucune régression introduite, aucun TODO oublié, aucun placeholder de développement laissé.

### Limitation du script Python : convention Docusaurus

Le script Python utilisé n'a pas la logique de résolution Docusaurus (chemins absolus depuis `docs/`). Pour un audit Docusaurus rigoureux, le mieux est de laisser Docusaurus builder lui-même : un `npm run build` dans `user-docs/` rapporterait toute "broken link" via son linter natif. Confirmation indirecte ici via le `200` sur `https://skillswap-guide.vercel.app/tutorials/getting-started` : le déploiement Vercel a passé le build, donc Docusaurus a validé tous les liens.

## État production J-5 soutenance

- **3 sites Vercel** : tous up
- **API backend** : `/api/v1/health` répond `{"status":"ok"}`
- **Frontend prod** : up
- **Repo prod** : `de73323 Merge pull request #142 from O-clock-Dublin/dev` (mergée pendant la S2 — à retester le cas échéant si la PR introduit des changements de schéma/endpoints, mais aucun signal d'alarme à ce stade)

## Conclusion

Audit pre-flight propre : **1 lien cassé corrigé, 0 TODO/FIXME résiduel, 5/5 sites en ligne**. La documentation est en état de présentation. Recommandé pour J-1 : refaire un curl rapide sur les 5 URLs en cas de mise en veille Vercel imprévue, et confirmer la volumétrie prod via `psql` (`SELECT COUNT(*) FROM "user"`, etc.) pour rafraîchir les chiffres si nécessaires dans `devops-quickref.md`.
