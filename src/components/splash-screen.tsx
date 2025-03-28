'use client';
import { useEffect, useState } from 'react';
import '../styles/splash.css';

export default function SplashScreen({ isInitialLoad = false }: { isInitialLoad?: boolean }) {
  const [slideOut, setSlideOut] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    //initial load times out on first load because we don't slide in
    // the second value is when the splash will leave
    const slideTimeout = setTimeout(() => setSlideOut(true), isInitialLoad ? 1000 : 1000); // delay start of slide out
    const hideTimeout = setTimeout(() => setHide(true), 1800);

    return () => {
      clearTimeout(slideTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isInitialLoad]);

  if (hide) return null; 

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-transform overflow-hidden 
      ${slideOut ? 'splash-slide-out' : ''}
      ${!isInitialLoad && !slideOut ? 'splash-slide-in' : ''}`}
    >
      <div
        className={`relative text-center transition-opacity duration-1000 ease-in-out`}
      >
        <h2 className="absolute -rotate-[25deg] left-[-1rem] top-[-1rem] text-lg italic text-customYellow">
          The
        </h2>
        <h1 className="text-5xl md:text-7xl font-heading tracking-tight text-white animate-glow relative z-10">
          Coal Country Open
        </h1>
        {/* <div className="mt-4">
          <Image
            src="https://images.ctfassets.net/j2939n6mdbyq/3nVn09ySuMJdpRghyyVqeA/8a0f6cafff701f13c11bcdcb0201f950/modified_logo.png"
            alt="Coal Country Open Logo"
            width={200}
            height={100}
            className="mx-auto h-auto w-auto object-contain"
          />
        </div> */}
      </div>
    </div>
  );
}
