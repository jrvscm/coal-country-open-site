'use client';

import React from 'react';

type SmartLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

const SmartLink = React.forwardRef<HTMLAnchorElement, SmartLinkProps>(
  ({ href, children, onClick, ...rest }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      e.preventDefault();

      document.dispatchEvent(new CustomEvent('start-transition', { detail: { href } }));
    };

    return (
      <a href={href} onClick={handleClick} ref={ref} {...rest}>
        {children}
      </a>
    );
  }
);

SmartLink.displayName = 'SmartLink';
export default SmartLink;
