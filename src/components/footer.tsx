"use client"
import SmartLink from '@/components/smart-link';
import '@/styles/splash.css';

export default function Footer() {
  return (
    <footer className="bg-customBackground text-white pb-6 pt-6 md:p-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Same typographic lockup as splash screen (scaled for footer) */}
          <div className="order-last col-span-full flex items-center justify-center xl:order-none xl:col-span-2 xl:justify-start">
            <SmartLink
              href="/"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-customYellow rounded"
            >
              <div className="relative px-4 py-2 text-center">
                <h2 className="absolute -rotate-[25deg] left-[-0.25rem] top-[-0.25rem] text-sm italic text-customYellow md:text-base md:left-[-0.5rem] md:top-[-0.5rem]">
                  The
                </h2>
                <h1 className="font-heading text-4xl tracking-tight text-white drop-shadow-custom-600 animate-glow md:text-5xl">
                  Coal Country Open
                </h1>
              </div>
            </SmartLink>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-2">About</h3>
            <ul className="space-y-2">
              <li><SmartLink href="/registration/player" className="hover:text-gray-400">Register</SmartLink></li>
              <li><SmartLink href="/registration/sponsor" className="hover:text-gray-400">Sponsors</SmartLink></li>
              <li><SmartLink href="/tournament/information" className="hover:text-gray-400">Information</SmartLink></li>
              <li>
                <a
                  href="https://highplainsmedia.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://highplainsmedia.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400"
                >
                  Terms
                </a>
              </li>
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
        © {new Date().getFullYear()} Powered by <a className="text-blue-600 underline hover:opacity-80" href="https://www.highplainsmedia.com" target="_blank" rel="noopener noreferrer">High Plains Media</a>. All rights reserved.
      </div>
    </footer>
  );
}
