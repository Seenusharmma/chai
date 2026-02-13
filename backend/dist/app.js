"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
// Routes
app.use('/api/orders', orderRoutes_1.default);
app.get('/', (req, res) => {
    res.send('API is running...');
});
const errorMiddleware_1 = require("./middleware/errorMiddleware");
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
