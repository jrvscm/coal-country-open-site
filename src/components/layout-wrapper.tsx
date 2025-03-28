'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [showSplash, setShowSplash] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsInitialLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // SmartLink trigger
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      if (customEvent?.detail?.href) {
        setPendingPath(customEvent.detail.href);
        setShowSplash(true); // Cover screen immediately
      }
    };
    document.addEventListener('start-transition', handler);
    return () => document.removeEventListener('start-transition', handler);
  }, []);

  // Route push while splash is active
  useEffect(() => {
    if (pendingPath && pendingPath !== pathname) {
      const routeTimer = setTimeout(() => {
        router.push(pendingPath!);
      }, 700);
      return () => clearTimeout(routeTimer);
    }
  }, [pendingPath, pathname]);

  // After route change, hide splash
  useEffect(() => {
    if (!isInitialLoad) {
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
        setPendingPath(null);
      }, 1600);
      return () => clearTimeout(hideTimer);
    }
  }, [pathname]);

  return (
    <>
      {showSplash && <SplashScreen isInitialLoad={isInitialLoad} />}
      <div data-transition-triggerer>{children}</div>
    </>
  );
}
