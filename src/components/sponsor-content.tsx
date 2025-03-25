
'use client'
import { useEffect, useState } from 'react';
import { fetchSponsors } from '@/lib/contentful';
interface Sponsor {
  source: string,
  title: string,
  href: string
}
export default function SponsorContent() {
  const [sponsors, setSponsors] = useState([])
  useEffect(() => {
    let isMounted = true;

    const loadSponsors = async () => {
      try {
        const data = await fetchSponsors();
        
        if (isMounted) {
          setSponsors(data);
        }
      } catch (err) {
        console.error('Failed to load sponsors:', err);
      } finally {
      }
    };

    loadSponsors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">

      {/* Registration Includes Section */}
      <div className="col-span-full">
        <h3 className="text-white/80 text-lg font-semibold mt-4">REGISTRATION INCLUDES:</h3>
        <ul className="text-white/60 list-disc pl-5 mt-2 space-y-1 text-lg">
          <li>54 holes of golf on two courses (cart included)</li>
          <li><span className="font-bold">Premium</span> gift bag</li>
          <li>Thursday night social and Saturday banquet at Gillette&apos;s Camplex</li>
          <li>Flag prizes are awarded for each day</li>
          <li>A Calcutta will take place Friday evening</li>
        </ul>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
        {sponsors.map((sponsor: Sponsor, index: number) => (
          <a href={sponsor.href} key={`sponsor-${sponsor?.title?.replace(' ', '')}-${index}`}>
            <img
              src={sponsor?.source}
              alt={sponsor.title}
              className="w-full max-h-24 object-contain transition cursor-pointer"
            />
          </a>
        ))}
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

    </div>
  );
}