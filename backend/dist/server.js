"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const socket_1 = require("./utils/socket");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const PORT = process.env.PORT || 5000;
console.log('========================================');
console.log('Starting server...');
console.log('Port:', PORT);
console.log('========================================');
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Connecting to database...');
        yield (0, db_1.default)();
        console.log('Database connected successfully');
    }
    catch (err) {
        console.error('Database connection error:', err);
        console.log('Starting server anyway (some features may not work)...');
    }
    const server = http_1.default.createServer(app_1.default);
    (0, socket_1.initSocket)(server);
    server.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log('========================================');
    });
    server.on('error', (error) => {
        console.error('Server error:', error);
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
        }
    });
});
startServer();
