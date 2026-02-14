import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('[PushNotifications] API URL:', API_URL);

export function usePushNotifications() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [vapidPublicKey, setVapidPublicKey] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(pushSupported);
      setPermissionStatus(Notification.permission);
      console.log('[PushNotifications] Supported:', pushSupported, 'Permission:', Notification.permission);
    }
  }, []);

  const getVapidKey = useCallback(async () => {
    try {
      console.log('[PushNotifications] Fetching VAPID key from:', `${API_URL}/subscriptions/vapidPublicKey`);
      const response = await axios.get(`${API_URL}/subscriptions/vapidPublicKey`);
      console.log('[PushNotifications] VAPID response:', response.data);
      setVapidPublicKey(response.data.publicKey);
      return response.data.publicKey;
    } catch (error: any) {
      console.error('[PushNotifications] Failed to get VAPID key:', error.message);
      setError('Failed to get VAPID key: ' + error.message);
      return null;
    }
  }, []);

  const subscribe = useCallback(async () => {
    console.log('[PushNotifications] Subscribe called, isSupported:', isSupported, 'user:', user?.primaryEmailAddress?.emailAddress);
    
    if (!isSupported) {
      setError('Push notifications not supported');
      return null;
    }
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      setError('User not logged in');
      return null;
    }

    try {
      let publicKey = vapidPublicKey;
      if (!publicKey) {
        console.log('[PushNotifications] No cached VAPID key, fetching...');
        publicKey = await getVapidKey();
      }
      
      if (!publicKey) {
        throw new Error('No VAPID public key available');
      }

      console.log('[PushNotifications] Getting service worker registration...');
      const registration = await navigator.serviceWorker.ready;
      console.log('[PushNotifications] Service worker ready, registering push...');
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      console.log('[PushNotifications] Push subscription created:', sub.endpoint);

      const subJson = sub.toJSON();
      console.log('[PushNotifications] Subscription JSON:', JSON.stringify(subJson));

      console.log('[PushNotifications] Saving subscription to backend...');
      const saveResponse = await axios.post(`${API_URL}/subscriptions/subscribe`, {
        subscription: subJson,
        email: user.primaryEmailAddress.emailAddress,
      });
      console.log('[PushNotifications] Subscription saved:', saveResponse.data);

      setSubscription(subJson);
      setPermissionStatus('granted');
      setError('');
      return subJson;
    } catch (error: any) {
      console.error('[PushNotifications] Subscribe error:', error);
      setError('Failed to subscribe: ' + error.message);
      return null;
    }
  }, [isSupported, user, vapidPublicKey, getVapidKey]);

  const unsubscribe = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      if (subscription) {
        await axios.delete(`${API_URL}/subscriptions/unsubscribe`, {
          data: {
            endpoint: subscription.endpoint,
            email: user.primaryEmailAddress.emailAddress,
          },
        });
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }
      
      setSubscription(null);
      setPermissionStatus('default');
      setError('');
    } catch (error: any) {
      console.error('[PushNotifications] Unsubscribe error:', error);
      setError('Failed to unsubscribe: ' + error.message);
    }
  }, [subscription, user]);

  const requestPermission = useCallback(async () => {
    console.log('[PushNotifications] Requesting permission...');
    if (!isSupported) {
      setError('Push notifications not supported');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('[PushNotifications] Permission result:', permission);
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        return await subscribe();
      } else if (permission === 'denied') {
        setError('Notification permission denied');
      }
      return null;
    } catch (error: any) {
      console.error('[PushNotifications] Request permission error:', error);
      setError('Failed to request permission: ' + error.message);
      return null;
    }
  }, [isSupported, subscribe]);

  return {
    isSupported,
    permissionStatus,
    subscription,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}
