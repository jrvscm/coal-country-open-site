'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [showSplash, setShowSplash] = useState(true);
  // const [isBlurred, setIsBlurred] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);
  useEffect(() => {
    if (isInitialLoad) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsInitialLoad(false); // now we’re on normal routing
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);
  

    // Listen for custom transition events from SmartLink
    useEffect(() => {
        const handler = (e: Event) => {
        const customEvent = e as CustomEvent<{ href: string }>;
        if (customEvent?.detail?.href) {
            setPendingPath(customEvent.detail.href);
        }
    };

    document.addEventListener('start-transition', handler);
    return () => {
      document.removeEventListener('start-transition', handler);
    };
  }, []);


  useEffect(() => {
    if (pendingPath && pendingPath !== pathname) {
      // setIsBlurred(true);
      setShowSplash(true);

      const delay = setTimeout(() => {
        router.push(pendingPath); 
      }, 800);

      return () => clearTimeout(delay);
    }
  }, [pendingPath, pathname, router]);

  useEffect(() => {
    // const unblur = setTimeout(() => {
    //   // setIsBlurred(false); // <-- blur goes away sooner
    // }, 800); // match SmartLink delay or slightly before
  
    const hideSplash = setTimeout(() => {
      setShowSplash(false);
      setPendingPath(null);
    }, 1800);
  
    return () => {
      // clearTimeout(unblur);
      clearTimeout(hideSplash);
    };
  }, [pathname]);

  return (
    <>
      {showSplash && <SplashScreen isInitialLoad={isInitialLoad} />}

      {/* <div
        className={`pointer-events-none fixed inset-0 z-[9998] transition-all duration-100 ease-in-out ${
          isBlurred ? 'backdrop-blur-md' : 'backdrop-blur-0'
        }`}
      /> */}

      <div data-transition-triggerer>{children}</div>
    </>
  );
}
