import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// 1. Heatmap (7x24 grid)
router.get('/heatmap', (req, res) => {
  try {
    // Return mock heatmap data based on historical crowd_queue data
    // dayIndex (0-6), hour (0-23), value (0-100)
    const heatmap = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmap.push({
          day,
          hour,
          value: Math.floor(Math.random() * 100) // In real world, aggregate from crowd_queue
        });
      }
    }
    res.json(heatmap);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Trends (Occupancy, Cleanliness, Ratings)
router.get('/trends', (req, res) => {
  try {
    const facilityId = req.query.facilityId;
    
    // For demo, return generated trends for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    res.json({
      labels: days,
      occupancy: days.map(() => Math.floor(Math.random() * 100)),
      cleanliness: days.map(() => 70 + Math.random() * 30),
      satisfaction: days.map(() => 3.5 + Math.random() * 1.5),
      peak_hours: ["10:00", "14:00", "18:00"]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
