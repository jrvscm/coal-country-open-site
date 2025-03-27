'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaTiktok, FaFacebookF } from "react-icons/fa";
import Image from "next/image";
// import Link from "next/link";
import SmartLink from '@/components/smart-link';
import client from "@/lib/contentful";
import Schedule from '@/components/schedule';
import CountdownSection from '@/components/countdown-section';
import { Asset } from 'contentful';

export default function Hero() {
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  type SponsorData = {
    logo: string | null;
    url?: string;
    name?: string;
  };

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [sponsor, setSponsor] = useState<SponsorData | null>(null);

    // Fetch images from Contentful
    useEffect(() => {
      const fetchImages = async () => {
        try {
          const res = await client.getEntries({
            content_type: "homePageHeroCarousel",
          });
      
          if (res?.items?.length) {
            const imagesArray = res.items[0]?.fields?.homePageHeroImages;
      
            // Ensure imagesArray is an array before proceeding
            if (Array.isArray(imagesArray)) {
              const assets = imagesArray
                .map((item) => {
                  if (
                    item &&
                    typeof item === "object" &&
                    "fields" in item &&
                    item.fields &&
                    typeof item.fields === "object" &&
                    "file" in item.fields &&
                    item.fields.file &&
                    typeof item.fields.file === "object" &&
                    "url" in item.fields.file &&
                    typeof item.fields.file.url === "string"
                  ) {
                    return item.fields.file.url;
                  }
                  return null;
                })
                .filter((url): url is string => Boolean(url)); // Ensure valid URLs only
      
              setImages(assets);
            } else {
              console.warn("homePageHeroImages is not an array:", imagesArray);
              setImages([]); // Fallback to empty array if data is incorrect
            }
          }
        } catch (err) {
          console.error("Error fetching Contentful images:", err);
        }
      };
      
      fetchImages();                
    }, []);

    // Fetch Website Sponsor
    useEffect(() => {
      const fetchSponsor = async () => {
        try {
          const res = await client.getEntries({
            content_type: "websiteSponsor",
            limit: 1, // Only one sponsor
          });
      
          if (res?.items?.length) {
            const sponsorData = res.items[0].fields;
      
            // Ensure sponsorLogo is treated as a Contentful Asset before accessing fields
            const sponsorLogoAsset = sponsorData?.sponsorLogo as Asset | undefined;
      
            const sponsorLogo = sponsorLogoAsset?.fields?.file?.url;
            const sponsorLink = typeof sponsorData?.sponsorLink === "string" ? sponsorData.sponsorLink : undefined;
            const sponsorName = typeof sponsorData?.sponsorName === "string" ? sponsorData.sponsorName : undefined;
      
            setSponsor({
              logo: sponsorLogo ? `https:${sponsorLogo}` : null,
              url: sponsorLink, // Now guaranteed to be string | undefined
              name: sponsorName, // Now guaranteed to be string | undefined
            });
          }
        } catch (err) {
          console.error("Error fetching website sponsor:", err);
        }
      };
      
      fetchSponsor();         
    }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);
  if (!hasMounted) return null;
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Images with Fade Transition */}
        {hasMounted && images.map((img, index) => (
          <Image
            key={index}
            src={`https:${img}`} 
            alt={`Slide ${index + 1}`}
            fill={true}
            className={`object-cover absolute transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />


        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 p-4 md:p-0">
          <div className="bg-customBackground/95 rounded-lg px-6 py-10 md:px-16 md:py-16 w-full md:w-auto relative shadow-2xl box-border">
          <div className="relative inline-block text-center">
            <h2 className="absolute -rotate-[25deg] left-[-1rem] top-[-1rem] text-lg italic text-customYellow">
              The
            </h2>
            <h1 className="text-5xl md:text-7xl font-heading drop-shadow-custom-600 tracking-tight text-white">
              Coal Country Open
            </h1>
          </div>
            <div className="flex mt-2 flex-row items-center justify-center">
              <Button asChild variant="default" className="p-0 md:p-6 mr-[1rem] border border-customPrimary w-[132px] md:w-full bg-customPrimary hover:bg-customPrimary/60 uppercase">
                <SmartLink className="m-0 text-lg md:text-xl font-text" href="/registration/player">Register</SmartLink>
              </Button>
              <Button asChild variant="default" className="p-0 md:p-6 bg-transparent w-[132px] md:w-full text-customYellow hover:bg-customYellow/60 hover:text-white border border-customYellow uppercase">
                <SmartLink className="m-0 text-lg md:text-xl font-text" href="/registration/sponsor">Sponsors</SmartLink>
              </Button>
            </div>

            {/* Website Sponsor Section */}
            {sponsor?.url && sponsor?.logo && sponsor?.name ? (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-300">Brought To You By</p>
                <SmartLink href={sponsor.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={200}
                    height={100}
                    className="mx-auto h-auto object-contain"
                  />
                </SmartLink>
              </div>
            ) : <></>}
          </div>
        </div>

        {/* Sidebar Share Buttons */}
        <div className="absolute right-4 bottom-[80px] flex flex-col space-y-4 z-20">
          <SmartLink href="https://www.facebook.com/p/Coal-Country-Open-100057272935201/" target="_blank" className="bg-customBackground p-2 rounded-full hover:shadow-2xl hover:opacity-90 transition-all duration-200 hover border border-customBackground hover:border-customYellow">
            <FaFacebookF className="h-6 w-6 text-customYellow" />
          </SmartLink>
          <SmartLink href="https://www.tiktok.com/@coal.country.open" target="_blank" className="bg-customBackground p-2 rounded-full hover:shadow-2xl hover:opacity-90 transition-all duration-200 border border-customBackground hover:border-customYellow">
            <FaTiktok className="h-6 w-6 text-customYellow" />
          </SmartLink>
        </div>
      </div>
      <Schedule />
      <CountdownSection />
    </>
  );
}
