
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
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mt-4">TO OUR SPONSORS:</h3>
        <ul className="text-white/60 list-disc mt-2 space-y-1 text-lg">
          We would like to extend our heartfelt thanks to all of our incredible 
          sponsors and suppliers for their generous support of the Coal Country Open. 
          Your contributions — from beverages and food to door prizes, flag prizes and countless 
          behind-the-scenes essentials — play a vital role in making this tournament possible.<br /><br/>
          
          Your partnership and generosity not only enhance the experience for every involved, 
          but also helps us build a truly memorable event year after year. Thank you for being 
          such an important part of this event!
        </ul>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
        {sponsors.map((sponsor: Sponsor, index: number) => (
          <div key={`sponsor-${index}`} className="bg-white/10 p-4 flex items-center justify-center h-[120px] w-full rounded-lg border border-white/10">
            <a href={sponsor.href} key={`sponsor-${sponsor?.title?.replace(' ', '')}-${index}`}>
              <Image
                src={sponsor.source}
                alt={sponsor.title}
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