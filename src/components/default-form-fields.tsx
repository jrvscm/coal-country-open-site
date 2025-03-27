'use client';

import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormDataType } from '@/components/registration-form';

interface DefaultFormFieldsProps {
  formData: {
    company: string;
    contactEmail?: string;
    contactPhone?: string;
    player1Name?: string;
    player1Handicap?: string;
    player1TShirtSize?: string;
    banquet: string;
    dinnerTickets: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  formErrors: Partial<FormDataType>;
}

export default function DefaultFormFields({
  formData,
  handleChange,
  handleSelectChange,
  formErrors
}: DefaultFormFieldsProps) {
  return (
    <>
        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY INFO</h3>
          <label htmlFor="company" className="sr-only block text-sm text-white/60 mb-1">Company Represented</label>
          <Input
            id="company"
            name="company"
            placeholder="Company Represented"
            value={formData.company}
            onChange={handleChange}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
              ${formErrors.company ? 'border-red-500' : 'border-customInputBorder'}
            `}          
          />
          {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
        </div>

        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">PERSONAL INFO</h3>
          <div className="mt-3">
            <label htmlFor="player1Name" className="sr-only hidden block text-sm text-white/60 mb-1">Name</label>
            <Input
              id="player1Name"
              name="player1Name"
              placeholder="Enter Your Name"
              value={formData.player1Name}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                ${formErrors.contactName ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player1Name && <p className="text-red-500 text-sm mt-1">{formErrors.player1Name}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="contactEmail" className="sr-only hidden block text-sm text-white/60 mb-1">Email</label>
            <Input
              id="contactEmail"
              name="contactEmail"
              placeholder="Enter Your Email"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                ${formErrors.contactEmail ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.contactEmail && <p className="text-red-500 text-sm mt-1">{formErrors.contactEmail}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="contactPhone" className="sr-only block text-sm text-white/60 mb-1">Phone</label>
            <Input
              id="contactPhone"
              name="contactPhone"
              placeholder="Phone Number"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                ${formErrors.contactPhone ? 'border-red-500' : 'border-customInputBorder'}
              `}            
            />
            {formErrors.contactPhone && <p className="text-red-500 text-sm mt-1">{formErrors.contactPhone}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player1Handicap" className="sr-only block text-sm text-white/60 mb-1">Average Score or Handicap</label>
            <Input
              id="player1Handicap"
              name="player1Handicap"
              placeholder="Handicap"
              value={formData.player1Handicap}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                ${formErrors.player1Handicap ? 'border-red-500' : 'border-customInputBorder'}
              `}  
            />
            {formErrors.player1Handicap && <p className="text-red-500 text-sm mt-1">{formErrors.player1Handicap}</p>}
          </div>
        </div>

     {/* Banquet Info Group */}
     <div className="col-span-2">
        <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
        <div className="mt-3">
          <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
          <Select value={formData.banquet} onValueChange={(value) => handleSelectChange('banquet', value)}>
          <SelectTrigger className={`relative flex justify-start align-center w-full bg-customInputFill border p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg text-lg 
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
            <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg text-lg">
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
      <div className="col-span-2">
        <h3 className="text-white/80 text-lg font-semibold mb-2">SIZING INFO</h3>
        <div className="mt-3">
          <label htmlFor="player1TShirtSize" className="sr-only block text-sm text-white/60 mb-1">Shirt Size</label>
          <Input
            id="player1TShirtSize"
            name="player1TShirtSize"
            placeholder="Enter Your Shirt Size"
            value={formData.player1TShirtSize}
            onChange={handleChange}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
              ${formErrors.player1TShirtSize ? 'border-red-500' : 'border-customInputBorder'}
            `}  
          />
          {formErrors.player1TShirtSize && <p className="text-red-500 text-sm mt-1">{formErrors.player1TShirtSize}</p>}
        </div>
      </div>
    </>
  );
}