'use client';

import { useState, useEffect, useRef } from "react";

export default function CountdownTimer({ eventDate }: { eventDate: string }) {
  const [isFixed, setIsFixed] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLDivElement>(null);

  const calculateTimeLeft = () => {
    const difference = +new Date(eventDate) - +new Date();
    return difference > 0
      ? {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        }
      : { days: 0, hours: 0, minutes: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!timerRef.current || !stopRef.current) return;

      const stopRect = stopRef.current.getBoundingClientRect();
      const timerRect = timerRef.current.getBoundingClientRect();

      if (stopRect.top <= 120) {
        // Timer reaches the "Coal Country Open" heading - Stop scrolling
        setIsFixed(false);
        setIsStopped(true);
      } else if (window.scrollY < stopRef.current.offsetTop - 200) {
        // Scroll back up - Resume fixed position
        setIsFixed(true);
        setIsStopped(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    {/* Timer Wrapper - Ensures it starts in the hero section */}
    <div id="timer-wrapper" className="relative max-w-[1200px] mr-auto ml-auto flex flex-row justify-end items-center">
      <div
        ref={timerRef}
        className={`${
          isStopped
            ? "absolute top-[100px]" // Stop at the heading
            : isFixed
            ? "fixed top-[15vh]" // Start fixed in hero section
            : ""
        } z-20 bg-customInputFill text-white px-8 py-6 rounded-xl shadow-2xl text-center transition-all duration-300`}
      >
        <div className="flex justify-center space-x-4 text-8xl">
          <div>
            <span className="font-heading drop-shadow-custom-600">
              {String(timeLeft.days || "00").padStart(2, '0')}
            </span>
            <div className="text-2xl font-heading drop-shadow-custom-600">DAYS</div>
          </div>
          <span>:</span>
          <div>
            <span className="font-heading drop-shadow-custom-600">
              {String(timeLeft.hours || "00").padStart(2, '0')}
            </span>
            <div className="text-2xl font-heading drop-shadow-custom-600">HOURS</div>
          </div>
          <span>:</span>
          <div>
            <span className="font-heading drop-shadow-custom-600">
              {String(timeLeft.minutes || "00").padStart(2, '0')}
            </span>
            <div className="text-2xl font-heading drop-shadow-custom-600">MINUTES</div>
          </div>
        </div>
        <div className="mt-4 text-2xl font-semibold font-heading">
          <h4 className="drop-shadow-custom-600">MAY 13-15, 2025</h4>
        </div>
      </div>

      {/* Invisible div that acts as the stopping point for the timer */}
      <div ref={stopRef} className="w-full" />
    </div>
    </>
  );
}
