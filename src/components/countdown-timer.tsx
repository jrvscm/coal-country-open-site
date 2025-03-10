'use client';

import { useState, useEffect, useRef, useCallback } from "react";

export default function CountdownTimer({ eventDate }: { eventDate: string }) {
  const [isFixed, setIsFixed] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(eventDate) - +new Date();
    return difference > 0
      ? {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        }
      : { days: 0, hours: 0, minutes: 0 };
  }, [eventDate]); 

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    if (!timerRef.current || !heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    if (rect.top > 500) {
      setIsFixed(true);
      setIsStopped(false);
    } else {
      setIsFixed(false);
      setIsStopped(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top > 500) {
          setIsFixed(false); 
          setIsStopped(true); 
        } else if(!entry.isIntersecting && entry.boundingClientRect.top > 500) {
          setIsFixed(true); 
          setIsStopped(false);
        }
      },
      {
        root: null,
        threshold: 0.5, 
      }
    );

    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Timer Wrapper */}
      <div id="timer-wrapper" className="relative md:max-w-[1200px] mx-auto flex flex-row md:justify-end justify-center px-4">
        <div
          ref={timerRef}
          className={`${
            isStopped
              ? "absolute top-[-120px] md:top-[130px]" // Stop exactly 50px below the hero
              : isFixed
              ? "fixed top-[60vh] left-1/2 transform -translate-x-1/2 md:left-auto md:translate-x-0"
              : ""
          } z-20 bg-customInputFill text-white px-6 md:px-8 py-6 rounded-xl shadow-2xl text-center transition-none`}
        >
          <div className="flex justify-center space-x-4 text-7xl md:text-8xl">
            <div>
              <span className="font-heading drop-shadow-custom-600">
                {String(timeLeft.days || "00").padStart(2, '0')}
              </span>
              <div className="text-xl md:text-2xl font-heading drop-shadow-custom-600">DAYS</div>
            </div>
            <span>:</span>
            <div>
              <span className="font-heading drop-shadow-custom-600">
                {String(timeLeft.hours || "00").padStart(2, '0')}
              </span>
              <div className="text-xl md:text-2xl font-heading drop-shadow-custom-600">HOURS</div>
            </div>
            <span>:</span>
            <div>
              <span className="font-heading drop-shadow-custom-600">
                {String(timeLeft.minutes || "00").padStart(2, '0')}
              </span>
              <div className="text-xl md:text-2xl font-heading drop-shadow-custom-600">MINUTES</div>
            </div>
          </div>
          <div className="mt-4 text-xl md:text-2xl font-semibold font-heading">
            <h4 className="drop-shadow-custom-600">MAY 13-15, 2025</h4>
          </div>
        </div>

        {/* Reference Element for Intersection Observer */}
        <div ref={heroRef} className="absolute bottom-[-220px] md:bottom-[-500px]" />
      </div>
    </>
  );
}
