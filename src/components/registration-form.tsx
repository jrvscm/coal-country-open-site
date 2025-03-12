'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FaLock, FaRegCheckCircle } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import TeamFormFields from '@/components/team-form-fields';
import DefaultFormFields from '@/components/default-form-fields';
import SingleEntryFields from '@/components/single-entry-fields';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';
import { useTournamentDate } from '@/context/TournamentDateContext';

export type FormDataType = {
  name: string;
  email: string;
  phone: string;
  company: string;
  handicap: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  shirtSize: string;
  shoeSize: string;
  banquet: string;
  dinnerTickets: string;
  derby: string;
  participantType: string;
  doorPrize?: string;
  flagPrizeContribution?: string;
  teamName?: string;
  teamContactName?: string;
  teamContactPhone?: string;
  teamContactEmail?: string;
  playerOneName?: string;
  playerTwoName?: string;
  playerThreeName?: string;
  playerOneHandicap?: string;
  playerTwoHandicap?: string;
  playerThreeHandicap?: string;
  playerOneTShirtSize?: string;
  playerTwoTShirtSize?: string;
  playerThreeTShirtSize?: string;
};

export default function RegistrationForm() {
  const tournamentStartDate = useTournamentDate();
  const params = useSearchParams();
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'canceled'>('idle');
  const resetForm = () => setFormData(defaultFormState);

  // Pricing for each participant type
  const basePrices = useMemo(() => ({
    currentMiner: 250.0,
    pastBoardPastChampionRetiree: 250.0,
    generalPublic: 450.0,
    singlePlayerSponsorEntry: 450.0,
    teamSponsorEntry: 1000.0,
  }), []);

  type FormErrorsType = Partial<Record<keyof FormDataType, string>>;

  const defaultFormState: FormDataType = {
    name: '',
    email: '',
    phone: '',
    company: '',
    handicap: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    shirtSize: '',
    shoeSize: '',
    banquet: '',
    dinnerTickets: '',
    derby: 'no',
    participantType: 'currentMiner',
    doorPrize: '',
    flagPrizeContribution: '',
    teamName: '',
    teamContactName: '',
    teamContactPhone: '',
    teamContactEmail: '',
    playerOneName: '',
    playerTwoName: '',
    playerThreeName: '',
    playerOneHandicap: '',
    playerTwoHandicap: '',
    playerThreeHandicap: '',
    playerOneTShirtSize: '',
    playerTwoTShirtSize: '',
    playerThreeTShirtSize: '',
  };
  
  const [formData, setFormData] = useState<FormDataType>(defaultFormState);
  const [formErrors, setFormErrors] = useState<FormErrorsType>({} as FormErrorsType);
  const [totalPrice, setTotalPrice] = useState(basePrices[formData.participantType as keyof typeof basePrices]);
  const [stripeFee, setStripeFee] = useState(0);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const zipRegex = /^\d{5}$/;
  const handicapRegex = /^[+-]?\d+(\.\d{1,2})?$/;
  const flagPrizeRegex = useMemo(() => (/^\d+$/), [])

  const validateForm = () => {
    const errors: FormErrorsType = {}; 

    if(formData.participantType !== 'teamSponsorEntry') {
      if (!formData.address) errors.address = "Address is required";
      if (!formData.name) errors.name = "Name is required";
      if (!formData.email || !emailRegex.test(formData.email)) errors.email = "Invalid email";
      if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\D/g, ""))) errors.phone = "Invalid phone number";
      if (!formData.zip || !zipRegex.test(formData.zip)) errors.zip = "Invalid zip code";
      if (!formData.handicap || !handicapRegex.test(formData.handicap)) errors.handicap = "Enter a valid handicap";
      if(!formData.company) errors.company = "Company is required";
      if(!formData.city) errors.city = "City is required";
      if(!formData.state) errors.state = "State is required";
      if(!formData.zip) errors.zip = "Zip is required";
      if(!formData.shirtSize) errors.shirtSize = "Shirt size is required";
    }

    if (formData.participantType === "teamSponsorEntry") {
      if (!formData.teamName) errors.teamName = "Team Name is required";
      //player names
      if (!formData.playerOneName) errors.playerOneName = "Player One Name is required";
      if (!formData.playerTwoName) errors.playerTwoName = "Player Two Name is required";
      if (!formData.playerThreeName) errors.playerThreeName = "Player Three Name is required";
      //player handicaps
      if (!formData.playerOneHandicap || !handicapRegex.test(formData.playerOneHandicap)) errors.playerOneHandicap = "Player One Handicap is required";
      if (!formData.playerTwoHandicap || !handicapRegex.test(formData.playerTwoHandicap)) errors.playerTwoHandicap = "Player Two Handicap is required";
      if (!formData.playerThreeHandicap || !handicapRegex.test(formData.playerThreeHandicap)) errors.playerThreeHandicap = "Player Three Handicap is required";
      //player shirt size
      if (!formData.playerOneTShirtSize) errors.playerOneTShirtSize = "Player One T-Shirt size is required";
      if (!formData.playerTwoTShirtSize) errors.playerTwoTShirtSize = "Player Two T-Shirt size is required";
      if (!formData.playerThreeTShirtSize) errors.playerThreeTShirtSize = "Player Three T-Shirt size is required";
      //team contact
      if (!formData.teamContactName) errors.teamContactName = "Team contact name is required";
      if (!formData.teamContactPhone || !phoneRegex.test(formData.teamContactPhone.replace(/\D/g, ""))) errors.teamContactPhone = "Team contact phone is invalid";
      if (!formData.teamContactEmail || !emailRegex.test(formData.teamContactEmail)) errors.teamContactEmail = "Team contact email is invalid";
    }

    if(!formData.banquet) errors.banquet = "Banquet choice is required";

    if(formData.participantType === 'singlePlayerSponsorEntry') {
      if(!formData.doorPrize) errors.doorPrize = "Door prize contribution is required"
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
        });

        // Reset all form errors
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
  const [derbyCost, setDerbyCost] = useState(0);
  const [flagPrizeCost, setFlagPrizeCost] = useState(0);

  useEffect(() => {
    const newBasePrice = basePrices[formData.participantType as keyof typeof basePrices] || 0;
    let newDinnerTicketCost = 0;
    let newDerbyCost = 0;
    let newFlagPrizeCost = 0;
  
    if (formData.dinnerTickets !== '') {
        newDinnerTicketCost = parseInt(formData.dinnerTickets, 10) * 32.0;
    }

    if (formData.participantType !== 'teamSponsorEntry' && formData.derby === 'yes') {
        newDerbyCost = 10.0;
    }

    if (formData.flagPrizeContribution && flagPrizeRegex.test(formData.flagPrizeContribution)) {
        newFlagPrizeCost = parseInt(formData.flagPrizeContribution, 10);
    }

    const newTotal = newBasePrice + newDinnerTicketCost + newDerbyCost + newFlagPrizeCost;
    const newStripeFee = (newTotal * 0.029) + 0.30;
  
    // Update state
    setBasePrice(newBasePrice);
    setDinnerTicketCost(newDinnerTicketCost);
    setDerbyCost(newDerbyCost);
    setFlagPrizeCost(newFlagPrizeCost);
    setTotalPrice(newTotal);
    setStripeFee(newStripeFee);
  }, [basePrices, flagPrizeRegex, formData.participantType, formData.dinnerTickets, formData.derby, formData.flagPrizeContribution]);

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
  
    try {
      // **Step 1: Save registration and get UID**
      const registrationResponse = await fetch('/api/registration/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });
  
      const registrationResult = await registrationResponse.json();
  
      if (!registrationResponse.ok || !registrationResult.uid) {
        console.error('Failed to add registration:', registrationResult.error);
        alert('Failed to save your registration. Please try again.');
        return;
      }
  
      console.log('✅ Registration saved successfully with UID:', registrationResult.uid);
  
      // **Step 2: Proceed to Stripe checkout**
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
  
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: registrationResult.uid, // Pass the UID from Google Sheets
          totalPrice: (totalPrice + stripeFee).toFixed(2),
          breakdown: {
            basePrice: basePrice.toFixed(2),
            dinnerTickets: dinnerTicketCost.toFixed(2),
            derby: derbyCost.toFixed(2),
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
  }, [params]);

  if (registrationStatus === 'success') {
    return (
      <>
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-3"><FaRegCheckCircle className="h-16 w-16 font-bold text-customPrimary ml-auto mr-auto mb-3"/>You're all set!</h2>
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
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">

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
              {derbyCost > 0 && <p>Derby Entry: ${derbyCost.toFixed(2)}</p>}
              {flagPrizeCost > 0 && <p>Flag Prize Contribution: ${flagPrizeCost.toFixed(2)}</p>}
              <p className="font-semibold mt-1">Processing Fee: ${stripeFee.toFixed(2)}</p>
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
                    {derbyCost > 0 && <p>Derby Entry: ${derbyCost.toFixed(2)}</p>}
                    {flagPrizeCost > 0 && <p>Flag Prize Contribution: ${flagPrizeCost.toFixed(2)}</p>}
                    <p className="font-semibold mt-1">Processing Fee: ${stripeFee.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Participant Type */}
        <div className="order-2 md:order-1">
          <h3 className="text-white/80 text-lg font-semibold mb-2">SELECT PARTICIPANT TYPE:</h3>
          <div className="space-y-1">
            {[
              { label: 'Current Miner', value: 'currentMiner' },
              { label: 'Past Board / Past Champion / Retiree', value: 'pastBoardPastChampionRetiree' },
              { label: 'General Public', value: 'generalPublic' },
              { label: 'Single Player Sponsor Entry', value: 'singlePlayerSponsorEntry' },
              { label: 'Team Sponsor Entry', value: 'teamSponsorEntry' }
            ].map((option) => (
              <div className="group" key={option.value}>
                <label className="
                  flex items-center justify-between cursor-pointer text-white/60 text-lg pb-2
                  group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                  group-has-[input:checked]:bg-black/80
                  hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                  border border-transparent rounded-lg
                  transition-all
                ">
                  <span>{option.label}</span>
                  <div className="relative ml-auto">
                    {/* Hidden Radio Input */}
                    <input
                      type="radio"
                      name="participantType"
                      value={option.value}
                      checked={formData.participantType === option.value}
                      onChange={handleChange}
                      className={"sr-only peer"}
                    />

                    {/* Outer Circle */}
                    <div className="h-6 w-6 rounded-full border-2 border-customInputBorder"></div>

                    {/* Inner Circle */}
                    <div className="h-4 w-4 rounded-full bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/** About selection type text */}
      <div className="text-customInputBorder col-span-full p-2 text-xs md:text-sm">
        {formData.participantType === 'pastBoardPastChampionRetiree' && (
          <p>Automatic qualifications for initial acceptance to the tournament field are either through being a past Coal Country Open Board
          Member or a past Coal Country Open overall tournament champion, neither being currently active in the mining industry on either the
          miner or supplier side of the business. Additional opportunities for mining industry retirees will be at the Coal Country Open Board’s
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

        {formData.participantType == 'singlePlayerSponsorEntry' && (
          <p>
            In addition to the sponsorship fee, we encourage you to make donations of cash or gifts to be
            given as door prizes at the banquet. To better ensure we correctly recognize your company for
            these donations, we are asking for some additional support during the planning phase of the
            event in the following areas:<br /><br />
            <ul>
              <li>
                Early notification of what your donation will consist of. This can be done using the
                designated section of the attached form or through email notification. For door prizes,
                what you anticipate on the door prize being. Having this information before <span className="font-bold underline">AUGUST
                1st, 2021</span> would be greatly appreciated.
              </li><br/>
              <li>
                For any door prizes dropped off at various locations, attaching a business card to make
                sure we have recognized your support correctly.
                Thank you again for your continued support and we look forward to seeing you at this year’s
                tournament.
              </li>
            </ul>
          </p>
        )}
      </div>
      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

      {formData.participantType === 'teamSponsorEntry' && (
        <TeamFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
      )}

      {formData.participantType !== 'teamSponsorEntry' && (
        <DefaultFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
      )}

      {formData.participantType === 'singlePlayerSponsorEntry' && (
        <SingleEntryFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
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