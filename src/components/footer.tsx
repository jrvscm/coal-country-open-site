"use client"
// import Link from 'next/link';
import SmartLink from '@/components/smart-link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  
  const handleEmail = () => {
    setEmail('')
  }
  return (
    <footer className="bg-customBackground text-white pb-6 pt-6 md:p-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Newsletter */}
          <div className="order-last col-span-full xl:order-none xl:col-span-2">
            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
            <p className="text-sm mb-4">Sign up for our newsletter<br />to stay up to date.</p>
            <div className="flex flex-col md:flex-row gap-2 md:max-w-[300px]">
              <Input
                type="email"
                placeholder="example@example.com"
                className="bg-white text-black focus:outline-none"
                value={email}
                onChange={handleChange}
              />
              <Button onClick={handleEmail} variant="default" className="px-2 border border-customPrimary bg-customPrimary hover:bg-customPrimary/60 uppercase">
                Submit
              </Button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-2">About</h3>
            <ul className="space-y-2">
              <li><SmartLink href="/registration/player" className="hover:text-gray-400">Register</SmartLink></li>
              <li><SmartLink href="/registration/sponsor" className="hover:text-gray-400">Sponsors</SmartLink></li>
              <li><SmartLink href="/rules" className="hover:text-gray-400">Rules</SmartLink></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <ul className="space-y-2">
              <li><a href="https://www.tiktok.com/@coal.country.open" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">TikTok</a></li>
              <li><a href="https://www.facebook.com/p/Coal-Country-Open-100057272935201/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Facebook</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-2">Contact</h3>
            <ul className="space-y-2">
              <li><a href="mailto:coalcountryopen@gmail.com" className="hover:text-gray-400">coalcountryopen@gmail.com</a></li>
              <li><a href="tel:+13078889999" className="hover:text-gray-400">+1 307-888-9999</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
