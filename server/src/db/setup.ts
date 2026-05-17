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

export const resetDB = async () => {
  console.log('🗑️ [SQLite] Wiping database for Master Spec migration...');
  db.exec('PRAGMA foreign_keys = OFF');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
  for (const table of tables) {
    db.exec(`DROP TABLE ${table.name}`);
  }
  db.exec('PRAGMA foreign_keys = ON');
  await initDB();
};

export const initDB = async () => {
  db.exec('PRAGMA foreign_keys = ON');

  // 1. RBAC & SYSTEM CORE
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL, -- 'Citizen', 'Worker', 'Supervisor', 'WardAuthority', 'Finance', 'SuperAdmin'
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module TEXT NOT NULL, -- 'FACILITIES', 'TASKS', 'BUDGET', 'USERS', 'SENSORS'
      action TEXT NOT NULL, -- 'READ', 'WRITE', 'DELETE', 'APPROVE', 'VERIFY'
      UNIQUE(module, action)
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INTEGER,
      permission_id INTEGER,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (permission_id) REFERENCES permissions(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER,
      name TEXT,
      ward_assignment TEXT,
      last_login TEXT,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_id INTEGER,
      actor_role TEXT,
      event_type TEXT NOT NULL, -- 'AUTH', 'DATA_CHANGE', 'SYSTEM_OVERRIDE', 'BUDGET_APPROVAL'
      module TEXT,
      record_id INTEGER,
      before_payload TEXT, -- JSON snapshot
      after_payload TEXT, -- JSON snapshot
      ip_address TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (actor_id) REFERENCES users(id)
    );
  `);

  // 2. FACILITY & TELEMETRY
  db.exec(`
    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      address TEXT,
      type TEXT,
      total_stalls INTEGER NOT NULL,
      lat REAL,
      lng REAL,
      rating REAL DEFAULT 5.0,
      status TEXT DEFAULT 'OPEN',
      hours TEXT,
      ward_number TEXT,
      zone TEXT,
      contractor_name TEXT,
      compliance_score REAL DEFAULT 100,
      last_verified_at TEXT,
      verified_by_inspector_id INTEGER,
      FOREIGN KEY (verified_by_inspector_id) REFERENCES users(id)
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
      heartbeat_status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'STALE', 'OFFLINE'
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS cleanliness_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      status TEXT CHECK(status IN ('GREEN', 'AMBER', 'RED')),
      reason TEXT,
      source_type TEXT DEFAULT 'SENSOR', -- 'SENSOR', 'WORKER', 'SUPERVISOR', 'ADMIN'
      updated_at TEXT,
      is_verified INTEGER DEFAULT 0,
      verified_by INTEGER,
      FOREIGN KEY (facility_id) REFERENCES facilities(id),
      FOREIGN KEY (verified_by) REFERENCES users(id)
    );
  `);

  // 3. WORKFLOW & FINANCE
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      status TEXT CHECK(status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED')),
      priority TEXT DEFAULT 'MEDIUM',
      issue_reason TEXT,
      description TEXT,
      created_at TEXT,
      assigned_to_id INTEGER,
      verification_photo TEXT,
      verified_at TEXT,
      verified_by_id INTEGER,
      cost_estimate REAL DEFAULT 0,
      FOREIGN KEY (facility_id) REFERENCES facilities(id),
      FOREIGN KEY (assigned_to_id) REFERENCES users(id),
      FOREIGN KEY (verified_by_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS budget_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      amount REAL NOT NULL,
      category TEXT,
      description TEXT,
      approval_state TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
      is_public_visibility INTEGER DEFAULT 0,
      created_at TEXT,
      approved_by_id INTEGER,
      FOREIGN KEY (facility_id) REFERENCES facilities(id),
      FOREIGN KEY (approved_by_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      rating INTEGER,
      issue_type TEXT,
      comment TEXT,
      photo_url TEXT,
      resolution_status TEXT DEFAULT 'OPEN',
      timestamp TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );

    CREATE TABLE IF NOT EXISTS stall_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      stall_number INTEGER,
      is_occupied INTEGER DEFAULT 0,
      last_updated TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
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

    CREATE TABLE IF NOT EXISTS crowd_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id INTEGER,
      current_users INTEGER,
      wait_time_mins REAL,
      pressure_level TEXT,
      timestamp TEXT,
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
    );
  `);

  console.log('✅ [SQLite] High-Integrity Schema Initialized');
  await seedMasterData();
};

const seedMasterData = async () => {
  const existingRoles = db.prepare('SELECT COUNT(*) as count FROM roles').get() as { count: number };
  if (existingRoles.count > 0) return;

  console.log('🌱 [SQLite] Seeding Master Spec Roles and Permissions...');

  // 1. Seed Roles
  const roles = ['Citizen', 'Worker', 'Supervisor', 'WardAuthority', 'Finance', 'SuperAdmin'];
  const insertRole = db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)');
  roles.forEach(role => insertRole.run(role, `${role} role with specific module access`));

  // 2. Seed Permissions
  const permissions = [
    ['FACILITIES', 'READ'], ['FACILITIES', 'WRITE'], ['FACILITIES', 'VERIFY'],
    ['TASKS', 'READ'], ['TASKS', 'WRITE'], ['TASKS', 'VERIFY'],
    ['BUDGET', 'READ'], ['BUDGET', 'WRITE'], ['BUDGET', 'APPROVE'],
    ['USERS', 'READ'], ['USERS', 'WRITE'],
    ['AUDIT', 'READ'], ['SYSTEM', 'CONTROL']
  ];
  const insertPerm = db.prepare('INSERT INTO permissions (module, action) VALUES (?, ?)');
  permissions.forEach(p => insertPerm.run(p[0], p[1]));

  // 3. Assign SuperAdmin Permissions
  const superAdminId = (db.prepare("SELECT id FROM roles WHERE name = 'SuperAdmin'").get() as any).id;
  const allPerms = db.prepare('SELECT id FROM permissions').all() as any[];
  const insertRolePerm = db.prepare('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)');
  allPerms.forEach(p => insertRolePerm.run(superAdminId, p.id));

  // 4. Seed Users
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const workerPass = await bcrypt.hash('1234', 10);
  const supervisorPass = await bcrypt.hash('Super@123', 10);

  db.prepare("INSERT INTO users (username, password_hash, role_id, name) VALUES (?, ?, ?, ?)").run(
    'admin@sanitrax.local', adminPass, superAdminId, 'Platform Super Admin'
  );
  
  const workerRoleId = (db.prepare("SELECT id FROM roles WHERE name = 'Worker'").get() as any).id;
  db.prepare("INSERT INTO users (username, password_hash, role_id, name) VALUES (?, ?, ?, ?)").run(
    'worker1', workerPass, workerRoleId, 'Ram Kumar'
  );

  const supervisorRoleId = (db.prepare("SELECT id FROM roles WHERE name = 'Supervisor'").get() as any).id;
  db.prepare("INSERT INTO users (username, password_hash, role_id, name) VALUES (?, ?, ?, ?)").run(
    'supervisor1', supervisorPass, supervisorRoleId, 'Anita Singh'
  );

  // 5. Seed Initial Facilities (Standard Dehradun Set)
  const dehradunFacilities = [
    ['ISBT Flyover Node', 'ISBT Flyover', 'transport', 24, 30.2850, 77.9980],
    ['Old Cantt Market Node', 'Old Cantt Market', 'public', 12, 30.2705, 78.0055],
    ['Highway Corridor Node', 'Near ISBT', 'transport', 32, 30.2860, 77.9970]
  ];
  const insertFac = db.prepare('INSERT INTO facilities (name, location, type, total_stalls, lat, lng) VALUES (?, ?, ?, ?, ?, ?)');
  const insertStall = db.prepare('INSERT INTO stall_status (facility_id, stall_number, is_occupied, last_updated) VALUES (?, ?, ?, ?)');
  
  dehradunFacilities.forEach(f => {
    const result = insertFac.run(...f);
    const facilityId = result.lastInsertRowid;
    
    // Create stalls based on total_stalls count
    const stallCount = f[3] as number;
    for (let i = 1; i <= stallCount; i++) {
      insertStall.run(facilityId, i, 0, new Date().toISOString());
    }
  });

  console.log('✨ [SQLite] Master Spec Seeding Complete');
};

export default db;
