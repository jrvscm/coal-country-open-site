"use client";

import { useEffect, useState } from 'react';
import { fetchSchedule } from '@/lib/contentful';

export default function Schedule() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getSchedule = async () => {
      const data = await fetchSchedule();
      setEvents(data);
    };
    getSchedule();
  }, []);

  if (!events.length) {
    return <p className="text-center text-white">Loading Schedule...</p>;
  }

  return (
    <section className="bg-customBackground text-white py-10 shadow-lg">
      <h2 className="text-center text-xl md:text-2xl font-heading uppercase mb-6 drop-shadow-custom-600">
        Schedule of Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-[1rem] md:px-[12rem]">
        {events.map((day, index) => (
          <div key={index} className="bg-customBackground p-4 rounded-md">
            <h3 className="text-customYellow uppercase text-sm mb-4">{day.date}</h3>
            <ul className="space-y-2">
              {day.schedule.map((item, idx) => (
                <li key={idx} className="flex justify-between border-b border-gray-600 pb-1">
                  <span className="font-medium">{item.event}</span>
                  <span className="font-semibold">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
