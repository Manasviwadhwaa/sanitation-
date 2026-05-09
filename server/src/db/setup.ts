import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.resolve(__dirname, '../../data/saaf.db');

if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export const initDB = async () => {
  // Create Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT CHECK(type IN ('men', 'women', 'unisex', 'accessible')),
      total_stalls INTEGER NOT NULL,
      lat REAL,
      lng REAL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin')) DEFAULT 'admin',
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS cleaners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cleaner_id TEXT UNIQUE NOT NULL,
      pin_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'cleaner',
      assigned_zone TEXT
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
      status TEXT CHECK(status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED')),
      issue_reason TEXT,
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

    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      rating INTEGER,
      issue_type TEXT,
      timestamp TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );
  `);

  console.log('Database schema initialized');
  await seedDB();
};

const seedDB = async () => {
  const facilityCount = db.prepare('SELECT COUNT(*) as count FROM facilities').get() as { count: number };

  if (facilityCount.count === 0) {
    console.log('Seeding database...');

    // Seed Admin
    const adminPass = await bcrypt.hash('Admin@123', 10);
    db.prepare('INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)').run(
      'admin@saaf.local', adminPass, 'System Administrator', 'admin'
    );

    // Seed Cleaners
    const c1Pin = await bcrypt.hash('1234', 10);
    const c2Pin = await bcrypt.hash('5678', 10);
    db.prepare('INSERT INTO cleaners (cleaner_id, pin_hash, name, assigned_zone) VALUES (?, ?, ?, ?)').run(
      'CLEANER1', c1Pin, 'Ram Kumar', 'Zone A - Platform'
    );
    db.prepare('INSERT INTO cleaners (cleaner_id, pin_hash, name, assigned_zone) VALUES (?, ?, ?, ?)').run(
      'CLEANER2', c2Pin, 'Sunita Devi', 'Zone B - Food Court'
    );

    const insertFacility = db.prepare(`
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

      for (let i = 1; i <= (f[3] as number); i++) {
        db.prepare('INSERT INTO stall_status (facility_id, stall_number, is_occupied, last_updated) VALUES (?, ?, ?, ?)')
          .run(facilityId, i, 0, new Date().toISOString());
      }
    }

    // History Seed
    const now = new Date();
    for (let d = 7; d >= 0; d--) {
      const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      for (let fId = 1; fId <= 4; fId++) {
        db.prepare(`
          INSERT INTO sensor_readings (facility_id, ammonia_level, humidity, floor_wet, flush_count, tissue_level, soap_level, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(fId, 5 + Math.random() * 15, 40 + Math.random() * 10, 0, 50, 80, 85, date.toISOString());

        if (Math.random() > 0.5) {
          const taskInfo = db.prepare(`
            INSERT INTO maintenance_tasks (facility_id, status, issue_reason, assigned_to, created_at, completed_at)
            VALUES (?, 'COMPLETED', 'Routine Sanitization', 'Ram Kumar', ?, ?)
          `).run(fId, date.toISOString(), new Date(date.getTime() + 20 * 60000).toISOString());

          db.prepare(`
            INSERT INTO budget_log (maintenance_id, manpower_cost, supplies_cost, total_cost, response_time_mins, logged_at)
            VALUES (?, 500, 150, 650, 20, ?)
          `).run(taskInfo.lastInsertRowid, date.toISOString());
        }
      }
    }

    console.log('Database seeded successfully');
  }
};
