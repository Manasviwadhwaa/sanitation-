import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data/saaf.db');
const db = new Database(dbPath);

const locations = [
  {
    name: 'Old Cantt Market Hub',
    location: 'Clement Town',
    address: 'Old Cantt Market, Quarter Deck Rd, Bharuwala Colony, Clement Town, Uttarakhand 248002',
    type: 'public',
    stalls: 10,
    lat: 30.2706,
    lng: 78.0056
  },
  {
    name: 'New Cantt Market A',
    location: 'Bharuwala Colony',
    address: 'Market, Quarter Deck Rd, New Cantt, Bharuwala Colony, Clement Town, Dehradun, Uttarakhand 248002',
    type: 'public',
    stalls: 12,
    lat: 30.2710,
    lng: 78.0060
  },
  {
    name: 'New Cantt Market B',
    location: 'Bharuwala Colony',
    address: 'Market, Quarter Deck Rd, New Cantt, Bharuwala Colony, Clement Town, Dehradun, Uttarakhand 248002',
    type: 'public',
    stalls: 12,
    lat: 30.2712,
    lng: 78.0062
  },
  {
    name: 'ISBT Flyover Node 22',
    location: 'Subhash Nagar',
    address: '22, ISBT Flyover, near ISBT Flyover, ISBT, Morowala, Subhash Nagar, Dehradun, Shewala Kala, Uttarakhand 248171',
    type: 'transport',
    stalls: 20,
    lat: 30.2852,
    lng: 77.9982
  },
  {
    name: 'ISBT Chowk Smart Node',
    location: 'Morowala',
    address: '7XQW+CW4, ISBT Chowk, ISBT, Morowala, Clement Town, Dehradun, Sewla Khurd, Uttarakhand 248002',
    type: 'transport',
    stalls: 15,
    lat: 30.2855,
    lng: 77.9985
  },
  {
    name: 'Local Bus Terminal Node',
    location: 'Majra',
    address: 'I.S.B.T Local Bus Terminal Parking, ISBT Chowk, Haridwar Bypass Rd, ISBT, Morowala, Majra, Dehradun, Uttarakhand 248002',
    type: 'transport',
    stalls: 25,
    lat: 30.2848,
    lng: 77.9978
  },
  {
    name: 'ISBT Highway Node A',
    location: 'Sewla Khurd',
    address: 'Ambala-Dehradun-Rishikesh Rd, near ISBT, Morowala, Majra, Dehradun, Sewla Khurd, Uttarakhand 248002',
    type: 'transport',
    stalls: 18,
    lat: 30.2862,
    lng: 77.9972
  },
  {
    name: 'ISBT Highway Node B',
    location: 'Majra Corridor',
    address: 'Ambala-Dehradun-Rishikesh Rd, Morowala, Majra, Dehradun, Uttarakhand 248171',
    type: 'transport',
    stalls: 18,
    lat: 30.2865,
    lng: 77.9975
  },
  {
    name: 'Subhash Nagar Hub',
    location: 'Subhash Nagar',
    address: '7X8W+Q8G, Subhash Nagar, Dehradun, Bharu Wala Grant, Uttarakhand 248002',
    type: 'public',
    stalls: 10,
    lat: 30.2840,
    lng: 78.0010
  }
];

const insertFac = db.prepare('INSERT INTO facilities (name, location, address, type, total_stalls, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertStall = db.prepare('INSERT INTO stall_status (facility_id, stall_number, is_occupied, last_updated) VALUES (?, ?, ?, ?)');

db.transaction(() => {
  for (const loc of locations) {
    const result = insertFac.run(loc.name, loc.location, loc.address, loc.type, loc.stalls, loc.lat, loc.lng);
    const facilityId = result.lastInsertRowid;
    
    for (let i = 1; i <= loc.stalls; i++) {
      insertStall.run(facilityId, i, 0, new Date().toISOString());
    }
    console.log(`✅ Added: ${loc.name}`);
  }
})();

console.log('✨ All 9 locations added successfully.');
