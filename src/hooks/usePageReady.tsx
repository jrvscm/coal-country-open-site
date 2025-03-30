import { useEffect } from 'react';

export const usePageReady = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('page-ready'));
    }, 10000); 
    return () => clearTimeout(timer);
  }, []);
};