'use client';

import { useState } from 'react';
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
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto p-6">
      {/* Company Info */}
      <div className="col-span-1">
        <label htmlFor="company" className="block text-sm text-white/60 mb-1">Company Represented</label>
        <Input
          id="company"
          name="company"
          placeholder="Company Represented"
          value={formData.company}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      {/* Derby Participation */}
      <div className="col-span-1">
        <label htmlFor="derby" className="block text-sm text-white/60 mb-1">Derby</label>
        <Select onValueChange={(value) => handleSelectChange('derby', value)}>
          <SelectTrigger className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary">
            <SelectValue placeholder="Select Derby Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Will participate in Derby (+$10.00)</SelectItem>
            <SelectItem value="no">Will not participate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Personal Info */}
      <div className="col-span-1">
        <label htmlFor="name" className="block text-sm text-white/60 mb-1">Name</label>
        <Input
          id="name"
          name="name"
          placeholder="Enter Your Name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="email" className="block text-sm text-white/60 mb-1">Email</label>
        <Input
          id="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="phone" className="block text-sm text-white/60 mb-1">Phone</label>
        <Input
          id="phone"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="handicap" className="block text-sm text-white/60 mb-1">Average Score or Handicap</label>
        <Input
          id="handicap"
          name="handicap"
          placeholder="Handicap"
          value={formData.handicap}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      {/* Address Info */}
      <div className="col-span-1">
        <label htmlFor="address" className="block text-sm text-white/60 mb-1">Address</label>
        <Input
          id="address"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="city" className="block text-sm text-white/60 mb-1">City</label>
        <Input
          id="city"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="state" className="block text-sm text-white/60 mb-1">State</label>
        <Input
          id="state"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="zip" className="block text-sm text-white/60 mb-1">ZIP</label>
        <Input
          id="zip"
          name="zip"
          placeholder="ZIP"
          value={formData.zip}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      {/* Sizing Info */}
      <div className="col-span-1">
        <label htmlFor="shirtSize" className="block text-sm text-white/60 mb-1">Shirt Size</label>
        <Input
          id="shirtSize"
          name="shirtSize"
          placeholder="Shirt Size"
          value={formData.shirtSize}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      <div className="col-span-1">
        <label htmlFor="shoeSize" className="block text-sm text-white/60 mb-1">Shoe Size</label>
        <Input
          id="shoeSize"
          name="shoeSize"
          placeholder="Shoe Size"
          value={formData.shoeSize}
          onChange={handleChange}
          className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary"
        />
      </div>

      {/* Banquet Info */}
      <div className="col-span-1">
        <label className="block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
        <Select onValueChange={(value) => handleSelectChange('banquet', value)}>
          <SelectTrigger className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary">
            <SelectValue placeholder="Select Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <label className="block text-sm text-white/60 mb-1">Additional Dinner Tickets (+$40 each)</label>
        <Select onValueChange={(value) => handleSelectChange('dinnerTickets', value)}>
          <SelectTrigger className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary">
            <SelectValue placeholder="Select Quantity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className="col-span-full">
        <Button type="submit" className="w-full bg-green-600 text-white">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}
