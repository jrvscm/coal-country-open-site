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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  // Initial splash screen
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsInitialLoad(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // Listen for SmartLink transitions
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      if (customEvent?.detail?.href && customEvent.detail.href !== pathname) {
        setPendingPath(customEvent.detail.href);
        setShowSplash(true); // start splash
      }
    };

    document.addEventListener('start-transition', handler);
    return () => document.removeEventListener('start-transition', handler);
  }, [pathname]);

  // After splash fully displays, perform the route change
  useEffect(() => {
    if (pendingPath && pendingPath !== pathname) {
      const delay = setTimeout(() => {
        router.push(pendingPath);
      }, 700); // adjust based on slide-in duration

      return () => clearTimeout(delay);
    }
  }, [pendingPath, pathname, router]);

  // After routing completes, hide splash
  useEffect(() => {
    if (!isInitialLoad) {
      const hide = setTimeout(() => {
        setShowSplash(false);
        setPendingPath(null);
      }, 1400); // match splash out duration
      return () => clearTimeout(hide);
    }
  }, [pathname, isInitialLoad]);

  return (
    <>
      {showSplash && <SplashScreen isInitialLoad={isInitialLoad} />}
      <div data-transition-triggerer>{children}</div>
    </>
  );
}
