import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-customBackground text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Newsletter */}
          <div className="order-last col-span-full xl:order-none xl:col-span-2">
            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
            <p className="text-sm mb-4">Sign Up For Our Newsletter<br />To Stay Up To Date</p>
            <div className="flex flex-col md:flex-row gap-2 md:max-w-[300px]">
              <Input
                type="email"
                placeholder="example@example.com"
                className="bg-white text-black focus:outline-none"
              />
              <Button variant="default" className="px-2 border border-customPrimary bg-customPrimary hover:bg-customPrimary/60 uppercase">
                Submit
              </Button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-2">About</h3>
            <ul className="space-y-2">
              <li><Link href="/register" className="hover:text-gray-400">Register</Link></li>
              <li><Link href="/sponsors" className="hover:text-gray-400">Sponsors</Link></li>
              <li><Link href="/rules" className="hover:text-gray-400">Rules</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <ul className="space-y-2">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Instagram</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">TikTok</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Facebook</a></li>
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
