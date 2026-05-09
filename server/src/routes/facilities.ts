import express from 'express';
import { db } from '../db/setup';
import { getFacilityHealthSummary } from '../services/analyticsService';

const router = express.Router();

// 1. Get Recommendations (Clean Toilet Locator)
router.get('/recommendation', (req, res) => {
  try {
    const { lat, lng } = req.query;
    const facilities = db.prepare('SELECT * FROM facilities').all() as any[];
    
    const recommendations = facilities.map(f => {
      const summary = getFacilityHealthSummary(f.id);
      
      // Composite Score Logic: score = w1*cleanliness - w2*wait_time - w3*occupancy
      const score = (summary.cleanliness_score * 0.5) - 
                    (summary.time_since_last_clean_minutes * 0.1) - 
                    (summary.occupancy_rate * 20);
      
      // Simple distance mock (since we are in a demo environment)
      const distance = Math.sqrt(Math.pow(f.lat - Number(lat || 0), 2) + Math.pow(f.lng - Number(lng || 0), 2)) * 111000; // meters

      return {
        facility_id: f.id,
        name: f.name,
        status: summary.cleanliness_score > 80 ? 'GREEN' : (summary.cleanliness_score > 60 ? 'AMBER' : 'RED'),
        wait_time_mins: Math.round(summary.occupancy_rate * 5),
        cleanliness_score: summary.cleanliness_score,
        distance_m: Math.round(distance),
        reason: summary.cleanliness_score > 85 ? "Recently sanitized and low crowd" : "Standard maintenance level",
        score
      };
    }).sort((a, b) => b.score - a.score);

    res.json({
      best_facility_id: recommendations[0].facility_id,
      recommendations: recommendations.slice(0, 3)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Existing Facilities List (Updated with rich fields)
router.get('/', (req, res) => {
  try {
    const facilities = db.prepare('SELECT * FROM facilities').all() as any[];
    const enriched = facilities.map(f => ({
      ...f,
      health: getFacilityHealthSummary(f.id),
      is_accessible: true
    }));
    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
