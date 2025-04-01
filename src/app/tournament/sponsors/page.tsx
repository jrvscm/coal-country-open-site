'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import CountdownTimer from '@/components/countdown-timer';
import SponsorContent from '@/components/sponsor-content';
import { ArrowDown } from 'lucide-react';
import { useTournamentDate } from '@/context/TournamentDateContext';
import { formatTournamentDate } from '@/lib/utils';
// import { usePageReady } from '@/hooks/usePageReady';

export default function Hero() {
  const tournamentDate = useTournamentDate();

  const handleScrollDown = () => {
    document.getElementById('sponsors-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // usePageReady();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded) {
      document.dispatchEvent(new Event('page-ready'));
    }
  }, [imageLoaded]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src={`https://images.ctfassets.net/j2939n6mdbyq/1ufdIvoLVzqe1PlBWbYSfM/df15a3c83bd0109afa82e239d28dee0b/CCO24-071__1___1_.jpg?w=1600&fm=webp&q=70`}
          alt={`Golf carts parked at a teebox.`}
          fill={true}
          priority={true}
          quality={70}
          className="object-cover absolute"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Hero Content */}
        <div className="relative inset-0 flex flex-col justify-center items-center text-center text-white z-20 p-4 md:p-0">
          <h2 className="
              absolute 
              left-1/2 -translate-x-1/2 
              top-[25vh]
              w-full max-w-[320px] 
              md:left-[12vw] md:translate-x-0 md:max-w-none md:w-auto
              font-marker drop-shadow-custom-600 
              text-3xl md:text-6xl 
              font-bold italic 
              transform -rotate-6 
              z-30
            ">
            A Huge Thank You<br/>
            To Our Sponsors!!
          </h2>
        </div>
      </div>

      {tournamentDate && <CountdownTimer eventDate={formatTournamentDate(tournamentDate)} />}

      {/* Registration Section */}
      <div id="sponsors-section" className="w-full h-full bg-customBackground relative pt-32 pb-8 pr-[1rem] pl-[1rem] md:pr-0 md:pl-0">
        <div className="relative max-w-[1200px] m-auto">
          {/* Stopping Point Reference for Timer */}
          <div id="registration-heading" className="pl-[.5rem] relative">
            <h2 className="absolute -rotate-[25deg] left-[-.5rem] top-[-1rem] text-lg italic text-customYellow">
              The
            </h2>
            <h1 className="text-5xl md:text-7xl font-heading drop-shadow-custom-600 tracking-tight text-white">
              Coal Country Open
            </h1>
            <h2 className=" text-lg italic text-customYellow">
              Our sponsors that make it all possible!
            </h2>
          </div>
        </div>
        <SponsorContent />
      </div>

      {/* Scroll Indicator - Only visible on desktop */}
      <div className="hidden md:flex flex-col items-center absolute bottom-[10vh] left-[12vw] z-20 cursor-pointer"
           onClick={handleScrollDown}
      >
        {/* Animated Arrow */}
        <div className="animate-bounce hover:opacity-70 rounded-[100%] shadow-[0px_10px_30px_rgba(255,255,255,0.7)] transition-opacity transition-duration-300 cursor-pointer">
          <ArrowDown className="h-16 w-16 text-white" />
        </div>
      </div>
    </>
  );
}
