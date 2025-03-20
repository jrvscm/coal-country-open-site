import React from 'react';
import { FormDataType } from '@/components/registration-form';

const EntrantRadioSelector: React.FC<{formData: FormDataType, handleChange: Function}> = (formData) => {
    console.log(formData)
    return (
    <>       
        {/* Participant Type */}
        <div className="order-2 md:order-1">
            {/** GENERAL PARTICIPANTS */}
            <h3 className="text-white/80 text-lg font-semibold mb-2">INDIVIDUAL PARTICIPANTS:</h3>
            <div className="space-y-1">
                {[
                { label: 'Current Miner', value: 'currentMiner' },
                { label: 'Past Board / Past Champion / Retiree', value: 'pastBoardPastChampionRetiree' },
                { label: 'General Public', value: 'generalPublic' },
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

            {/** SPONSORED PACKAGES */}
            <h3 className="mt-3 text-white/80 text-lg font-semibold mb-2">SPONSOR PACKAGES:</h3>
            <div className="space-y-1">
                {[
                { label: 'Platinum Sponsor Package', value: 'platinumSponsorship' },
                { label: 'Gold Sponsor Package', value: 'goldSponsorship' },
                { label: 'Silver Sponsor Package', value: 'silverSponsorship' },
                { label: 'Single Player Sponsor Entry', value: 'singlePlayerSponsorEntry' },
                { label: 'Single Team Sponsor Entry', value: 'teamSponsorEntry' }
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

            {/** INDIVIDUAL SPONSORSHIP ITEMS */}
            <h3 className="mt-3 text-white/80 text-lg font-semibold mb-2">INDIVIDUAL SPONSORSHIP ITEMS:</h3>
            <div className="space-y-1">
                {[
                { label: 'Tee Box Sponsor (You own the box!)', value: 'teeBoxSponsorship' },
                { label: 'Driving Range Sponsor', value: 'drivingRangeSponsorship' },
                { label: 'Hole Flag Sponsor', value: 'holeFlagSponsorship' },
                { label: 'Flag Prize Sponsor', value: 'flagPrizeSponsorship' }
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
     </>
    )
}

export default EntrantRadioSelector;
   