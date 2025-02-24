import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";

const CountdownTimer = ({ eventDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(eventDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
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

  const timeUnits = ["days", "hours", "minutes", "seconds"];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src={`https://images.ctfassets.net/j2939n6mdbyq/3PMA6TdlWeRokSvdLbFFMZ/347925bd4ef40e7b665d8c990fd955f0/CCO24-395.jpg`}
        alt={`Golf carts parked in a line`}
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content Wrapper */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        {/* Register Today! Heading */}
        <h2 className="hidden md:block absolute top-[110px] md:top-[100px] left-[16px] md:left-[150px] font-marker drop-shadow-2xl text-4xl md:text-5xl font-bold italic transform -rotate-6 mb-16">
          Register Today!
        </h2>

        {/* Countdown Box */}
        <div className="bg-gradient-to-br from-customPrimary/90 to-customPrimary/50 backdrop-blur-xl border rounded-lg px-8 md:px-[8rem] py-8 md:py-[6rem] shadow-2xl min-w-full mr-auto ml-auto md:mr-0 md:ml-0 md:min-w-[unset]"> 
          <h2 className="block md:hidden font-marker drop-shadow-2xl text-4xl md:text-5xl font-bold italic -rotate-6 mb-16 mt-6">
            Register Today!
          </h2>
          <div className="grid grid-cols-2 gap-4 md:gap-0 md:flex md:justify-center md:items-center">
            {/* Countdown Units */}
            {timeUnits.map((unit, index) => (
              <div key={unit} className="flex items-center">
                <div style={{
                  background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))",
                  backdropFilter: "blur(4px)",
                }} className="w-full flex flex-col items-center justify-center px-[2rem] py-[3rem] rounded-lg shadow-2xl">
                  <span className="font-heading text-5xl md:text-7xl font-bold drop-shadow-2xl">
                    {timeLeft[unit] !== undefined ? timeLeft[unit].toString().padStart(2, "0") : "00"}
                  </span>
                  <span className="font-heading uppercase text-xl md:text-2xl mt-2 drop-shadow-2xl">{unit}</span>
                </div>

                {/* Semicolon only on md+ screens */}
                {index < timeUnits.length - 1 && (
                  <span className="hidden md:block text-5xl font-bold mx-2">:</span>
                )}
              </div>
            ))}
          </div>

          {/* Event Date */}
          <p className="font-heading text-3xl md:text-5xl font-bold mt-16 mb-6 md:mb-0 drop-shadow-2xl">May 13-15, 2025</p>
          <Button variant="outline" className="p-0 md:p-6 font-text mt-6 bg-transparent border transition-all border-customYellow hover:bg-customYellow/60 text-customYellow hover:text-white uppercase md:w-[250px] w-full text-lg md:text-xl font-text">
            Register <IoIosArrowRoundForward size={'16px'} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default function CountdownSection() {
  return <CountdownTimer eventDate="2025-05-13T09:00:00" />;
}
