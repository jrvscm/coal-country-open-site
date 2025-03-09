// SingleEntryFields.js
'use client';

import { Input } from '@/components/ui/input';

export default function SingleEntryFields({ formData, handleChange, handleSelectChange, formErrors }) {
  return (
    <>
        <div className="col-span-1">
            <h3 className="text-white/80 text-lg font-semibold mb-2">CONTRIBUTION INFO</h3>
            <div className="mt-3">
                <label htmlFor="state" className="sr-only block text-sm text-white/60 mb-1">Door Prize Contribution</label>
                <Input
                id="state"
                name="state"
                placeholder="Door Prize (please name)"
                value={formData.doorPrize}
                onChange={handleChange}
                className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                    ${formErrors.doorPrize ? 'border-red-500' : 'border-customInputBorder'}
                `}  
                />
                {formErrors.doorPrize && <p className="text-red-500 text-sm mt-1">{formErrors.doorPrize}</p>}
            </div>
            <div className="mt-3">
                <label htmlFor="flagPrizeContribution" className="sr-only block text-sm text-white/60 mb-1">Flag Prize Contribution</label>
                <Input
                id="flagPrizeContribution"
                name="flagPrizeContribution"
                placeholder="Extra Flag Prize Contribution (optional)"
                value={formData.flagPrizeContribution}
                onChange={handleChange}
                className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                    ${formErrors.flagPrizeContribution ? 'border-red-500' : 'border-customInputBorder'}
                `}  
                />
                {formErrors.flagPrizeContribution && <p className="text-red-500 text-sm mt-1">{formErrors.flagPrizeContribution}</p>}
            </div>
        </div>
    </>
  );
}