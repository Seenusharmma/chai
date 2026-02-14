import express from 'express';
import { PushSubscription } from '../models/PushSubscription';
import { getVapidPublicKey } from '../utils/webPush';

const router = express.Router();

router.get('/vapidPublicKey', (req, res) => {
  const publicKey = getVapidPublicKey();
  console.log('VAPID Public Key requested, returning:', publicKey ? 'key exists' : 'NO KEY');
  res.json({ publicKey });
});

router.post('/subscribe', async (req, res) => {
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

    const existingSubscription = await PushSubscription.findOne({
      'subscription.endpoint': subscription.endpoint,
    });

    if (existingSubscription) {
      console.log('[Subscribe] Subscription already exists');
      return res.json({ message: 'Subscription already exists' });
    }

    const newSubscription = new PushSubscription({
      userEmail: normalizedEmail,
      subscription,
    });

    await newSubscription.save();
    console.log('[Subscribe] ✅ Subscription saved successfully for:', normalizedEmail);

    res.json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('[Subscribe] Error:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

router.delete('/unsubscribe', async (req, res) => {
  try {
    const { endpoint, email } = req.body;

    await PushSubscription.deleteOne({
      userEmail: email,
      'subscription.endpoint': endpoint,
    });

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
