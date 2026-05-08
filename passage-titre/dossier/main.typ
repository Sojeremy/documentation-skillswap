// =============================================================================
// Dossier de Projet CDA — SkillSwap
// Entrée principale : importe le template puis chaque section
// Compilation : typst compile main.typ output/dossier_de_projet.pdf
// =============================================================================

#import "template.typ": dossier

#show: dossier.with(
  candidat: "Jérémy [NOM_DE_FAMILLE]",
  date-soutenance: "Mardi 13 mai 2026",
)

#include "sections/00-introduction.typ"
#include "sections/01-competences.typ"
#include "sections/02-cahier-charges.typ"
#include "sections/03-presentation-entreprise.typ"
#include "sections/04-gestion-projet.typ"
#include "sections/05-specifications-fonctionnelles.typ"
#include "sections/06-specifications-techniques.typ"
#include "sections/07-realisations.typ"
#include "sections/08-securite.typ"
#include "sections/09-plan-tests.typ"
#include "sections/10-jeu-essai.typ"
#include "sections/11-veille.typ"
#include "sections/12-difficultes.typ"
#include "sections/13-conclusion.typ"
#include "sections/14-lexique.typ"

// Annexes (placeholders)
#include "annexes/index.typ"
