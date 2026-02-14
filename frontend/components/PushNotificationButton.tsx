'use client';

import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export function PushNotificationButton() {
  const { user, isLoaded } = useUser();
  const { isSupported, permissionStatus, requestPermission, unsubscribe } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) {
    return null;
  }

  if (!isSupported) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (permissionStatus === 'granted') {
        await unsubscribe();
      } else {
        await requestPermission();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
