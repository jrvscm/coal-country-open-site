'use client'

import Image from "next/image";
import CountdownTimer from '@/components/countdown-timer';
import RegistrationFrom from '@/components/registration-form';

export default function Hero() {
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
          <h2 className="absolute top-[15vh] left-6 md:top-[20vh] md:left-[12vw] font-marker drop-shadow-2xl text-3xl md:text-5xl font-bold italic transform -rotate-6 z-30">
            Register Today!
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
        <RegistrationFrom />
      </div>
    </>
  );
}
