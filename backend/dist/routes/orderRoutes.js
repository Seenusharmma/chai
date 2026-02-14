"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.route('/')
    .post(orderController_1.createOrder)
    .get(orderController_1.getOrders);
router.route('/:id/status').put(orderController_1.updateOrderStatus);
router.route('/history/:email').get(orderController_1.getUserOrders);
router.route('/:id').delete(orderController_1.deleteOrder);
exports.default = router;
