"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/sync', userController_1.syncUser);
router.get('/', userController_1.getUsers);
router.put('/:id/role', userController_1.updateUserRole);
router.post('/promote-by-email', userController_1.promoteUserByEmail);
router.delete('/:id', userController_1.deleteUser);
exports.default = router;
