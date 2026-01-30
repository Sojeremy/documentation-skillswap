import { Meilisearch } from 'meilisearch';
import { config } from '../../config.ts';

const client = new Meilisearch({
  host: config.meilisearchHost,
  apiKey: config.meilisearchMasterkey,
});

export const membersIndex = client.index('members');

export const setupMembersIndex = async () => {
  await membersIndex.updateSettings({
    searchableAttributes: ['firstname', 'lastname', 'skills'],
    filterableAttributes: ['categorySlugs', 'city'],
    sortableAttributes: ['rating', 'createdAt'],
  });
  await membersIndex.updateTypoTolerance({
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 3,
    },
  });
};

export const testMeiliConnexion = async () => {
  try {
    const health = await client.health();
    console.log(`✅ Meilisearch connected:`, health.status);
    return true;
  } catch (error) {
    console.error('❌ Meilisearch connection failed', error);
    return false;
  }
};
