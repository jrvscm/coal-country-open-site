'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image'

export const Navbar = () => {
  const navigationItems = [
    {
      title: 'HOME',
      href: '/',
      description: ''
    },
    {
      title: 'REGISTER',
      href: '/registration/player',
      description: ''
    },
    {
      title: 'OUR SPONSORS',
      href: '/tournament/sponsors',
      description: ''
    },
    {
      title: 'RULES',
      href: '/tournament/rules',
      description: ''
    }
  ];

  const [isOpen, setOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkPosition = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect(); 
      setScrolled(window.scrollY > 50 || rect.top < 0);
    };

    checkPosition(); 

    window.addEventListener("scroll", checkPosition);
    return () => window.removeEventListener("scroll", checkPosition);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed left-0 right-0 top-0 z-40 w-full border-b border-customYellow transition-all duration-300 ${
        isScrolled ? 'lg:bg-black/60 lg:py-2 lg:backdrop-blur-2xl' : 'lg:py-4'
      }`}
    >
      <div className="container relative mx-auto flex items-center justify-start gap-4">
        {/* Logo Section */}
        <div className="flex hidden items-center justify-center lg:block">
          <Link href="/">
            <Image
              src="https://images.ctfassets.net/j2939n6mdbyq/3nVn09ySuMJdpRghyyVqeA/8a0f6cafff701f13c11bcdcb0201f950/modified_logo.png"
              alt="Coal Country Open Logo"
              width={200}  
              height={100} 
              className={`transition-all duration-300 ${
                isScrolled ? 'lg:h-12' : 'lg:h-24'
              } w-auto object-contain cursor-pointer`}
            />
          </Link>
        </div>
        {/* Navigation Menu */}
        <div className="hidden gap-4 lg:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink>
                    <Link href={item.href}>
                      <Button
                        variant="ghostMuted"
                        className="hover:text-customYellow"
                      >
                        {item.title}
                      </Button>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Buttons */}
        <div className="ml-auto flex hidden gap-4 lg:block">
          <Button variant="ghostMuted" className="hidden lg:inline hover:text-customYellow" asChild>
            <a href="tel:+13078889999">(307) 888-9999</a>
          </Button>
          <Link href={'/registration/player'}>
            <Button className="uppercase font-text border border-customPrimary bg-customPrimary hover:bg-customPrimary/60">register</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="fixed left-0 top-0 z-50 w-full bg-secondary-foreground lg:hidden">
          {/* Top Bar with Logo and Hamburger Menu */}
          <div className="flex items-center justify-between border-b border-customYellow px-4 py-4">
            {/* Logo on the left */}
            <Link href="/" className="flex items-center">
              <Image
                width={200}  
                height={100} 
                src="https://images.ctfassets.net/j2939n6mdbyq/3nVn09ySuMJdpRghyyVqeA/8a0f6cafff701f13c11bcdcb0201f950/modified_logo.png"
                alt="Coal Country Open Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Hamburger Menu on the right */}
            <Button
              className="p-2 text-white"
              onClick={() => setOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div
            className={`
              absolute left-0 top-[81px] flex h-[calc(100vh-81px)] w-full flex-col justify-between bg-secondary-foreground px-4 py-6 transition-transform duration-300
              ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {/* Navigation Links */}
            <nav className="flex flex-col gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-lg font-medium text-white transition-colors hover:text-primary"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Buttons at the bottom */}
            <div className="flex flex-col gap-4">
              {
                <Link href="/registration/player">
                  <Button className="w-full bg-customPrimary" onClick={() => setOpen(false)}>
                    Register
                  </Button>
                </Link>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;