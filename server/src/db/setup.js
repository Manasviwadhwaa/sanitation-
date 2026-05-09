"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbPath = path_1.default.resolve(__dirname, '../../database.sqlite');
// Ensure database directory exists
if (!fs_1.default.existsSync(path_1.default.dirname(dbPath))) {
    fs_1.default.mkdirSync(path_1.default.dirname(dbPath), { recursive: true });
}
exports.db = new better_sqlite3_1.default(dbPath);
exports.db.pragma('journal_mode = WAL');
const initDB = () => {
    // Create Tables
    exports.db.exec(`
    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT CHECK(type IN ('men', 'women', 'unisex', 'accessible')),
      total_stalls INTEGER NOT NULL,
      lat REAL,
      lng REAL
    );

    CREATE TABLE IF NOT EXISTS stall_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      stall_number INTEGER,
      is_occupied INTEGER DEFAULT 0,
      last_updated TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      ammonia_level REAL,
      humidity REAL,
      floor_wet INTEGER DEFAULT 0,
      flush_count INTEGER DEFAULT 0,
      tissue_level REAL,
      soap_level REAL,
      timestamp TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS cleanliness_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      status TEXT CHECK(status IN ('GREEN', 'AMBER', 'RED')),
      reason TEXT,
      updated_at TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS maintenance_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      created_at TEXT,
      assigned_to TEXT,
      accepted_at TEXT,
      eta_minutes INTEGER,
      completed_at TEXT,
      scan_qr_code TEXT,
      supplies_used TEXT,
      issues_noted TEXT,
      cost_inr REAL,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS crowd_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      current_users INTEGER,
      wait_time_mins REAL,
      pressure_level TEXT,
      timestamp TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      rating INTEGER,
      issue_type TEXT,
      timestamp TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS budget_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      maintenance_id INTEGER,
      manpower_cost REAL,
      supplies_cost REAL,
      response_time_mins REAL,
      total_cost REAL,
      logged_at TEXT,
      FOREIGN KEY (maintenance_id) REFERENCES maintenance_tasks(id)
    );

    CREATE TABLE IF NOT EXISTS predicted_rush (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      predicted_at TEXT,
      surge_in_mins REAL,
      confidence_pct REAL,
      source TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );
  `);
    console.log('Database schema initialized');
    seedDB();
};
exports.initDB = initDB;
const seedDB = () => {
    const facilityCount = exports.db.prepare('SELECT COUNT(*) as count FROM facilities').get();
    if (facilityCount.count === 0) {
        console.log('Seeding database...');
        const insertFacility = exports.db.prepare(`
      INSERT INTO facilities (name, location, type, total_stalls, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const facilities = [
            ['ISBT Dehradun — Platform Entry', 'Dehradun ISBT', 'unisex', 16, 30.3165, 78.0322],
            ['ISBT Dehradun — Food Court', 'Dehradun ISBT', 'unisex', 5, 30.3168, 78.0325],
            ['Railway Station — Platform 1', 'Dehradun Railway Station', 'unisex', 20, 30.3150, 78.0350],
            ['Metro Station — Exit Gate B', 'Dehradun Metro', 'unisex', 13, 30.3200, 78.0400],
        ];
        for (const f of facilities) {
            const info = insertFacility.run(...f);
            const facilityId = info.lastInsertRowid;
            // Seed Stalls
            const insertStall = exports.db.prepare(`
        INSERT INTO stall_status (facility_id, stall_number, is_occupied, last_updated)
        VALUES (?, ?, ?, ?)
      `);
            for (let i = 1; i <= f[3]; i++) {
                insertStall.run(facilityId, i, 0, new Date().toISOString());
            }
        }
        console.log('Database seeded successfully');
    }
};
//# sourceMappingURL=setup.js.map