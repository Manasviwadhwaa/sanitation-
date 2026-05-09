"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const setup_1 = require("./db/setup");
const sensorJob_1 = require("./jobs/sensorJob");
const predictiveJob_1 = require("./jobs/predictiveJob");
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const facilities_1 = __importDefault(require("./routes/facilities"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
exports.httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(exports.httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// Initialize DB and Jobs
(0, setup_1.initDB)();
(0, sensorJob_1.initSensorJob)();
(0, predictiveJob_1.initPredictiveJob)();
// Register Routes
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/facilities', facilities_1.default);
// Additional admin/analytics routes
app.get('/api/analytics/trends', (req, res) => {
    res.json({
        occupancy_trends: [45, 52, 68, 85, 92, 78, 62],
        cleanliness_score_history: [92, 90, 88, 85, 82, 85, 88],
        peak_hour: "18:00"
    });
});
exports.io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
exports.httpServer.listen(port, () => {
    console.log(`SAAF Advanced Backend running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map