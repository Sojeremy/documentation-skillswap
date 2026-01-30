import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Sidebars Diataxis pour SkillSwap
 *
 * 4 sections selon le modèle Diataxis :
 * - Tutorials : Apprendre pas à pas
 * - How-to : Accomplir une tâche spécifique
 * - Explanation : Comprendre les concepts
 * - Reference : Consulter des informations
 */
const sidebars: SidebarsConfig = {
  // Tutoriels - Apprendre pas à pas
  tutorialsSidebar: [
    {
      type: 'category',
      label: 'Tutoriels',
      collapsed: false,
      items: [
        'tutorials/getting-started',
        'tutorials/create-profile',
        'tutorials/add-skills',
        'tutorials/first-exchange',
      ],
    },
  ],

  // How-to Guides - Accomplir une tâche
  howtoSidebar: [
    {
      type: 'category',
      label: 'Guides pratiques',
      collapsed: false,
      items: [
        'how-to/search-members',
        'how-to/send-message',
        'how-to/rate-user',
        'how-to/follow-members',
        'how-to/edit-profile',
        'how-to/manage-availabilities',
      ],
    },
  ],

  // Explanation - Comprendre les concepts
  explanationSidebar: [
    {
      type: 'category',
      label: 'Comprendre',
      collapsed: false,
      items: [
        'explanation/how-it-works',
        'explanation/trust-system',
        'explanation/categories',
      ],
    },
  ],

  // Reference - Consulter
  referenceSidebar: [
    {
      type: 'category',
      label: 'Référence',
      collapsed: false,
      items: [
        'reference/categories-list',
        'reference/settings',
        'reference/faq',
        'reference/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
