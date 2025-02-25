'use client';

import { useState, useEffect } from "react";

export default function CountdownTimer({ eventDate }: { eventDate: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(eventDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Updates every second

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute right-4 top-4 md:static md:mx-auto md:mt-4 bg-customInputFill text-white px-8 py-6 rounded-xl shadow-2xl text-center">
      <div className="flex justify-center md:justify-center space-x-4 text-8xl font-bold">
        <div>
          <span className="font-heading drop-shadow-custom-600">{String(timeLeft.days || "00").padStart(2, '0')}</span>
          <div className="text-2xl font-heading drop-shadow-custom-600">DAYS</div>
        </div>
        <span>:</span>
        <div>
          <span className="font-heading drop-shadow-custom-600">{String(timeLeft.hours || "00").padStart(2, '0')}</span>
          <div className="text-2xl font-heading drop-shadow-custom-600">HOURS</div>
        </div>
        <span>:</span>
        <div>
          <span className="font-heading drop-shadow-custom-600">{String(timeLeft.minutes || "00").padStart(2, '0')}</span>
          <div className="text-2xl font-heading drop-shadow-custom-600">MINUTES</div>
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold font-heading">
        <h4 className="drop-shadow-custom-600">MAY 13-15, 2025</h4>
      </div>
    </div>
  );
}
