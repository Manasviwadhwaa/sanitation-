import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data/saaf.db');
const db = new Database(dbPath);

const nameUpdates = [
  { old: 'Old Cantt Market Hub', new: 'SBM Toilet – Old Cantt Market' },
  { old: 'ISBT Flyover Node 22', new: 'SBM Toilet – ISBT Flyover' },
  { old: 'New Cantt Market A', new: 'SBM Toilet – Quarter Deck Market' },
  { old: 'ISBT Chowk Smart Node', new: 'SBM Toilet – ISBT Chowk' },
  { old: 'Local Bus Terminal Node', new: 'SBM Toilet – ISBT Parking' },
  { old: 'ISBT Highway Node A', new: 'SBM Toilet – Highway Corridor' },
  { old: 'Subhash Nagar Hub', new: 'SBM Toilet – Subhash Nagar' }
];

const updateStmt = db.prepare('UPDATE facilities SET name = ? WHERE name = ?');

db.transaction(() => {
  for (const update of nameUpdates) {
    updateStmt.run(update.new, update.old);
    console.log(`✅ Updated: ${update.old} -> ${update.new}`);
  }
})();

console.log('✨ Branded location names updated.');
