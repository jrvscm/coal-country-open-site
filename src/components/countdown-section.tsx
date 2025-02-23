import { useEffect, useState } from "react";

const CountdownTimer = ({ eventDate }) => {
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
    }, 60000); // Updates every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-12 text-white text-center">
      {/* Register Today! Heading */}
      <h2 className="text-4xl md:text-5xl font-bold italic text-white drop-shadow-lg transform -rotate-6 mb-6">
        Register Today!
      </h2>

      {/* Countdown Box */}
      <div className="bg-customPrimary/90 border border-white rounded-lg px-8 py-6 inline-block shadow-lg">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
          {/* Countdown Units */}
          {["days", "hours", "minutes"].map((unit) => (
            <div
              key={unit}
              className="flex flex-col items-center justify-center px-6 py-4 border border-white rounded-lg"
            >
              <span className="text-5xl font-bold">{timeLeft[unit] || "0"}</span>
              <span className="uppercase text-sm mt-2">{unit}</span>
            </div>
          ))}
        </div>

        {/* Event Date */}
        <p className="text-2xl font-bold mt-6">May 13-15, 2025</p>
      </div>
    </section>
  );
};

export default function CountdownSection() {
  return <CountdownTimer eventDate="2025-05-13T09:00:00" />;
}
