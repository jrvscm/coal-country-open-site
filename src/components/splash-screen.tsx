'use client';
import { useEffect, useState } from 'react';
import '../styles/splash.css';

export default function SplashScreen({ isInitialLoad = false }: { isInitialLoad?: boolean }) {
  const [slideOut, setSlideOut] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const slideOutTimer = setTimeout(() => {
      setSlideOut(true); // slide out AFTER route change
    }, 1200); // give 500ms buffer after route push

    const hideTimer = setTimeout(() => {
      setHide(true);
    }, 1600);

    return () => {
      clearTimeout(slideOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-transform duration-500 overflow-hidden
        ${slideOut ? 'splash-slide-out' : 'splash-slide-in'}`}
    >
      <div className="relative text-center transition-opacity duration-1000 ease-in-out">
        <h2 className="absolute -rotate-[25deg] left-[-1rem] top-[-1rem] text-lg italic text-customYellow">
          The
        </h2>
        <h1 className="text-5xl md:text-7xl font-heading drop-shadow-custom-600 tracking-tight text-white animate-glow">
          Coal Country Open
        </h1>
      </div>
    </div>
  );
}
