import mongoose from 'mongoose';

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['GREEN', 'AMBER', 'RED'], default: 'GREEN' },
  cleanliness: { type: Number, default: 100 },
  occupancy: { type: Number, default: 0 },
  waitTime: { type: String, default: '0 mins' },
  rushPrediction: { type: String },
  aiRecommendation: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

export const Facility = mongoose.model('Facility', FacilitySchema);
