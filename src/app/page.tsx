import { Button } from "@/components/ui/button";
import { FaTiktok, FaInstagram, FaFacebookF } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="https://images.ctfassets.net/j2939n6mdbyq/7422YB3HKAACYqDCfrhoC8/25336bf54c00215a400a542be9de9cbe/CCO24-418.jpg"
        alt="Coal Country Open Hero"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-0 py-4 z-30">
        <Link href="/">
          <Image src="https://images.ctfassets.net/j2939n6mdbyq/3nVn09ySuMJdpRghyyVqeA/8a0f6cafff701f13c11bcdcb0201f950/modified_logo.png" alt="Tournament Logo" width={150} height={75} />
        </Link>
        <ul className="hidden md:flex space-x-8 text-white uppercase mr-[40px]">
          <li><Link href="/about" className="font-text hover:text-customYellow/90 transition-colors duration-300 cursor-pointer">About</Link></li>
          <li><Link href="/rules" className="font-text hover:text-customYellow/90 transition-colors duration-300 cursor-pointer">Rules</Link></li>
          <li><Link href="/register" className="font-text hover:text-customYellow/90 transition-colors duration-300 cursor-pointer">Register</Link></li>
          <li ><Link href="/sponsors" className="font-text hover:text-customYellow/90 transition-colors duration-300 cursor-pointer">Sponsors</Link></li>
        </ul>
        {/* Mobile Menu (Placeholder for now) */}
        <div className="md:hidden text-white">Menu</div>
      </nav>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 p-4 md:p-0">
      <div className="
        bg-customBackground/95 rounded-lg 
        px-6 py-10 md:px-16 md:py-16 w-full md:w-auto
        relative shadow-2xl
        box-border
      ">
          <h2 className="absolute -rotate-[25deg] left-[2rem] md:left-[3rem] top-[1rem] md:top-[2.75rem] text-lg italic text-customYellow">The</h2>
          <h1 className="text-5xl md:text-7xl font-heading drop-shadow-custom-600 tracking-tight">Coal Country Open</h1>
          <div className="flex mt-2 flex-row items-center justify-center">
            <Button asChild variant="default" className="
              p-0 md:p-6 mr-[1rem]
              border border-customPrimary w-full
              bg-customPrimary hover:bg-customPrimary/60
              uppercase
              ">
              <Link className="m-0 text-lg md:text-xl font-text" href="/register">Register</Link>
            </Button>
            <Button asChild variant="default" className="
              p-0 md:p-6
              bg-transparent w-full
              text-customYellow hover:bg-customYellow/60 hover:text-white 
              border border-customYellow
              uppercase 
              ">
              <Link className="m-0 text-lg md:text-xl font-text" href="/sponsors">Sponsors</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar Share Buttons */}
      <div className="absolute right-4 bottom-[80px] flex flex-col space-y-4 z-20">
        <Link href="https://twitter.com" target="_blank" className="bg-customBackground p-2 rounded-full hover:shadow-2xl hover:opacity-90 transition-all duration-300">
          <FaFacebookF className="h-6 w-6 text-customYellow" />
        </Link>
        <Link href="https://instagram.com" target="_blank" className="bg-customBackground p-2 rounded-full hover:shadow-2xl hover:opacity-90 transition-all duration-300">
          <FaInstagram className="h-6 w-6 text-customYellow" />
        </Link>
        <Link href="https://linkedin.com" target="_blank" className="bg-customBackground p-2 rounded-full hover:shadow-2xl hover:opacity-90 transition-all duration-300">
          <FaTiktok className="h-6 w-6 text-customYellow" />
        </Link>
      </div>
    </div>
  );
}
