// DefaultFormFields.js
'use client';

import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function DefaultFormFields({ formData, handleChange, handleSelectChange, formErrors }) {
  return (
    <>
        <div className="col-span-1">
          <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY INFO</h3>
          <label htmlFor="company" className="sr-only block text-sm text-white/60 mb-1">Company Represented</label>
          <Input
            id="company"
            name="company"
            placeholder="Company Represented"
            value={formData.company}
            onChange={handleChange}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
              ${formErrors.company ? 'border-red-500' : 'border-customInputBorder'}
            `}          
          />
          {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
        </div>

        <div className="col-span-1 relative">
            <h3 className="text-white/80 text-lg font-semibold mb-2">DERBY</h3>
            <label htmlFor="derby" className="sr-only block text-lg font-semibold text-white/80 mb-2">Derby</label>
            <Select value={formData.derby} onValueChange={(value) => handleSelectChange('derby', value)}>
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
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.name ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="email" className="sr-only hidden block text-sm text-white/60 mb-1">Email</label>
            <Input
              id="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.email ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="phone" className="sr-only block text-sm text-white/60 mb-1">Phone</label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.phone ? 'border-red-500' : 'border-customInputBorder'}
              `}            
            />
            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="handicap" className="sr-only block text-sm text-white/60 mb-1">Average Score or Handicap</label>
            <Input
              id="handicap"
              name="handicap"
              placeholder="Handicap"
              value={formData.handicap}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.handicap ? 'border-red-500' : 'border-customInputBorder'}
              `}  
            />
            {formErrors.handicap && <p className="text-red-500 text-sm mt-1">{formErrors.handicap}</p>}
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
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.address ? 'border-red-500' : 'border-customInputBorder'}
              `}  
            />
            {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="city" className="sr-only block text-sm text-white/60 mb-1">City</label>
            <Input
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.city ? 'border-red-500' : 'border-customInputBorder'}
              `}  
            />
            {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="state" className="sr-only block text-sm text-white/60 mb-1">State</label>
            <Input
              id="state"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.state ? 'border-red-500' : 'border-customInputBorder'}
              `}  
            />
            {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="zip" className="sr-only block text-sm text-white/60 mb-1">Zip</label>
            <Input
              id="zip"
              name="zip"
              placeholder="Zip Code"
              value={formData.zip}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.zip ? 'border-red-500' : 'border-customInputBorder'}
              `}  
            />
            {formErrors.zip && <p className="text-red-500 text-sm mt-1">{formErrors.zip}</p>}
          </div>
        </div>

     {/* Banquet Info Group */}
     <div className="col-span-1">
        <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
        <div className="mt-3">
          <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
          <Select value={formData.banquet} onValueChange={(value) => handleSelectChange('banquet', value)}>
          <SelectTrigger className={`relative flex justify-start align-center w-full bg-customInputFill border p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg 
            ${formErrors.banquet ? 'border-red-500' : 'border-customInputBorder'}
          `}>
              <SelectValue placeholder="Will you attend the banquet? (1 ticket included with entry)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.banquet && <p className="text-red-500 text-sm mt-1">{formErrors.banquet}</p>}
        </div>
        <div className="mt-3">
          <label className="sr-only block text-sm text-white/60 mb-1">{
            `Additional Dinner Tickets (+$32.00 each)`
          }</label>
          <Select value={formData.dinnerTickets} onValueChange={(value) => handleSelectChange('dinnerTickets', value)}>
            <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
              <SelectValue placeholder={`Additional Dinner Tickets (+$32.00 each)`} />
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
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
              ${formErrors.shirtSize ? 'border-red-500' : 'border-customInputBorder'}
            `}  
          />
          {formErrors.shirtSize && <p className="text-red-500 text-sm mt-1">{formErrors.shirtSize}</p>}
        </div>
      </div>
    </>
  );
}