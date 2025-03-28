'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type SmartLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

const SmartLink = React.forwardRef<HTMLAnchorElement, SmartLinkProps>(
  ({ href, children, onClick, ...rest }, ref) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      e.preventDefault();

      document.dispatchEvent(new CustomEvent('start-transition', { detail: { href } }));

      setTimeout(() => {
        router.push(href);
      }, 800);
    };

    return (
      <a
        href={href}
        onClick={handleClick}
        {...rest}
        ref={ref}
      >
        {children}
      </a>
    );
  }
);

SmartLink.displayName = 'SmartLink';
export default SmartLink;
