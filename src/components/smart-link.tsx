'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTransitionContext } from '@/context/TransitionContext';
import { start } from 'repl';

type SmartLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

const SmartLink = React.forwardRef<HTMLAnchorElement, SmartLinkProps>(
  ({ href, children, onClick, ...rest }, ref) => {
    const router = useRouter();
    const { isTransitioning, startTransition } = useTransitionContext();
    // console.count()
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      e.preventDefault();

      if (isTransitioning) return; // BLOCK double navigation

      startTransition();
      document.dispatchEvent(new CustomEvent('start-transition', { detail: { href } }));
    };

    return (
      <a
        href={href}
        onClick={handleClick}
        aria-disabled={isTransitioning}
        style={isTransitioning ? { pointerEvents: 'none', opacity: 0.6 } : {}}
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

SmartLink.displayName = 'SmartLink';
export default SmartLink;
