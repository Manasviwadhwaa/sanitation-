"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictiveJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const setup_1 = require("../db/setup");
const index_1 = require("../index");
const initPredictiveJob = () => {
    node_cron_1.default.schedule('*/5 * * * *', () => {
        console.log('Running predictive rush simulation...');
        const facilities = setup_1.db.prepare('SELECT * FROM facilities').all();
        for (const facility of facilities) {
            const surgeInMins = Math.floor(Math.random() * 55) + 5; // 5-60 mins
            const confidence = 50 + Math.random() * 45; // 50-95%
            setup_1.db.prepare(`
        INSERT INTO predicted_rush (facility_id, predicted_at, surge_in_mins, confidence_pct, source)
        VALUES (?, ?, ?, ?, ?)
      `).run(facility.id, new Date().toISOString(), surgeInMins, confidence, 'schedule_simulator');
            index_1.io.emit('rush_prediction', {
                facility_id: facility.id,
                surge_in_mins: surgeInMins,
                confidence_pct: confidence,
                source: 'AI_PREDICTIVE_MODEL'
            });
        }
    });
};
exports.initPredictiveJob = initPredictiveJob;
//# sourceMappingURL=predictiveJob.js.map