'use client';

import { Input } from '@/components/ui/input';
import { FormDataType } from '@/components/registration-form';

interface SponsorProductProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  formErrors: Record<string, string>;
}

export default function SponsorProductFields({
  formData,
  handleChange,
  formErrors
}: SponsorProductProps) {
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
                ${formErrors.player1Name ? 'border-red-500' : 'border-customInputBorder'}
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
        </div>
     </>
  );
}