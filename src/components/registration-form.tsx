'use client';

import { useState, useEffect } from 'react';
import { FaLock } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import TeamFormFields from '@/components/team-form-fields';
import DefaultFormFields from '@/components/default-form-fields';
import { loadStripe } from '@stripe/stripe-js';

export default function RegistrationForm() {
  // Pricing for each participant type
  const basePrices = {
    currentMiner: 250.0,
    pastBoardPastChampionRetiree: 250.0,
    generalPublic: 450.0,
    singlePlayerSponsorEntry: 450.0,
    teamSponsorEntry: 1000.0,
  };

  const defaultFormState = {
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
    dinnerTickets: '', // Default to 0
    derby: 'no', // Default to 'no' for derby
    participantType: 'currentMiner',

    // Sponsor additional fields
    doorPrize: '',
    flagPrizeContribution: '',

    // Team sponsor additional fields
    teamName: '',
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

  const [formData, setFormData] = useState(defaultFormState);
  const [totalPrice, setTotalPrice] = useState(basePrices[formData.participantType]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    // If the participant type changes, reset the form while keeping the new participant type
    if (name === 'participantType') {
      setFormData({
        ...defaultFormState,
        participantType: value,
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate total price dynamically
  useEffect(() => {
    let newTotal = basePrices[formData.participantType] || 0;

    if(formData.dinnerTickets !== '') {
      // Add dinner ticket cost ($32 each)
      newTotal += parseInt(formData.dinnerTickets, 10) * 32.0;
    }

    // Add derby cost ($10) only for single entry types
    if (formData.participantType !== 'teamSponsorEntry' && formData.derby === 'yes') {
      newTotal += 10.0;
    }

    setTotalPrice(newTotal);
  }, [formData.participantType, formData.dinnerTickets, formData.derby]);



  //stripe 
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  
  const handleCheckout = async () => {
    const stripe = await stripePromise;
  
    if (!stripe) {
      console.error("Stripe failed to load.");
      return;
    }
  
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantType: formData.participantType,
          totalPrice,
        }),
      });
  
      const session = await response.json();
  
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Error creating Stripe session');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
    }
  };
  
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">

      {/* Registration Includes Section */}
      <div className="col-span-full">
        <h3 className="text-white/80 text-lg font-semibold mt-4">REGISTRATION INCLUDES:</h3>
        <ul className="text-white/60 list-disc pl-5 mt-2 space-y-1 text-lg">
          <li>54 holes of golf and cart</li>
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

        {/* Total Section */}
        <div className="flex justify-start md:justify-end items-start order-1 md:order-2">
          <div className="flex flex-col">
            <div className="flex flex-row justify-center items-center">
              <h3 className="text-white/80 text-2xl font-semibold mr-2">TOTAL:</h3>
              <p className="text-2xl text-white font-bold">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-white/60 mt-1">
                * Processing fee applied at checkout.
              </p>
            </div>
          </div>
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
              <label key={option.value} className="flex items-center justify-between cursor-pointer text-white/60 text-lg">
                <span>{option.label}</span>
                <div className="relative mr-[12rem]">
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
            ))}
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>

      {formData.participantType === 'teamSponsorEntry' && (
        <TeamFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
      )}

      {formData.participantType !== 'teamSponsorEntry' && (
        <DefaultFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
      )}

      {/* Submit Button */}
      <div className="col-span-full mt-6">
        <Button className="p-0 md:p-6 mr-[1rem] border border-customPrimary w-full bg-customPrimary hover:bg-customPrimary/60 uppercase font-text font-5xl font-bold flex flex-row justify-center items-center">
          <FaLock className="h-16 w-16 font-bold" /> Continue to Secure Payment
        </Button>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>
    </form>
  );
}
