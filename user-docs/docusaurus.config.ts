import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SkillSwap - Guide Utilisateur',
  tagline: 'Échangez vos compétences, enrichissez vos savoirs',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://guide.skillswap.vercel.app',
  baseUrl: '/',

  organizationName: 'O-clock-Dublin',
  projectName: 'projet-skillswap',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl:
            'https://github.com/O-clock-Dublin/projet-skillswap/tree/main/user-docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/skillswap-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'SkillSwap',
      logo: {
        alt: 'SkillSwap Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialsSidebar',
          position: 'left',
          label: 'Tutoriels',
        },
        {
          type: 'docSidebar',
          sidebarId: 'howtoSidebar',
          position: 'left',
          label: 'Guides pratiques',
        },
        {
          type: 'docSidebar',
          sidebarId: 'explanationSidebar',
          position: 'left',
          label: 'Comprendre',
        },
        {
          type: 'docSidebar',
          sidebarId: 'referenceSidebar',
          position: 'left',
          label: 'Référence',
        },
        {
          href: 'https://github.com/O-clock-Dublin/projet-skillswap',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Apprendre',
          items: [
            {
              label: 'Premiers pas',
              to: '/tutorials/getting-started',
            },
            {
              label: 'Créer son profil',
              to: '/tutorials/create-profile',
            },
          ],
        },
        {
          title: 'Guides',
          items: [
            {
              label: 'Rechercher des membres',
              to: '/how-to/search-members',
            },
            {
              label: 'Envoyer un message',
              to: '/how-to/send-message',
            },
          ],
        },
        {
          title: 'Ressources',
          items: [
            {
              label: 'FAQ',
              to: '/reference/faq',
            },
            {
              label: 'Documentation technique',
              href: 'https://docs.skillswap.vercel.app',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SkillSwap - Projet O'clock. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
