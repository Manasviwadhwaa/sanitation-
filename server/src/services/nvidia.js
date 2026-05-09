"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIInsights = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
});
const getAIInsights = async (facilityName, stats) => {
    try {
        const response = await openai.chat.completions.create({
            model: "meta/llama-3.1-405b-instruct", // High-performance model for facility reasoning
            messages: [
                {
                    role: "system",
                    content: "You are an expert facility management AI for the SAFAI platform. Analyze sensor data and provide one short, actionable recommendation (max 15 words)."
                },
                {
                    role: "user",
                    content: `Facility: ${facilityName}. Stats: Cleanliness ${stats.cleanliness}%, Occupancy ${stats.occupancy}%.`
                }
            ],
            temperature: 0.2,
            max_tokens: 50,
        });
        return response.choices[0].message.content || "Monitoring active.";
    }
    catch (error) {
        console.error('NVIDIA NIM Error:', error);
        return "Optimizing resource allocation...";
    }
};
exports.getAIInsights = getAIInsights;
//# sourceMappingURL=nvidia.js.map