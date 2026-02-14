"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menuController_1 = require("../controllers/menuController");
const upload_1 = __importDefault(require("../config/upload"));
const router = express_1.default.Router();
router.get('/', menuController_1.getMenu);
router.get('/categories', menuController_1.getCategories);
router.post('/seed', menuController_1.seedMenu);
router.post('/', upload_1.default.single('image'), menuController_1.createMenuItem);
router.put('/:id', menuController_1.updateMenuItem);
router.delete('/:id', menuController_1.deleteMenuItem);
exports.default = router;
