'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
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
    derby: '',
    participantType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">

      {/* Registration Includes Section */}
      <div className="col-span-full">
        <h3 className="text-white/80 text-lg font-semibold mt-4">REGISTRATION INCLUDES:</h3>
        <ul className="text-white/60 list-disc pl-5 mt-2 space-y-1 text-lg">
          <li>54 holes of golf and cart</li>
          <li><span className="font-bold">Premium</span> gift bag</li>
          <li>Thursday night social and Saturday banquet at Gillette&quot;s Cam-plex</li>
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
          <div className="flex flex-row justify-center items-center">
            <h3 className="text-white/80 text-2xl font-semibold mr-2">TOTAL:</h3>
            <p className="text-2xl text-white font-bold">$250.00</p>
          </div>
        </div>

        {/* Participant Type */}
        <div className="order-2 md:order-1">
          <h3 className="text-white/80 text-lg font-semibold mb-2">SELECT PARTICIPANT TYPE:</h3>
          <div className="space-y-1">
            {[
              { label: 'Current Miner', value: 'currentMiner' },
              { label: 'Past Board / Past Champion / Retiree', value: 'pastBoardPastChampionRetiree' },
              { label: 'General Public', value: 'generalPublic' }
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
                    className="sr-only peer"
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

      {/** Past Board / Past Champion / Retiree Important text */}
      {formData.participantType === 'pastBoardPastChampionRetiree' && (
        <div className="col-span-full text-white/60 mb-8">
          <h3 className="font-bold">IMPORTANT:</h3>
          <p>
            Automatic qualifications for initial acceptance to the tournament field are either through being a past Coal Country Open Board Member or a past Coal Country Open overall tournament champion, neither being currently active in the mining industry on either the miner or supplier side of the business.  Additional opportunities for mining industry retirees will be at the Coal Country Open Board&quot;s discretion based on available slots in the field if any remain after all active suppliers and active miners have been accepted.    
            <span className="font-bold underline bg-customYellow text-black">Deadline for entries is July 1st</span>. Tournament field will open to the non-mining public after July 1. All entries must be mailed or received before July 25. Tournament Placement will be determined by mining affiliation 1st and then to the public as received. All entries are reviewed and entered at the CCO Board discretion. <span className="font-bold underline">Entrants must be 21 years of age</span>.
          </p>
        </div>
      )}

      {/** Current Miner Important Text */}
      {(formData.participantType === 'currentMiner'  || formData.participantType === 'generalPublic') && (
        <div className="col-span-full text-white/60 mb-8">
          <h3 className="font-bold">IMPORTANT:</h3>
          <p>
            <span className="font-bold underline bg-customYellow text-black">Deadline for entries is July 1st</span>. Tournament field will open to the non-mining public after July 1st. All entries must be mailed or received before July 25th. Tournament Placement will be determined by mining affiliation 1st and then to the public as received. All entries are reviewed and entered at the CCO Board discretion. <span className="font-bold underline">Entrants must be 21 years of age</span>. 
          </p>
        </div>
      )}

      {/* Company Info Group */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY INFO</h3>
        <label htmlFor="company" className="sr-only block text-sm text-white/60 mb-1">Company Represented</label>
        <Input
          id="company"
          name="company"
          placeholder="Company Represented"
          value={formData.company}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 text-lg focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
        />
      </div>

      <div className="col-span-1 relative">
        <h3 className="text-white/80 text-lg font-semibold mb-2">DERBY</h3>
        <label htmlFor="derby" className="sr-only block text-lg font-semibold text-white/80 mb-2">Derby</label>
        <Select onValueChange={(value) => handleSelectChange('derby', value)}>
          <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
            {/* Placeholder and selected value */}
            <SelectValue 
              placeholder="Will you play in the derby?" 
              className="text-white/60 text-lg" 
            />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="yes">Yes (+$10.00)</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Personal Info Group */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mb-2">PERSONAL INFO</h3>
        <div className="mt-3">
          <label htmlFor="name" className="sr-only hidden block text-sm text-white/60 mb-1">Name</label>
          <Input
            id="name"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="email" className="sr-only hidden block text-sm text-white/60 mb-1">Email</label>
          <Input
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="phone" className="sr-only block text-sm text-white/60 mb-1">Phone</label>
          <Input
            id="phone"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="handicap" className="sr-only block text-sm text-white/60 mb-1">Average Score or Handicap</label>
          <Input
            id="handicap"
            name="handicap"
            placeholder="Handicap"
            value={formData.handicap}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
      </div>


      {/* Address Info Group */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mb-2">ADDRESS INFO</h3>
        <div className="mt-3">
          <label htmlFor="address" className="sr-only block text-sm text-white/60 mb-1">Address</label>
          <Input
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="city" className="sr-only block text-sm text-white/60 mb-1">City</label>
          <Input
            id="city"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="state" className="sr-only block text-sm text-white/60 mb-1">State</label>
          <Input
            id="state"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="zip" className="sr-only block text-sm text-white/60 mb-1">Zip</label>
          <Input
            id="zip"
            name="zip"
            placeholder="Zip Code"
            value={formData.zip}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
      </div>

      {/* Banquet Info Group */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
        <div className="mt-3">
          <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
          <Select onValueChange={(value) => handleSelectChange('banquet', value)}>
            <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
              <SelectValue placeholder="Will you attend the banquet?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3">
          <label className="sr-only block text-sm text-white/60 mb-1">Additional Dinner Tickets (+$40 each)</label>
          <Select onValueChange={(value) => handleSelectChange('dinnerTickets', value)}>
            <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
              <SelectValue placeholder="Additional Dinner Tickets (+$40 each)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sizing Info Group */}
      <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mb-2">SIZING INFO</h3>
        <div className="mt-3">
          <label htmlFor="shirtSize" className="sr-only block text-sm text-white/60 mb-1">Shirt Size</label>
          <Input
            id="shirtSize"
            name="shirtSize"
            placeholder="Enter Your Shirt Size"
            value={formData.shirtSize}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="shoeSize" className="sr-only block text-sm text-white/60 mb-1">Shoe Size</label>
          <Input
            id="shoeSize"
            name="shoeSize"
            placeholder="Enter Your Shoe Size"
            value={formData.shoeSize}
            onChange={handleChange}
            className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-full mt-6">
        <Button type="submit" className="w-full bg-green-600 text-white">
          Continue to Payment
        </Button>
      </div>

      {/* Divider */}
      <div className="col-span-full my-8">
        <hr className="border-t border-white/20" />
      </div>
    </form>
  );
}
