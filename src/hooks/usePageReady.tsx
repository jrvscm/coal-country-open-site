// usePageReady.ts
import { useEffect } from 'react';

export const usePageReady = () => {
  useEffect(() => {
    if (document.readyState === 'complete') {
      document.dispatchEvent(new Event('page-ready'));
    } else {
      window.addEventListener('load', () => {
        document.dispatchEvent(new Event('page-ready'));
      }, { once: true });
    }
  }, []);
};