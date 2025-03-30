
'use client'
import { useEffect, useState } from 'react';
import client from "@/lib/contentful";
import Image from 'next/image';
type Sponsor = {
  href?: string;
  source: string;
  alt: string;
  title: string;
};

export default function InformationalContent() {
    const [images, setImages] = useState<string[]>([]);
    useEffect(() => {
        const fetchFlyerImages = async () => {
          try {
            const res = await client.getEntry('2wH3ArzSvKEIArgjrqd8zR');
            if (res?.fields?.tournamentInformationalFlyers && Array.isArray(res?.fields?.tournamentInformationalFlyers)) {
              const flyerAssets = res?.fields?.tournamentInformationalFlyers
                .map((item) => {
                  if (
                    item &&
                    typeof item === "object" &&
                    "fields" in item &&
                    item.fields?.file?.url
                  ) {
                    return item.fields.file.url;
                  }
                  return null;
                })
                .filter((url): url is string => Boolean(url));
           
              setImages(flyerAssets);
            } else {
              console.warn("flyerImages field is missing or not an array:", res.fields);
              setImages([]);
            }
          } catch (err) {
            console.error("Error fetching informational flyer images from Contentful:", err);
          }
        };
      
        fetchFlyerImages();
      }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto pt-6">

      {/* Registration Includes Section */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mt-4">TOURNAMENT INFORMATION:</h3>
        <ul className="text-white/60 list-disc mt-2 space-y-1 text-lg">
          Below you'll find important tournament information, including event details, schedules, and other helpful materials. 
          If you have any questions, feel free to reach out to the tournament board any time.
        </ul>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>


    {images.map((img, index) => (
        <div key={index} className="col-span-full max-w-[800px] ml-auto mr-auto mb-8 relative w-full">
            <Image
            src={`https:${img}?w=1200&fm=webp&q=70`}
            alt={`Flyer Image ${index + 1}`}
            width={600}
            height={1584}
            className="w-full h-auto rounded-lg shadow-md"
            priority={index === 0} // only preload the first
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