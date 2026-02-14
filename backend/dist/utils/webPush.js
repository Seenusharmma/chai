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
exports.sendPushNotification = exports.getVapidPublicKey = void 0;
const web_push_1 = __importDefault(require("web-push"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';
const subject = process.env.VAPID_SUBJECT || '';
console.log('[WebPush] VAPID Public Key loaded:', publicKey ? 'Yes' : 'No');
console.log('[WebPush] VAPID Private Key loaded:', privateKey ? 'Yes' : 'No');
console.log('[WebPush] VAPID Subject loaded:', subject ? 'Yes' : 'No');
if (publicKey && privateKey && subject) {
    try {
        web_push_1.default.setVapidDetails(subject, publicKey, privateKey);
        console.log('[WebPush] VAPID details set successfully');
    }
    catch (error) {
        console.error('[WebPush] Error setting VAPID details:', error);
    }
}
else {
    console.warn('[WebPush] VAPID keys not configured - push notifications will not work');
}
const getVapidPublicKey = () => publicKey;
exports.getVapidPublicKey = getVapidPublicKey;
const sendPushNotification = (subscription, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!publicKey || !privateKey || !subject) {
        console.log('[WebPush] Push notification skipped - VAPID keys not configured');
        return { error: 'not configured' };
    }
    try {
        yield web_push_1.default.sendNotification(subscription, JSON.stringify(payload));
        return { success: true };
    }
    catch (error) {
        if (error.statusCode === 410) {
            console.log('[WebPush] Push subscription expired, removing...');
            return { error: 'expired' };
        }
        console.error('[WebPush] Push notification error:', error.message);
        return { error: 'failed' };
    }
});
exports.sendPushNotification = sendPushNotification;
exports.default = web_push_1.default;
