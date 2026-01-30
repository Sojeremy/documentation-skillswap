import { indexAllMembers } from '../services/search.service.ts';
import { testMeiliConnexion, setupMembersIndex } from '../lib/mailisearch.ts';

const main = async () => {
  console.log('🔍 Testing Meilisearch connection...');

  const connected = await testMeiliConnexion();
  if (!connected) {
    console.error('❌ Cannot connect to Meilisearch. Is it running');
    process.exit(1);
  }
  console.log('⚙️ Configuring members index...');
  await setupMembersIndex();

  console.log('🔄 Starting reindexation');
  const count = await indexAllMembers();

  console.log(`✅ Reindexation complete: ${count} members indexed`);
  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Reindexation failed:', error);
  process.exit(1);
});
