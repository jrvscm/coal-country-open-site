"use client";

import { useEffect, useState } from 'react';
import { fetchSchedule } from '@/lib/contentful';

type ScheduleItem = {
  event: string;
  time: string;
};

type EventType = {
  date: string;
  schedule: ScheduleItem[];
};

export default function Schedule() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const data = await fetchSchedule();
  
        if (Array.isArray(data)) {
          const formattedEvents: EventType[] = data
            .map((item) => {
              if (
                typeof item === "object" &&
                item !== null &&
                "date" in item &&
                "schedule" in item &&
                typeof item.date === "string" &&
                Array.isArray(item.schedule)
              ) {
                return {
                  date: item.date,
                  schedule: item.schedule
                    .filter(
                      (scheduleItem) =>
                        typeof scheduleItem === "object" &&
                        scheduleItem !== null &&
                        "event" in scheduleItem &&
                        "time" in scheduleItem &&
                        typeof scheduleItem.event === "string" &&
                        typeof scheduleItem.time === "string"
                    )
                    .map((scheduleItem) => ({
                      event: scheduleItem.event,
                      time: scheduleItem.time,
                    })),
                };
              }
              return null; // Remove invalid items
            })
            .filter((item): item is EventType => item !== null); // ✅ Remove null values safely
  
          setEvents(formattedEvents);
        } else {
          console.error("Unexpected data format from fetchSchedule:", data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setEvents([]);
      }
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
