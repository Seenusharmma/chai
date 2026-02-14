'use client';

import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import { Bell, BellOff, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export function PushNotificationButton() {
  const { user, isLoaded } = useUser();
  const { isSupported, permissionStatus, requestPermission, unsubscribe, error } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    console.log('[PushButton] isSupported:', isSupported, 'permissionStatus:', permissionStatus);
  }, [isSupported, permissionStatus]);

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleClick = async () => {
    console.log('[PushButton] Handle click, current status:', permissionStatus);
    setIsLoading(true);
    setStatusMessage('');
    try {
      if (permissionStatus === 'granted') {
        await unsubscribe();
        setStatusMessage('Notifications disabled');
      } else if (permissionStatus === 'denied') {
        setStatusMessage('Notifications blocked. Please enable in browser settings.');
      } else {
        const result = await requestPermission();
        if (result) {
          setStatusMessage('Notifications enabled!');
        } else {
          setStatusMessage('Failed to enable notifications');
        }
      }
    } catch (error) {
      console.error('[PushButton] Error:', error);
      setStatusMessage('Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="w-full flex items-center justify-center gap-3 p-4 md:p-5 bg-[#2D2520] rounded-2xl border border-white/5 text-[#A89B8F]">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">Push notifications not supported on this device</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 p-4 md:p-5 bg-[#2D2520] rounded-2xl border border-white/5 text-white font-medium hover:bg-[#352D28] transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : permissionStatus === 'granted' ? (
          <>
            <Bell className="w-5 h-5 text-green-400" />
            <span>Notifications Enabled</span>
          </>
        ) : (
          <>
            <BellOff className="w-5 h-5" />
            <span>Enable Notifications</span>
          </>
        )}
      </button>
      {statusMessage && (
        <p className="text-center text-xs text-[#A89B8F]">{statusMessage}</p>
      )}
      {permissionStatus === 'denied' && (
        <p className="text-center text-xs text-red-400">
          Notifications blocked. Please enable in browser settings.
        </p>
      )}
    </div>
  );
}
