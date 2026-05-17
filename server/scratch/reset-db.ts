import { resetDB } from '../src/db/setup.js';

console.log('🔄 Triggering database reset...');
resetDB().then(() => {
  console.log('✅ Database reset complete.');
  process.exit(0);
}).catch(err => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});
