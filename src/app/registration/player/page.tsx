'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import CountdownTimer from '@/components/countdown-timer';
import RegistrationForm from '@/components/registration-form';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const [registrationCount, setRegistrationCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch('/api/registration/players-count');
        const data = await response.json();
        setRegistrationCount(data.count ?? null); // Ensure 0 updates UI
      } catch (error) {
        console.error('Error fetching registration count:', error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleScrollDown = () => {
    document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src={`https://images.ctfassets.net/j2939n6mdbyq/3i6cXbMjJ1sXUGoYWdcAXk/9a32c4601e5e33006be9b7c9d60a608b/CCO24-462.jpg`}
          alt={`Players on a golf green smiling`}
          layout="fill"
          objectFit="cover"
          className="absolute"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Hero Content */}
        <div className="relative inset-0 flex flex-col justify-center items-center text-center text-white z-20 p-4 md:p-0">
          <h2 className="absolute top-[15vh] left-6 md:top-[20vh] md:left-[12vw] font-marker drop-shadow-custom-600 text-3xl md:text-6xl font-bold italic transform -rotate-6 z-30">
            Register Today!<br/>
            {/* Dynamic Registration Count */}
            {registrationCount !== null && (
              <span className="text-xl md:text-4xl"><span className="font-heading">{registrationCount}</span> already registered!</span>
            )}
          </h2>
        </div>
      </div>

      <CountdownTimer eventDate="2025-05-13T09:00:00" />

      {/* Registration Section */}
      <div id="registration-section" className="w-full h-full bg-customBackground relative pt-32 pb-8 pr-[1rem] pl-[1rem] md:pr-0 md:pl-0">
        <div className="relative max-w-[1200px] m-auto">
          {/* Stopping Point Reference for Timer */}
          <div id="registration-heading" className="relative">
            <h2 className="absolute -rotate-[25deg] left-[0rem] top-[-1rem] md:left-[-1rem] text-lg italic text-customYellow">
              The
            </h2>
            <h1 className="ml-[1rem] md:ml-[0rem] text-5xl md:text-7xl font-heading drop-shadow-custom-600 tracking-tight text-white">
              Coal Country Open
            </h1>
          </div>
        </div>
        <RegistrationForm />
      </div>

      {/* Scroll Indicator - Only visible on desktop */}
      <div className="hidden md:flex flex-col items-center absolute bottom-[10vh] left-[12vw] z-20 cursor-pointer"
           onClick={handleScrollDown}
      >
        {/* Animated Arrow */}
        <div className="animate-bounce hover:opacity-70 rounded-[100%] hover:shadow-[0px_10px_30px_rgba(255,255,255,0.5)] transition-opacity transition-duration-300">
          <ArrowDown className="h-16 w-16 text-white" />
        </div>
      </div>
    </>
  );
}
