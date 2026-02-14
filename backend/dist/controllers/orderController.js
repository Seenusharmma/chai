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
exports.getUserOrders = exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const socket_1 = require("../utils/socket");
const PushSubscription_1 = require("../models/PushSubscription");
const webPush_1 = require("../utils/webPush");
const getStatusMessage = (status) => {
    switch (status) {
        case 'accepted':
            return 'Your order has been accepted!';
        case 'processing':
            return 'Your order is being prepared...';
        case 'completed':
        case 'delivered':
            return 'Your order has been delivered!';
        case 'declined':
        case 'cancelled':
            return 'Your order has been cancelled';
        default:
            return `Order status: ${status}`;
    }
};
const sendPushToUser = (userEmail, orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Sending push notification to:', userEmail, 'for order:', orderId, 'status:', status);
        const subscriptions = yield PushSubscription_1.PushSubscription.find({ userEmail });
        console.log('Found subscriptions:', subscriptions.length);
        if (subscriptions.length === 0) {
            console.log('No subscriptions found for user');
            return;
        }
        for (const sub of subscriptions) {
            const payload = {
                title: 'AuraCafe Order Update',
                body: getStatusMessage(status),
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                tag: `order-${orderId}`,
                data: {
                    url: `/history?orderId=${orderId}`,
                    orderId,
                    status,
                },
            };
            console.log('Sending push notification to endpoint:', sub.subscription.endpoint);
            const result = yield (0, webPush_1.sendPushNotification)(sub.subscription, payload);
            if ((result === null || result === void 0 ? void 0 : result.error) === 'expired') {
                console.log('Subscription expired, removing...');
                yield PushSubscription_1.PushSubscription.deleteOne({ _id: sub._id });
            }
            else if ((result === null || result === void 0 ? void 0 : result.error) === 'failed') {
                console.log('Push notification failed');
            }
            else {
                console.log('Push notification sent successfully');
            }
        }
    }
    catch (error) {
        console.error('Push notification error:', error);
    }
});
// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderType, items, totalAmount, userEmail, customerName, phoneNumber, address } = req.body;
        const order = new Order_1.default({
            orderType,
            items,
            totalAmount,
            userEmail,
            customerName,
            phoneNumber,
            address,
        });
        const createdOrder = yield order.save();
        // Emit event to Admin
        const io = (0, socket_1.getIO)();
        io.to('admin').emit('newOrder', createdOrder);
        res.status(201).json(createdOrder);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ message: 'Invalid order data', error: error.message });
    }
});
exports.createOrder = createOrder;
// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({}).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const order = yield Order_1.default.findById(req.params.id);
        if (order) {
            order.status = status;
            const updatedOrder = yield order.save();
            // Emit event to User via Socket
            const io = (0, socket_1.getIO)();
            if (order.userEmail) {
                io.to(order.userEmail).emit('orderStatusUpdated', updatedOrder);
                // Send push notification
                yield sendPushToUser(order.userEmail, order._id.toString(), status);
            }
            // Also emit to admin to update their view if needed, or just broadcast
            io.emit('orderStatusUpdated', updatedOrder);
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// @desc    Get logged in user orders
// @route   GET /api/orders/history/:email
// @access  Private
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getUserOrders = getUserOrders;
