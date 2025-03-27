
'use client'
import { useEffect, useState } from 'react';
import { fetchSponsors } from '@/lib/contentful';
import Image from 'next/image';
type Sponsor = {
  href?: string;
  source: string;
  alt: string;
  title: string;
};

export default function SponsorContent() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  useEffect(() => {
    let isMounted = true;

    const loadSponsors = async () => {
      try {
        const data = await fetchSponsors();
        
        if (isMounted && Array.isArray(data)) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto pt-6">

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
          <div className="bg-white/10 p-4 flex items-center justify-center h-[120px] w-full rounded-lg border border-white/10">
            <a href={sponsor.href} key={`sponsor-${sponsor?.title?.replace(' ', '')}-${index}`}>
              <Image
                src={`https://${sponsor?.source}`}
                alt={sponsor?.title}
                width={200}
                height={100}
                className="max-h-[100px] max-w-[170px] object-contain transition cursor-pointer"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

    </div>
  );
}