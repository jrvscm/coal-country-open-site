'use client';

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { FaLock, FaRegCheckCircle } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import TeamFormFields from '@/components/team-form-fields';
import DefaultFormFields from '@/components/default-form-fields';
import SingleEntryFields from '@/components/single-entry-fields';
import SponsorProductsFields from '@/components/sponsor-products-fields';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTournamentDate } from '@/context/TournamentDateContext';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import GolfersFormFields from '@/components/golfers-form-fields';

export type Golfer = {
  name: string;
  handicap: string;
  tShirtSize: string;
};

export type FormDataType = {
  golfers: Array<Golfer>;
  company: string;
  banquet: string;
  dinnerTickets: string;
  participantType: string;
  doorPrize?: string;
  flagPrizeContribution?: string;
  teamName?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  player1Name?: string;
  player2Name?: string;
  player3Name?: string;
  player1Handicap?: string;
  player2Handicap?: string;
  player3Handicap?: string;
  player1TShirtSize?: string;
  player2TShirtSize?: string;
  player3TShirtSize?: string;
};

export default function RegistrationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationFormContent />
    </Suspense>
  );
}

function RegistrationFormContent() {
  const tournamentStartDate = useTournamentDate();
  const params = useSearchParams();
  const path = usePathname();
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'canceled'>('idle');

  // Pricing for each participant type
  const basePrices = useMemo(() => ({
    currentMiner: 250.0,
    pastBoardPastChampionRetiree: 250.0,
    generalPublic: 450.0,
    //packages
    platinumSponsorship: 5000.0,
    goldSponsorship: 3000.0,
    silverSponsorship: 1500,
    singlePlayerSponsorEntry: 450.0,
    teamSponsorEntry: 1000.0,
    //products
    teeBoxSponsorship: 1250.0,
    drivingRangeSponsorship: 1200.0,
    holeFlagSponsorship: 250.0,
    flagPrizeSponsorship: 150.0
  }), []);

  type FormErrorsType = Partial<Record<keyof FormDataType, string>>;

  const defaultFormState = useMemo<FormDataType>(() => ({
    golfers: Array(3).fill({ name: "", handicap: "", tShirtSize: "" }), 
    company: '',
    handicap: '',
    banquet: '',
    dinnerTickets: '',
    participantType: path.includes('sponsor') ? 'platinumSponsorship' : 'currentMiner',
    doorPrize: '',
    flagPrizeContribution: '',
    teamName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    player1Name: '',
    player2Name: '',
    player3Name: '',
    player1Handicap: '',
    player2Handicap: '',
    player3Handicap: '',
    player1TShirtSize: '',
    player2TShirtSize: '',
    player3TShirtSize: '',
}), []);

  const resetForm = useCallback(() => setFormData(defaultFormState), [defaultFormState]);
  const [formData, setFormData] = useState<FormDataType>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorsType>({} as FormErrorsType);
  const [totalPrice, setTotalPrice] = useState(basePrices[formData.participantType as keyof typeof basePrices]);
  const [stripeFee, setStripeFee] = useState(0);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const handicapRegex = /^[+-]?\d+(\.\d{1,2})?$/;
  const flagPrizeRegex = useMemo(() => (/^\d+$/), [])

  const validateForm = () => {
    const errors: FormErrorsType = {}; 

    if(["flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType)) {
      if(!formData.company) errors.company = "Company is required";
      if (!formData.player1Name) errors.player1Name = "Name is required";
      if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
      if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
    }

    if(formData.participantType !== 'teamSponsorEntry' && !["platinumSponsorship", "goldSponsorship", "silverSponsorship", "flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType)) {
      if (!formData.player1Name) errors.player1Name = "Name is required";
      if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
      if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
      if (!formData.player1Handicap || !handicapRegex.test(formData.player1Handicap)) errors.player1Handicap = "Enter a valid handicap";
      if(!formData.company) errors.company = "Company is required";
      if(!formData.player1TShirtSize) errors.player1TShirtSize = "Shirt size is required";
    }

    if (formData.participantType === "teamSponsorEntry" && !["platinumSponsorship", "goldSponsorship", "silverSponsorship", "flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType)) {
      if (!formData.teamName) errors.teamName = "Team Name is required";
      //player names
      if (!formData.player1Name) errors.player1Name = "Player One Name is required";
      if (!formData.player2Name) errors.player2Name = "Player Two Name is required";
      if (!formData.player3Name) errors.player3Name = "Player Three Name is required";
      //player handicaps
      if (!formData.player1Handicap || !handicapRegex.test(formData.player1Handicap)) errors.player1Handicap = "Player One Handicap is required";
      if (!formData.player2Handicap || !handicapRegex.test(formData.player2Handicap)) errors.player2Handicap = "Player Two Handicap is required";
      if (!formData.player3Handicap || !handicapRegex.test(formData.player3Handicap)) errors.player3Handicap = "Player Three Handicap is required";
      //player shirt size
      if (!formData.player1TShirtSize) errors.player1TShirtSize = "Player One T-Shirt size is required";
      if (!formData.player2TShirtSize) errors.player2TShirtSize = "Player Two T-Shirt size is required";
      if (!formData.player3TShirtSize) errors.player3TShirtSize = "Player Three T-Shirt size is required";
      //team contact
      if (!formData.contactName) errors.contactName = "Team contact name is required";
      if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Contact phone is invalid";
      if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Contact email is invalid";
    }

    if(["platinumSponsorship", "goldSponsorship", "silverSponsorship"].includes(formData.participantType)) {
      //team contact 
      if (!formData.company) errors.company = "Company is required";
      if (!formData.contactName) errors.contactName = "Team contact name is required";
      if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Team contact phone is invalid";
      if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Team contact email is invalid";

      // Validate golfers dynamically
      formData.golfers.forEach((golfer, index) => {
        if (!golfer.name) errors[`golfers.${index}.name`] = `Player ${index + 1} Name is required`;
        if (!golfer.handicap || (!handicapRegex.test(golfer.handicap) && golfer.handicap.toString().toLowerCase() !== 'placeholder')) {
          errors[`golfers.${index}.handicap`] = `Player ${index + 1} Handicap is required`;
        }        if (!golfer.tShirtSize) errors[`golfers.${index}.tShirtSize`] = `Player ${index + 1} T-Shirt Size is required`;
      });
    }

    if(!formData.banquet && !["flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType)) errors.banquet = "Banquet choice is required";

    if(formData.participantType === 'singlePlayerSponsorEntry') {
      if(!formData.doorPrize) errors.doorPrize = "Door prize contribution is required"
    }
    
    if(formData.participantType === 'singlePlayerSponsorEntry' || ["platinumSponsorship", "goldSponsorship", "silverSponsorship", "flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType)) {
      if(formData.flagPrizeContribution && !flagPrizeRegex.test(formData.flagPrizeContribution)) errors.flagPrizeContribution = "Use only whole numbers and no decimals"
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      // If the participant type changes, reset the form while keeping the new participant type
      if (name === 'participantType') {
        setFormData({
          ...defaultFormState,
          participantType: value,
          golfers: Array(2).fill({ name: "", handicap: "", tShirtSize: "" }) // Always reset to 2 golfers
        });
      
        setFormErrors({});
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Remove only the error related to the current field
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    }
  };

  const handleSelectChange = (name: keyof FormDataType | string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Remove only the error related to the current field
    setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
    }));
  };

  // Pricing breakdown states
  const [basePrice, setBasePrice] = useState(0);
  const [dinnerTicketCost, setDinnerTicketCost] = useState(0);
  const [flagPrizeCost, setFlagPrizeCost] = useState(0);

  useEffect(() => {
    const newBasePrice = basePrices[formData.participantType as keyof typeof basePrices] || 0;
    let newDinnerTicketCost = 0;
    let newFlagPrizeCost = 0;
  
    if (formData.dinnerTickets !== '') {
        newDinnerTicketCost = parseInt(formData.dinnerTickets, 10) * 32.0;
    }

    if (formData.flagPrizeContribution && flagPrizeRegex.test(formData.flagPrizeContribution)) {
        newFlagPrizeCost = parseInt(formData.flagPrizeContribution, 10);
    }

    const newTotal = newBasePrice + newDinnerTicketCost + newFlagPrizeCost;
    const newStripeFee = (newTotal * 0.029) + 0.30;
  
    // Update state
    setBasePrice(newBasePrice);
    setDinnerTicketCost(newDinnerTicketCost);
    setFlagPrizeCost(newFlagPrizeCost);
    setTotalPrice(newTotal);
    setStripeFee(newStripeFee);
  }, [basePrices, flagPrizeRegex, formData.participantType, formData.dinnerTickets, formData.flagPrizeContribution]);

  const totalRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top <= 0);
      },
      { root: null, threshold: 0 }
    );
  
    const currentRef = totalRef.current;
  
    if (currentRef instanceof HTMLElement) {
      observer.observe(currentRef);
  
      const rect = currentRef.getBoundingClientRect();
      setIsSticky(rect.top <= 0);
    }
  
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [totalRef]); 
  
  //stripe 
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  
  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const maxGolfers = formData.participantType === "platinumSponsorship" ? 10 :
                   formData.participantType === "goldSponsorship" ? 5 :
                   formData.participantType === "silverSponsorship" ? 2 : 0;

    let adjustedFormData = { ...formData };
    if(["flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType)) {
      adjustedFormData.contactName = formData.player1Name;
      adjustedFormData.player1Name = "";
    }

    try {
      const formattedFormData = {
        ...adjustedFormData,
        ...Object.fromEntries(
          Array.from({ length: maxGolfers }, (_, i) => {
            const golfer = formData.golfers[i] || { name: "", handicap: "", tShirtSize: "" };
            return [
              [`player${i + 1}Name`, golfer.name],
              [`player${i + 1}Handicap`, golfer.handicap],
              [`player${i + 1}TShirtSize`, golfer.tShirtSize]
            ];
          }).flat()
        )
      };

      const registrationResponse = await fetch('/api/registration/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: formattedFormData }),
      });
  
      const registrationResult = await registrationResponse.json();
  
      if (!registrationResponse.ok || !registrationResult.uid) {
        console.error('Failed to add registration:', registrationResult.error);
        alert('Failed to save your registration. Please try again.');
        return;
      }
  
      console.log('✅ Registration saved successfully with UID:', registrationResult.uid);
  
      // Proceed to checkout
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
  
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: registrationResult.uid,
          totalPrice: (totalPrice + stripeFee).toFixed(2),
          breakdown: {
            basePrice: basePrice.toFixed(2),
            dinnerTickets: dinnerTicketCost.toFixed(2),
            flagPrize: flagPrizeCost.toFixed(2),
          },
        }),
      });
  
      const session = await checkoutResponse.json();
  
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Error creating Stripe session');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
    }
  };

  const handleScrollDown = () => {
    document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const confirmed = params.get('confirmed');
    const canceledUid = params.get('canceled');
  
    if (confirmed) {
      setRegistrationStatus('success');
      handleScrollDown();
    } else if (canceledUid) {
      fetch('/api/registration/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: canceledUid }),
      })
      .then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          setRegistrationStatus('canceled');
          resetForm();
        } else {
          console.error('Removal failed:', result.error);
          alert('Error removing your registration. Please contact support.');
        }
      })
      .catch((error) => {
        console.error('Network Error:', error);
        alert('Something went wrong, please try again.');
      });
    }
  }, [resetForm, params]);

  if (registrationStatus === 'success') {
    return (
      <>
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-3"><FaRegCheckCircle className="h-16 w-16 font-bold text-customPrimary ml-auto mr-auto mb-3"/>You&apos;re all set!</h2>
          <p className="mb-3 text-lg">See you at the tournament on {tournamentStartDate} {new Date(Date.now()).getFullYear()}.</p>
          <p className="text-lg mt-2">Check your email for the receipt and details.</p>
        </div>
      </div>
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>
      </>
    );
  }
  
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 md:gap-y-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">

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

      {/* Participant Type & Total Section Wrapper */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative order-1 md:order-2">
        {/* Total Section with Breakdown */}
        <div ref={totalRef} className="flex justify-start md:justify-end items-start order-1 md:order-2">
          <div className="flex flex-col">
            {/* Main Total Row */}
            <div className="flex flex-row justify-start md:justify-center items-center">
              <h3 className="text-white/80 text-2xl font-semibold mr-2">TOTAL:</h3>
              <p className="text-2xl text-white font-bold">${(totalPrice + stripeFee).toFixed(2)}</p>
            </div>

            {/* Pricing Breakdown */}
            <div className="flex flex-col text-sm text-white/60 mt-2 space-y-1">
              <p>Base Registration: ${basePrice.toFixed(2)}</p>
              {dinnerTicketCost > 0 && <p>Dinner Tickets: ${dinnerTicketCost.toFixed(2)}</p>}
              {flagPrizeCost > 0 && <p>Flag Prize Contribution: ${flagPrizeCost.toFixed(2)}</p>}
              <p className="mt-1">Processing Fee: ${stripeFee.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Sticky Total Section (when out of view) */}
        {isSticky && (
            <div className="transition-all fixed top-[81px] md:top-[65px] left-0 right-0 bg-secondary-foreground md:bg-black/60 md:backdrop-blur-2xl text-white shadow-lg z-50 p-4 transition-transform">
              <div className="max-w-[1200px] mx-auto flex justify-between items-center">
                <div className="flex flex-col">
                  {/* Main Total */}
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="text-xl font-bold">TOTAL:</h3>
                    <p className="text-2xl font-bold">${(totalPrice + stripeFee).toFixed(2)}</p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="flex flex-col text-sm text-white/60 mt-2 space-y-1">
                    <p>Base Registration: ${basePrice.toFixed(2)}</p>
                    {dinnerTicketCost > 0 && <p>Dinner Tickets: ${dinnerTicketCost.toFixed(2)}</p>}
                    {flagPrizeCost > 0 && <p>Flag Prize Contribution: ${flagPrizeCost.toFixed(2)}</p>}
                    <p className="mt-1">Processing Fee: ${stripeFee.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible defaultValue={path.includes('sponsor') ? `sponsor-packages` : `individual-participants`} className="w-full">
          {/* Individual Participants */}
          <AccordionItem value="individual-participants" className="border-t border-white/80">
            <AccordionTrigger className="text-white/80 text-lg font-semibold [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">INDIVIDUAL PARTICIPANTS:</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {[
                  { label: `Current Miner ($${basePrices['currentMiner']})`, value: 'currentMiner', details: '54 holes of golf and cart, premium gift bag, Thursday night social and Saturday banquet at Gillette’s Cam-plex. Flag prizes are awarded for each day. A Calcutta will take place Friday evening.' },
                  { label: `Past Board / Past Champion / Retiree ($${basePrices['pastBoardPastChampionRetiree']})`, value: 'pastBoardPastChampionRetiree', details: '54 holes of golf and cart, premium gift bag, Thursday night social and Saturday banquet at Gillette’s Cam-plex. Flag prizes are awarded for each day. A Calcutta will take place Friday evening.' },
                  { label: `General Public ($${basePrices['generalPublic']})`, value: 'generalPublic', details: '54 holes of golf and cart, premium gift bag, Thursday night social and Saturday banquet at Gillette’s Cam-plex. Flag prizes are awarded for each day. A Calcutta will take place Friday evening.'},
                ].map((option) => (
                  <div className="group" key={option.value}>
                    <label className="flex flex-col cursor-pointer text-white/60 text-lg pb-2
                      group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                      group-has-[input:checked]:bg-black/80
                      hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                      border border-transparent rounded-lg transition-all">
                      
                      {/* Main Selection */}
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        <div className="relative ml-auto">
                          {/* Hidden Radio Input */}
                          <input
                            type="radio"
                            name="participantType"
                            value={option.value}
                            checked={formData.participantType === option.value}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          {/* Outer Circle */}
                          <div className="h-6 w-6 rounded-full border-2 border-customInputBorder"></div>
                          {/* Inner Circle */}
                          <div className="h-4 w-4 rounded-full bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                        </div>
                      </div>
              
                      {/* Additional Details (Hidden by default, shows when selected) */}
                      {formData.participantType === option.value && <div className="mt-2 text-sm text-white/60">
                        {option.details}
                      </div>}
              
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sponsor Packages */}
          <AccordionItem value="sponsor-packages" className="border-white/80">
            <AccordionTrigger className="text-white/80 text-lg font-semibold [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">SPONSORSHIP PACKAGES:</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {[
                  { label: `Platinum Sponsor Package ($${basePrices['platinumSponsorship']})`, value: 'platinumSponsorship', details: 'Recognition at banquet, name listed in tournament brochure, logo on flag which is yours to keep, UP TO 10 GOLFERS'},
                  { label: `Gold Sponsor Package ($${basePrices['goldSponsorship']})`, value: 'goldSponsorship', details: 'Recognition at banquet, name listed in tournament brochure, logo on flag which is yours to keep, UP TO 5 GOLFERS' },
                  { label: `Silver Sponsor Package ($${basePrices['silverSponsorship']})`, value: 'silverSponsorship', details: 'Recognition at banquet, name listed in tournament brochure, logo on flag which is yours to keep, UP TO 2 GOLFERS' },
                  { label: `Single Team Sponsor Entry ($${basePrices['teamSponsorEntry']})`, value: 'teamSponsorEntry', details: '18 holes of golf per day for THREE players total. Premium gift bag, Thursday night social and Saturday banquet at Gillette’s Cam-plex. Flag prizes are awarded for each day. A Calcutta will take place Friday evening.' },                  
                  { label: `Single Player Sponsor Entry ($${basePrices['singlePlayerSponsorEntry']})`, value: 'singlePlayerSponsorEntry', details: '18 holes of golf per day for ONE player. Premium gift bag, Thursday night social and Saturday banquet at Gillette’s Cam-plex. Flag prizes are awarded for each day. A Calcutta will take place Friday evening.' },
                ].map((option) => (
                  <div className="group" key={option.value}>
                    <label className="flex flex-col cursor-pointer text-white/60 text-lg pb-2
                      group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                      group-has-[input:checked]:bg-black/80
                      hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                      border border-transparent rounded-lg transition-all">
                      
                      {/* Main Selection */}
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        <div className="relative ml-auto">
                          {/* Hidden Radio Input */}
                          <input
                            type="radio"
                            name="participantType"
                            value={option.value}
                            checked={formData.participantType === option.value}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          {/* Outer Circle */}
                          <div className="h-6 w-6 rounded-full border-2 border-customInputBorder"></div>
                          {/* Inner Circle */}
                          <div className="h-4 w-4 rounded-full bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                        </div>
                      </div>
              
                      {/* Additional Details (Hidden by default, shows when selected) */}
                      {formData.participantType === option.value && <div className="mt-2 text-sm text-white/60">
                        {option.details}
                      </div>}
              
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Individual Sponsorship Items */}
          <AccordionItem value="individual-sponsorship" className="border-white/80">
            <AccordionTrigger className="text-white/80 text-lg font-semibold border-white/20 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">SPONSORSHIP PRODUCTS:</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {[
                  { label: `Tee Box Sponsor ($${basePrices['teeBoxSponsorship']} You own the box!)`, value: 'teeBoxSponsorship', details: 'Recognition at banquet, name listed in tournament brochure, and your logo on hole flag of the tee box which is yours to keep. $500 of this will go to the club house fees if you sponsor a tent on your tee box to offer refreshments.'},
                  { label: `Driving Range Sponsor ($${basePrices['drivingRangeSponsorship']})`, value: 'drivingRangeSponsorship', details: 'Recognition at banquet, name listed in tournament brochure, sign placed on driving range'},
                  { label: `Hole Flag Sponsor ($${basePrices['holeFlagSponsorship']})`, value: 'holeFlagSponsorship', details: 'Name listed in tournament brochure, flag on hole that will be yours at end of tournament'},
                  { label: `Flag Prize Sponsor ($${basePrices['flagPrizeSponsorship']})`, value: 'flagPrizeSponsorship', details: 'Recognition at banquet, Name listed in tournament brochure'}
                ].map((option) => (
                  <div className="group" key={option.value}>
                    <label className="flex flex-col cursor-pointer text-white/60 text-lg pb-2
                      group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                      group-has-[input:checked]:bg-black/80
                      hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                      border border-transparent rounded-lg transition-all">
                      
                      {/* Main Selection */}
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        <div className="relative ml-auto">
                          {/* Hidden Radio Input */}
                          <input
                            type="radio"
                            name="participantType"
                            value={option.value}
                            checked={formData.participantType === option.value}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          {/* Outer Circle */}
                          <div className="h-6 w-6 rounded-full border-2 border-customInputBorder"></div>
                          {/* Inner Circle */}
                          <div className="h-4 w-4 rounded-full bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                        </div>
                      </div>
              
                      {/* Additional Details (Hidden by default, shows when selected) */}
                      {formData.participantType === option.value && <div className="mt-2 text-sm text-white/60">
                        {option.details}
                      </div>}
              
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/** About selection type text */}
      <div className="text-customInputBorder col-span-full p-2 text-xs md:text-sm">
        {formData.participantType === 'pastBoardPastChampionRetiree' && (
          <p>Automatic qualifications for initial acceptance to the tournament field are either through being a past Coal Country Open Board
          Member or a past Coal Country Open overall tournament champion, neither being currently active in the mining industry on either the
          miner or supplier side of the business. Additional opportunities for mining industry retirees will be at the Coal Country Open Board&apos;s
          discretion based on available slots in the field if any remain after all active suppliers and active miners have been accepted.
          <span className="bg-customYellow text-secondary-foreground font-bold">Deadline for entries is July 1st</span>. Tournament field will open to the non-mining public after July 1. All entries must be mailed or
          received before July 25th. Tournament Placement will be determined by mining affiliation 1st and then to the public as received. All
          entries are reviewed and entered at the CCO Board discretion. <span className="underline font-bold">Entrants must be 21 years of age</span>.</p>
        )}

        {(formData.participantType === 'generalPublic' || formData.participantType == 'currentMiner' || formData.participantType == 'singlePlayerSponsorEntry' || formData.participantType == 'teamSponsorEntry') && (
          <p><span className="bg-customYellow text-secondary-foreground font-bold">Deadline for entries is July 1st</span>. Tournament field will open to the non-mining public after July 1. All entries must be mailed or
          received before July 25. Tournament Placement will be determined by mining affiliation 1st and then to the public as received. All
          entries are reviewed and entered at the CCO Board discretion. <span className="underline font-bold">Entrants must be 21 years of age</span>.</p>
        )}

        {formData.participantType === 'singlePlayerSponsorEntry' && (
          <p>
            In addition to the sponsorship fee, we encourage you to make donations of cash or gifts to be
            given as door prizes at the banquet. To better ensure we correctly recognize your company for
            these donations, we are asking for some additional support during the planning phase of the
            event in the following areas:<br /><br />

            Early notification of what your donation will consist of. This can be done using the
            designated section of the attached form or through email notification. For door prizes,
            what you anticipate on the door prize being. Having this information before <span className="font-bold underline">AUGUST
            1st, 2021</span> would be greatly appreciated.
              <br/><br/>
             
            For any door prizes dropped off at various locations, attaching a business card to make
            sure we have recognized your support correctly.
            Thank you again for your continued support and we look forward to seeing you at this year&apos;s
            tournament.
          </p>
        )}

        {["platinumSponsorship", "goldSponsorship", "silverSponsorship"].includes(formData.participantType) && (
          <p className="p-2 mt-6 md:text-lg bg-customYellow text-secondary-foreground font-bold">IF YOU DO NOT KNOW WHO WILL PLAY ON YOUR SPONSORSHIP AT THE TIME OF SIGNUP; TYPE THE WORD <span className="underline">PLACEHOLDER</span> IN ALL PLAYER FIELDS FOR AS MANY PLAYERS AS YOU ARE EXPECTING. YOU WILL NEED TO CONTACT THE TOURNAMENT BOARD TO ADD YOUR PLAYERS BEFORE THE TOURNAMENT.</p>
        )}
      </div>
      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

      {formData.participantType === 'teamSponsorEntry' && !["platinumSponsorship", "goldSponsorship", "silverSponsorship"].includes(formData.participantType) && (
        <TeamFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
      )}

      {formData.participantType !== 'teamSponsorEntry' && !["flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType) && !["platinumSponsorship", "goldSponsorship", "silverSponsorship"].includes(formData.participantType) && (
        <DefaultFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
      )}

      {["platinumSponsorship", "goldSponsorship", "silverSponsorship"].includes(formData.participantType) && (
        <GolfersFormFields
          setFormErrors={setFormErrors}
          handleSelectChange={handleSelectChange}
          handleChange={handleChange}
          golfers={formData.golfers}
          setFormData={setFormData}
          formErrors={formErrors}
          formData={formData}
          maxGolfers={
            formData.participantType === "platinumSponsorship" ? 10 :
            formData.participantType === "goldSponsorship" ? 5 :
            formData.participantType === "silverSponsorship" ? 2 : 0
          }
        />
      )}

      {formData.participantType === 'singlePlayerSponsorEntry' && (
        <SingleEntryFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
      )}

      {["flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship"].includes(formData.participantType) && (
        <SponsorProductsFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
      )}

      {/* Submit Button */}
      <div className="col-span-full mt-6">
        <Button onClick={handleCheckout} className="p-0 md:p-6 mr-[1rem] border border-customPrimary w-full bg-customPrimary hover:bg-customPrimary/60 uppercase font-text font-5xl font-bold flex flex-row justify-center items-center">
          Continue to Secure Payment <FaLock className="h-16 w-16 font-bold" />
        </Button>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>
    </form>
  );
}