import webpush from 'web-push';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';
const subject = process.env.VAPID_SUBJECT || '';

console.log('[WebPush] VAPID Public Key loaded:', publicKey ? 'Yes' : 'No');
console.log('[WebPush] VAPID Private Key loaded:', privateKey ? 'Yes' : 'No');
console.log('[WebPush] VAPID Subject loaded:', subject ? 'Yes' : 'No');

if (publicKey && privateKey && subject) {
  try {
    webpush.setVapidDetails(
      subject,
      publicKey,
      privateKey
    );
    console.log('[WebPush] VAPID details set successfully');
  } catch (error) {
    console.error('[WebPush] Error setting VAPID details:', error);
  }
} else {
  console.warn('[WebPush] VAPID keys not configured - push notifications will not work');
}

export const getVapidPublicKey = () => publicKey;

export const sendPushNotification = async (subscription: any, payload: any) => {
  if (!publicKey || !privateKey || !subject) {
    console.log('[WebPush] Push notification skipped - VAPID keys not configured');
    return { error: 'not configured' };
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error: any) {
    if (error.statusCode === 410) {
      console.log('[WebPush] Push subscription expired, removing...');
      return { error: 'expired' };
    }
    console.error('[WebPush] Push notification error:', error.message);
    return { error: 'failed' };
  }
};

export default webpush;
