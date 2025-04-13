
'use client'
import { useEffect, useState } from 'react';
import { fetchTournamentCharity, fetchCharityImages } from '@/lib/contentful';
import Image from 'next/image';
import type { Asset } from 'contentful';

type Charity = {
    url: string;
    name: string;
    description: string;
}

type ImageType = Asset;

export default function CharityContent() {
    const [charity, setCharity] = useState<Charity>({url: '', name: '', description: ''})
    const [images, setImages] = useState<ImageType[]>([]);
  useEffect(() => {
    let isMounted = true;

    const loadCharity = async () => {
      try {
        const data = await fetchTournamentCharity();
   
        if (isMounted && data) {
            setCharity(data as Charity);
        }
      } catch (err) {
        console.error('Failed to load sponsors:', err);
      } finally {
      }
    };

    loadCharity();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCharityImages = async () => {
      try {
        const data = await fetchCharityImages();

        if (isMounted && Array.isArray(data)) {
            setImages(data as ImageType[]);
        }
      } catch (err) {
        console.error('Failed to load sponsors:', err);
      } finally {
      }
    };

    loadCharityImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto pt-6">

      {/* Registration Includes Section */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mt-4">GIVING BACK TO OUR COMMUNITY:</h3>
        <p className="text-white/60 list-disc mt-2 space-y-1 text-lg">Each year, a portion of the proceeds from the Coal Country Open goes directly to supporting a charitable organization making a difference in our community.

        We’re proud to partner with <a className="text-blue-600 underline text-link hover:opacity-80" target="_blank" href={charity.url}>{charity.name}</a>, an organization dedicated to {charity.description} Through the generosity of our players, sponsors, 
        and supporters, the tournament is able to contribute to meaningful causes that align with the spirit of the event—community, compassion, and camaraderie.
        </p>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>


      {images.map((img: ImageType, index) => (
        <div key={index} className="col-span-full max-w-[800px] ml-auto mr-auto mb-8 relative w-full">
            <Image
            src={`https:${img.fields?.file?.url ?? ''}?w=1200&fm=webp&q=70`}
            alt={`Flyer Image ${index + 1}`}
            width={600}
            height={1584}
            className="w-full h-auto rounded-lg shadow-md"
            priority={index === 0} 
            />
        </div>
        ))}


      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

    </div>
  );
}