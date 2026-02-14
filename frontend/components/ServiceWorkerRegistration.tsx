'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Registering push notification service worker...');
      
      navigator.serviceWorker
        .register('/push-sw.js')
        .then((registration) => {
          console.log('Push Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New content available, please refresh.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Push Service Worker registration failed:', error);
        });
    } else {
      console.log('Push notifications not supported in this browser');
    }
  }, []);

  return null;
}
