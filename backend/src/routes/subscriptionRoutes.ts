import express from 'express';
import { PushSubscription } from '../models/PushSubscription';
import { getVapidPublicKey } from '../utils/webPush';

const router = express.Router();

router.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: getVapidPublicKey() });
});

router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, email } = req.body;

    if (!subscription || !email) {
      return res.status(400).json({ error: 'Missing subscription or email' });
    }

    const existingSubscription = await PushSubscription.findOne({
      'subscription.endpoint': subscription.endpoint,
    });

    if (existingSubscription) {
      return res.json({ message: 'Subscription already exists' });
    }

    const newSubscription = new PushSubscription({
      userEmail: email,
      subscription,
    });

    await newSubscription.save();

    res.json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
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
