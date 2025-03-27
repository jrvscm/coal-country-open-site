'use client';

import Image from "next/image";
import CountdownTimer from '@/components/countdown-timer';
import SponsorContent from '@/components/sponsor-content';
import { ArrowDown } from 'lucide-react';
import { useTournamentDate } from '@/context/TournamentDateContext';
import { formatTournamentDate } from '@/lib/utils';

export default function Hero() {
  const tournamentDate = useTournamentDate();

  const handleScrollDown = () => {
    document.getElementById('sponsors-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src={`https://downloads.ctfassets.net/j2939n6mdbyq/7HxRCz9nIWxUSkszQlIplN/528be1739be8f4b5c65f30102e2af61b/CCO24-071.jpg`}
          alt={`Golf carts parked at a teebox.`}
          fill={true}
          priority={true}
          quality={70}
          className="object-cover absolute"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Hero Content */}
        <div className="relative inset-0 flex flex-col justify-center items-center text-center text-white z-20 p-4 md:p-0">
          <h2 className="absolute top-[15vh] left-6 md:top-[20vh] md:left-[12vw] font-marker drop-shadow-custom-600 text-3xl md:text-6xl font-bold italic transform -rotate-6 z-30">
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
