# projet-skillswap

# Initialisation du projet

## Installation en local (évitez en local, priorisez sur docker)

1. Aller dans le dossier frontend :
   ```bash
   cd frontend
   ```
2. Installer les dépendances :
   ```bash
   npm i
   ```
3. Aller dans le dossier backend :
   ```bash
   cd ../backend
   ```
4. Installer les dépendances :
   ```bash
   npm i
   ```
5. Revenez à la racine
   ```bash
   cd ../
   ```
6. Installes les dépendances
   ```bash
   npm i
   ```

Tester avec `npm run dev` sur les deux services.  
Faites attention de bien vous situer dans le backend ou le frontend.

## Installation Docker

1. Premier lancement build :

   ```bash
   npm run docker:compose
   ```

2. Vérifier le lancement des services :

- http://localhost renvoie la page principale de NextJS
- http://localhost/api/health renvoie le json avec `status: "ok"`
- http://localhost:8080/ -> se connecter au système PostgreSQL et au serveur postgres avec les identifiants du .env

3. Eteindre les containers :

   ```bash
   npm run docker:down
   ```

4. Rallumer les containers :
   ```bash
   npm run docker:up
   ```

## Gitflow avec Linter et Husky

1. Placez-vous sur la branch dev, faites un git pull
2. npm i à la racine, dans frontend et dans backend (bientôt un script pour automatiser tout ça ?)
3. git checkout -b nom-de-votre-branch (une branche par feature)
4. Travaillez sur votre branch
5. git status (récupérer les fichiers modifiés, verifier les tracked : pas de nodes_modules, etc)
6. git add fichier-1-modifé.ts fichier-2-modifié.jsx
7. git commit -m "blablabla"
8. Si Husky bloque :

- ```bash
   npm run lint
  ```
  -> vérifie les erreurs
- ```bash
   npm run format
  ```
  -> réparation auto
- Revenir à l'étape 5. 2. Si aucune erreur (avertissement ok)
- git push (PUSHEZ)

9. Créer une PR manuelle de votre branch à dev.
