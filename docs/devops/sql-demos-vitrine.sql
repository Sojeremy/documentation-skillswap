-- =================================================================
-- SkillSwap — Démos SQL pour soutenance CDA
-- =================================================================
-- À exécuter dans psql (interactive ou one-shot) sur la BDD prod ou
-- locale. Tables en snake_case lowercase. "user" doit être quoté car
-- c'est un mot réservé Postgres.
--
-- Usage prod (recommandé pour démo) :
--   ssh -t skillswap-vps "docker exec -it skillswap-postgres-prod psql -U skillswap -d skillswap"
--
-- Usage local (pour tester avant) :
--   docker compose -p skillswap -f devops/docker-compose.dev.yml exec postgres \
--     psql -U skillswap -d skillswap
-- =================================================================


-- =================================================================
-- ÉTAPE 0 — Découverte du schéma (à faire avant le jour J pour
-- vérifier les noms exacts de colonnes)
-- =================================================================

-- Liste des tables
\dt

-- Structure des principales tables
\d "user"
\d skill
\d category
\d follow
\d evaluation
\d message
\d user_has_skill
\d user_has_interest
\d conversation
\d user_has_conversation


-- =================================================================
-- REQUÊTE 1 — Comptage simple (échauffement)
-- Démontre : SELECT, agrégation simple, sous-requêtes
-- =================================================================

SELECT 
  (SELECT COUNT(*) FROM "user") AS users,
  (SELECT COUNT(*) FROM skill) AS skills,
  (SELECT COUNT(*) FROM category) AS categories,
  (SELECT COUNT(*) FROM conversation) AS conversations,
  (SELECT COUNT(*) FROM message) AS messages,
  (SELECT COUNT(*) FROM evaluation) AS evaluations,
  (SELECT COUNT(*) FROM follow) AS follows;


-- =================================================================
-- REQUÊTE 2 — Skills par catégorie
-- Démontre : LEFT JOIN, GROUP BY, COUNT, ORDER BY
-- =================================================================

SELECT 
  c.name AS category, 
  COUNT(s.id) AS nb_skills
FROM category c
LEFT JOIN skill s ON s.category_id = c.id
GROUP BY c.id, c.name
ORDER BY nb_skills DESC, c.name;


-- =================================================================
-- REQUÊTE 3 — Top 10 des skills les plus proposés
-- Démontre : double JOIN, agrégation, LIMIT, alias colonnes
-- =================================================================

SELECT 
  s.name AS skill,
  c.name AS category, 
  COUNT(uhs.user_id) AS proposed_by
FROM skill s
JOIN category c ON s.category_id = c.id
LEFT JOIN user_has_skill uhs ON uhs.skill_id = s.id
GROUP BY s.id, s.name, c.name
ORDER BY proposed_by DESC, s.name
LIMIT 10;


-- =================================================================
-- REQUÊTE 4 — Top 5 utilisateurs les plus suivis
-- Démontre : JOIN sur table de relation many-to-many
--
-- ⚠️ À adapter selon nom de colonne réel : faire \d follow pour vérifier.
-- Les colonnes sont probablement followed_id et follower_id, mais 
-- pourraient s'appeler followed_user_id / follower_user_id selon
-- le naming choisi dans la migration.
-- =================================================================

SELECT 
  u.firstname, 
  u.lastname, 
  u.city,
  COUNT(f.follower_id) AS followers
FROM "user" u
LEFT JOIN follow f ON f.followed_id = u.id
GROUP BY u.id, u.firstname, u.lastname, u.city
ORDER BY followers DESC, u.firstname
LIMIT 5;


-- =================================================================
-- REQUÊTE 5 — Note moyenne par utilisateur (avec HAVING)
-- Démontre : agrégation avec moyenne, ROUND, HAVING, formatage
--
-- ⚠️ Table "evaluation" (pas rating) car le model Prisma Rating est 
-- mappé à @@map("evaluation"). Nom de colonne pour la note à vérifier
-- via \d evaluation : peut-être "note", "rating", "score"…
-- =================================================================

SELECT 
  u.firstname, 
  u.lastname,
  ROUND(AVG(e.note)::numeric, 2) AS avg_rating,
  COUNT(e.id) AS nb_evaluations
FROM "user" u
LEFT JOIN evaluation e ON e.evaluated_user_id = u.id
GROUP BY u.id, u.firstname, u.lastname
HAVING COUNT(e.id) > 0
ORDER BY avg_rating DESC, nb_evaluations DESC;


-- =================================================================
-- REQUÊTE 6 — LE CLOU DU SPECTACLE : Matching mutuel (CTE)
-- 
-- Trouve les paires d'utilisateurs où l'un a une compétence que 
-- l'autre veut apprendre, ET réciproquement. C'est la valeur cœur
-- du produit SkillSwap matérialisée en SQL.
--
-- Démontre : CTE (WITH ... AS), jointures complexes, alias multiples,
-- déduplication via comparaison d'IDs, compréhension du domaine métier.
-- =================================================================

WITH offers AS (
  SELECT user_id, skill_id FROM user_has_skill
),
wants AS (
  SELECT user_id, skill_id FROM user_has_interest
)
SELECT 
  u1.firstname AS user_a,
  u2.firstname AS user_b,
  s1.name AS a_offers_b_wants,
  s2.name AS b_offers_a_wants
FROM offers o1
JOIN wants w2 ON o1.skill_id = w2.skill_id AND o1.user_id != w2.user_id
JOIN offers o2 ON o2.user_id = w2.user_id
JOIN wants w1 ON w1.skill_id = o2.skill_id AND w1.user_id = o1.user_id
JOIN "user" u1 ON u1.id = o1.user_id
JOIN "user" u2 ON u2.id = w2.user_id
JOIN skill s1 ON s1.id = o1.skill_id
JOIN skill s2 ON s2.id = o2.skill_id
WHERE u1.id < u2.id  -- évite les doublons (paires (a,b) et (b,a))
ORDER BY u1.firstname, u2.firstname
LIMIT 20;


-- =================================================================
-- REQUÊTE 7 — Activité récente par utilisateur (window function)
-- 
-- Top 3 derniers messages par utilisateur. Démontre la maîtrise
-- des fonctions analytiques SQL (ROW_NUMBER OVER PARTITION).
--
-- ⚠️ Colonne du message : à vérifier via \d message. Probablement
-- "content" ou "body" ou "message". Et la jointure user-message
-- via "sender_id" ou "user_id".
-- =================================================================

SELECT 
  firstname,
  message_preview,
  created_at
FROM (
  SELECT 
    u.firstname,
    LEFT(m.content, 60) AS message_preview,
    m.created_at,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY m.created_at DESC) AS rn
  FROM "user" u
  JOIN message m ON m.sender_id = u.id
) ranked
WHERE rn <= 3
ORDER BY firstname, created_at DESC;


-- =================================================================
-- BONUS — Distribution géographique des utilisateurs
-- Démontre : WHERE NOT NULL, GROUP BY sur colonne nullable
-- =================================================================

SELECT 
  city,
  postal_code,
  COUNT(*) AS nb_users
FROM "user"
WHERE city IS NOT NULL
GROUP BY city, postal_code
ORDER BY nb_users DESC, city;


-- =================================================================
-- BONUS — Conversations les plus actives
-- Démontre : JOIN multi-tables, agrégation, MAX et COUNT
-- =================================================================

SELECT 
  c.id AS conversation_id,
  COUNT(m.id) AS nb_messages,
  MAX(m.created_at) AS last_message_at
FROM conversation c
LEFT JOIN message m ON m.conversation_id = c.id
GROUP BY c.id
ORDER BY nb_messages DESC, last_message_at DESC NULLS LAST
LIMIT 10;


-- =================================================================
-- FIN
-- =================================================================
-- Pour quitter psql : \q ou Ctrl+D
-- Pour exporter un résultat en CSV : \copy (...) TO 'fichier.csv' WITH CSV HEADER;