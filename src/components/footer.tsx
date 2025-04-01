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
            <div className="w-full max-w-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEmail();
                }}
                className="flex overflow-hidden rounded-md"              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-none border-none bg-white px-4 py-2 text-black placeholder-gray-500 focus:outline-none"
                  value={email}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  className="border border-customPrimary rounded-none bg-customPrimary px-4 text-white hover:bg-customPrimary/70 uppercase tracking-wide"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-2">About</h3>
            <ul className="space-y-2">
              <li><SmartLink href="/registration/player" className="hover:text-gray-400">Register</SmartLink></li>
              <li><SmartLink href="/registration/sponsor" className="hover:text-gray-400">Sponsors</SmartLink></li>
              <li><SmartLink href="/tournament/information" className="hover:text-gray-400">Information</SmartLink></li>
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
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-customInputFill pt-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Coal Country Open. All rights reserved.
      </div>
    </footer>
  );
}
