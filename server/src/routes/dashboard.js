"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setup_1 = require("../db/setup");
const analyticsService_1 = require("../services/analyticsService");
const router = express_1.default.Router();
// 1. Global Overview KPI
router.get('/overview', (req, res) => {
    try {
        const kpis = (0, analyticsService_1.getGlobalKPIs)();
        res.json(kpis);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 2. Rich Facility Cards for Dashboard
router.get('/facility-cards', (req, res) => {
    try {
        const facilities = setup_1.db.prepare('SELECT * FROM facilities').all();
        const cards = facilities.map(f => {
            const summary = (0, analyticsService_1.getFacilityHealthSummary)(f.id);
            const rush = setup_1.db.prepare('SELECT surge_in_mins, confidence_pct FROM predicted_rush WHERE facility_id = ? ORDER BY id DESC LIMIT 1').get(f.id);
            const status = setup_1.db.prepare('SELECT status FROM cleanliness_status WHERE facility_id = ? ORDER BY id DESC LIMIT 1').get(f.id);
            return {
                facility_id: f.id,
                name: f.name,
                location: f.location,
                lat: f.lat,
                lng: f.lng,
                status: status?.status || 'GREEN',
                occupancy: {
                    current: Math.round(summary.occupancy_rate * 20),
                    total: f.total_stalls
                },
                queue: {
                    wait_time_mins: Math.round(summary.time_since_last_clean_minutes / 10), // Mock wait time derivation
                    pressure_level: summary.queue_pressure
                },
                cleanliness_score: summary.cleanliness_score,
                last_cleaned_at: summary.last_cleaned_at,
                alerts_open_count: summary.alerts_open_count,
                rush_prediction: rush || { surge_in_mins: 15, confidence_pct: 75 },
                is_accessible: true
            };
        });
        res.json(cards);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 3. Alerts Stream
router.get('/alerts-stream', (req, res) => {
    try {
        const alerts = setup_1.db.prepare(`
      SELECT m.*, f.name as facility_name 
      FROM maintenance_tasks m
      JOIN facilities f ON m.facility_id = f.id
      ORDER BY m.id DESC LIMIT 20
    `).all();
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map