// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import next from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...next,
  {
    ignores: [
      'next-env.d.ts',
      '.storybook/',
      'storybook-static/',
      'e2e/',
      'playwright-report/',
      'test-results/',
    ],
  },
  {
    rules: {
      '@next/next/no-html-link-for-pages': ['error', 'frontend/src/app'],
    },
  },
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
