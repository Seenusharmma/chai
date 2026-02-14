import webpush from 'web-push';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';
const subject = process.env.VAPID_SUBJECT || '';

console.log('VAPID Public Key loaded:', publicKey ? 'Yes' : 'No');
console.log('VAPID Private Key loaded:', privateKey ? 'Yes' : 'No');
console.log('VAPID Subject loaded:', subject ? 'Yes' : 'No');

if (!publicKey || !privateKey || !subject) {
  console.error('ERROR: VAPID keys not properly configured!');
} else {
  webpush.setVapidDetails(
    subject,
    publicKey,
    privateKey
  );
}

export const getVapidPublicKey = () => publicKey;

export const sendPushNotification = async (subscription: any, payload: any) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error: any) {
    if (error.statusCode === 410) {
      console.log('Push subscription expired, removing...');
      return { error: 'expired' };
    }
    console.error('Push notification error:', error);
    return { error: 'failed' };
  }
};

export default webpush;
