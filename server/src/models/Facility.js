"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facility = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FacilitySchema = new mongoose_1.default.Schema({
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
exports.Facility = mongoose_1.default.model('Facility', FacilitySchema);
//# sourceMappingURL=Facility.js.map