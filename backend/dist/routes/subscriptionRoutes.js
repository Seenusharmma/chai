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
const express_1 = __importDefault(require("express"));
const PushSubscription_1 = require("../models/PushSubscription");
const webPush_1 = require("../utils/webPush");
const router = express_1.default.Router();
router.get('/vapidPublicKey', (req, res) => {
    const publicKey = (0, webPush_1.getVapidPublicKey)();
    console.log('VAPID Public Key requested, returning:', publicKey ? 'key exists' : 'NO KEY');
    res.json({ publicKey });
});
router.post('/subscribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscription, email } = req.body;
        console.log('[Subscribe] Request received for:', email);
        if (!subscription || !email) {
            console.log('[Subscribe] Missing subscription or email');
            return res.status(400).json({ error: 'Missing subscription or email' });
        }
        const normalizedEmail = email.toLowerCase();
        console.log('[Subscribe] Subscription endpoint:', subscription.endpoint);
        console.log('[Subscribe] Normalized email:', normalizedEmail);
        const existingSubscription = yield PushSubscription_1.PushSubscription.findOne({
            'subscription.endpoint': subscription.endpoint,
        });
        if (existingSubscription) {
            console.log('[Subscribe] Subscription already exists');
            return res.json({ message: 'Subscription already exists' });
        }
        const newSubscription = new PushSubscription_1.PushSubscription({
            userEmail: normalizedEmail,
            subscription,
        });
        yield newSubscription.save();
        console.log('[Subscribe] ✅ Subscription saved successfully for:', normalizedEmail);
        res.json({ message: 'Subscription saved successfully' });
    }
    catch (error) {
        console.error('[Subscribe] Error:', error);
        res.status(500).json({ error: 'Failed to save subscription' });
    }
}));
router.delete('/unsubscribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { endpoint, email } = req.body;
        yield PushSubscription_1.PushSubscription.deleteOne({
            userEmail: email,
            'subscription.endpoint': endpoint,
        });
        res.json({ message: 'Unsubscribed successfully' });
    }
    catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
}));
exports.default = router;
