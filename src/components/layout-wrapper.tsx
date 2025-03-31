'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransitionContext } from '@/context/TransitionContext';
import SplashScreen from '@/components/splash-screen';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [showSplash, setShowSplash] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { endTransition } = useTransitionContext();

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsInitialLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const safety = setTimeout(() => {
      // in case something breaks, force hide splash 
      setShowSplash(false);
      setPendingPath(null);
      endTransition();
    }, 6000);
  
    return () => clearTimeout(safety);
  }, [endTransition]);

  // SmartLink trigger
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const href = customEvent?.detail?.href;

      if (!href) return;

      setShowSplash(true);

      if (href === pathname) {
        // Same page – manually end transition after splash
        setTimeout(() => {
          setShowSplash(false);
          setPendingPath(null);
          endTransition();
        }, 1600);
      } else {
        // New route – handled by route push + pathname effect
        setPendingPath(href);
      }
    };

    document.addEventListener('start-transition', handler);
    return () => document.removeEventListener('start-transition', handler);
  }, [pathname, endTransition]);

  // Route push while splash is active
  useEffect(() => {
    if (pendingPath && pendingPath !== pathname) {
      const routeTimer = setTimeout(() => {
        router.push(pendingPath!);
      }, 700);
      return () => clearTimeout(routeTimer);
    }
  }, [pendingPath, pathname, router]);

  useEffect(() => {
    if (!isInitialLoad && pendingPath) {
      const handlePageReady = () => {
        setTimeout(() => {
          setShowSplash(false);
          setPendingPath(null);
          endTransition();
        }, 800); 
      };
  
      document.addEventListener('page-ready', handlePageReady);
      return () => document.removeEventListener('page-ready', handlePageReady);
    }
  }, [isInitialLoad, pendingPath, endTransition]);

  return (
    <>
      {showSplash && <SplashScreen isInitialLoad={isInitialLoad} />}
      <div data-transition-triggerer>{children}</div>
    </>
  );
}
