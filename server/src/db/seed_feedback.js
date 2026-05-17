import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data/saaf.db');
const db = new Database(dbPath);

const mockFeedback = [
  { 
    facility_id: 1, 
    issue_type: 'cleaning', 
    comment: 'Minor litter near entrance.', 
    rating: 2, 
    status: 'IN_PROGRESS', 
    timestamp: new Date(Date.now() - 3600000).toISOString() 
  },
  { 
    facility_id: 2, 
    issue_type: 'damage', 
    comment: 'Broken tap in stall 3.', 
    rating: 1, 
    status: 'OPEN', 
    timestamp: new Date(Date.now() - 7200000).toISOString() 
  },
  { 
    facility_id: 3, 
    issue_type: 'odor', 
    comment: 'Strong smell, needs ventilation.', 
    rating: 2, 
    status: 'RESOLVED', 
    timestamp: new Date(Date.now() - 86400000).toISOString() 
  }
];

const insertStmt = db.prepare(`
  INSERT INTO user_feedback (facility_id, issue_type, comment, rating, resolution_status, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
  for (const f of mockFeedback) {
    insertStmt.run(f.facility_id, f.issue_type, f.comment, f.rating, f.status, f.timestamp);
  }
})();

console.log('✅ Mock feedback data seeded.');
