'use client';

import { useEffect } from 'react';

export default function FaviconSwitcher() {
  useEffect(() => {
    const setFavicon = (isDark: boolean) => {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;

      if (link) {
        link.href = isDark ? '/favicon.png' : '/favicon-dark.png';
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = isDark ? '/favicon.png' : '/favicon-dark.png';
        document.head.appendChild(newLink);
      }
    };

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setFavicon(mql.matches);

    const listener = (e: MediaQueryListEvent) => setFavicon(e.matches);
    mql.addEventListener('change', listener);

    return () => mql.removeEventListener('change', listener);
  }, []);

  return null;
}
