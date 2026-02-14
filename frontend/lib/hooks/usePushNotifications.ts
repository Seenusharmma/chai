import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('Push Notifications - API URL:', API_URL);

export function usePushNotifications() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [vapidPublicKey, setVapidPublicKey] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermissionStatus(Notification.permission);
      console.log('Push notifications supported, current permission:', Notification.permission);
    } else {
      console.log('Push notifications NOT supported in this browser');
    }
  }, []);

  const getVapidKey = useCallback(async () => {
    try {
      console.log('Fetching VAPID public key from:', `${API_URL}/subscriptions/vapidPublicKey`);
      const response = await axios.get(`${API_URL}/subscriptions/vapidPublicKey`);
      console.log('VAPID response:', response.data);
      setVapidPublicKey(response.data.publicKey);
      return response.data.publicKey;
    } catch (error: any) {
      console.error('Failed to get VAPID key:', error.message);
      return null;
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported || !user?.primaryEmailAddress?.emailAddress) return null;

    try {
      const publicKey = vapidPublicKey || await getVapidKey();
      if (!publicKey) throw new Error('No VAPID public key');

      const registration = await navigator.serviceWorker.ready;
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subJson = sub.toJSON();

      await axios.post(`${API_URL}/subscriptions/subscribe`, {
        subscription: subJson,
        email: user.primaryEmailAddress.emailAddress,
      });

      setSubscription(subJson);
      setPermissionStatus('granted');
      return subJson;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return null;
    }
  }, [isSupported, user, vapidPublicKey, getVapidKey]);

  const unsubscribe = useCallback(async () => {
    if (!subscription || !user?.primaryEmailAddress?.emailAddress) return;

    try {
      await axios.delete(`${API_URL}/subscriptions/unsubscribe`, {
        data: {
          endpoint: subscription.endpoint,
          email: user.primaryEmailAddress.emailAddress,
        },
      });

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }
      
      setSubscription(null);
      setPermissionStatus('default');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }, [subscription, user]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return null;

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        return await subscribe();
      }
      return null;
    } catch (error) {
      console.error('Failed to request permission:', error);
      return null;
    }
  }, [isSupported, subscribe]);

  return {
    isSupported,
    permissionStatus,
    subscription,
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
