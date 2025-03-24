import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormDataType from '@/components/registration-form';
import SingleEntryFields from '@/components/single-entry-fields';
import { MdClose } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GolfersFormProps {
  golfers: { name: string, handicap: string, tShirtSize: string }[];
  setFormData: (data: any) => void;
  formData: FormDataType;
  maxGolfers: number;
  formErrors: Partial<FormDataType>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setFormErrors: (data: Partial<FormDataType> | ((prev: Partial<FormDataType>) => Partial<FormDataType>)) => void;
}

const GolfersFormFields: React.FC<GolfersFormProps> = ({ golfers, setFormData, maxGolfers, formErrors, formData, handleChange, handleSelectChange, setFormErrors }) => {
  
  // Add Golfer
  const addGolfer = () => {
    if (golfers.length < maxGolfers) {
      setFormData((prev: any) => ({
        ...prev,
        golfers: [...prev.golfers, { name: "" }],
      }));
    }
  };

  // Remove Golfer
  const removeGolfer = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      golfers: prev.golfers.filter((_, i) => i !== index),
    }));
  };

  const handleGolferChange = (index: number, field: keyof GolfersFormProps["golfers"][0], value: string) => {
    const fieldKey = `golfers.${index}.${field}`;
  
    setFormData((prev: any) => ({
      ...prev,
      golfers: prev.golfers.map((golfer: any, i: number) =>
        i === index ? { ...golfer, [field]: value } : golfer
      ),
    }));
  
    setFormErrors((prevErrors: any) => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldKey];
      return newErrors;
    });
  };

  return (
    <>
        <div className="col-span-2">
            <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY NAME</h3>
            <label htmlFor="company" className="sr-only block text-sm text-white/60 mb-1">Company Name</label>
            <Input
              id="company"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.company ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
        </div>

        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY CONTACT</h3>
          <div className="mt-3">
            <label htmlFor="contactName" className="sr-only hidden block text-sm text-white/60 mb-1">Contact Name</label>
            <Input
              id="contactName"
              name="contactName"
              placeholder="Contact Name"
              value={formData.contactName}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.contactName ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.contactName && <p className="text-red-500 text-sm mt-1">{formErrors.contactName}</p>}
          </div>

          <div className="mt-3">
            <label htmlFor="contactPhone" className="sr-only hidden block text-sm text-white/60 mb-1">Contact Phone</label>
            <Input
              id="contactPhone"
              name="contactPhone"
              placeholder="Contact Phone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.contactPhone? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.contactPhone && <p className="text-red-500 text-sm mt-1">{formErrors.contactPhone}</p>}
          </div>

          <div className="mt-3">
            <label htmlFor="contactEmail" className="sr-only hidden block text-sm text-white/60 mb-1">Contact Email</label>
            <Input
              id="contactEmail"
              name="contactEmail"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.contactEmail ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.contactEmail && <p className="text-red-500 text-sm mt-1">{formErrors.contactEmail}</p>}
          </div>
        </div>

        <SingleEntryFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />

        <div className="col-span-2">
            <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
            <div className="mt-3">
              <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
              <Select value={formData.banquet} onValueChange={(value) => handleSelectChange('banquet', value)}>
                <SelectTrigger className={`relative flex justify-start align-center w-full bg-customInputFill border p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg 
                  ${formErrors.banquet ? 'border-red-500' : 'border-customInputBorder'}
                `}>
                  <SelectValue placeholder={`Will attend the banquet? (${maxGolfers} tickets incl.)`} />
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

        {golfers.map((golfer, index) => (
            <div className="col-span-2" key={`team-member-${index}`}>
                <h3 className="text-white/80 text-lg font-semibold mb-2">{`PLAYER ${index + 1}`}</h3>
                <div className="mt-3">
                    <label htmlFor={`player[${index + 1}Name]`} className="sr-only block text-sm text-white/60 mb-1">Player {index + 1} Name</label>
                    <Input
                        name={`player${index + 1}Name`}
                        placeholder={`Player ${index + 1} Name`}
                        value={golfers[index].name || ""}
                        onChange={(e) => handleGolferChange(index, 'name', e.target.value)}
                        className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                            ${formErrors[`golfers.${index}.name`] ? 'border-red-500' : 'border-customInputBorder'}
                        `}
                    />
                    {formErrors[`golfers.${index}.name`] && <p className="text-red-500 text-sm mt-1">{formErrors[`golfers.${index}.name`]}</p>}
                </div>
                <div className="mt-3">
                    <label htmlFor={`player${index + 1}Handicap`} className="sr-only block text-sm text-white/60 mb-1">Player {index + 1} Handicap</label>
                    <Input
                        name={`player${index + 1}Handicap`}
                        placeholder={`Player ${index + 1} Handicap`}
                        value={golfers[index].handicap || ""}
                        onChange={(e) => handleGolferChange(index, 'handicap', e.target.value)}
                        className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                            ${formErrors[`golfers.${index}.handicap`] ? 'border-red-500' : 'border-customInputBorder'}
                        `}
                    />
                    {formErrors[`golfers.${index}.handicap`] && <p className="text-red-500 text-sm mt-1">{formErrors[`golfers.${index}.handicap`]}</p>}
                </div>
                <div className="mt-3">
                    <label htmlFor={`player${index + 1}TShirtSize`} className="sr-only block text-sm text-white/60 mb-1">Player {index + 1} T-Shirt Size</label>
                    <Input
                        name={`player${index + 1}TShirtSize`}
                        placeholder={`Player ${index + 1} T-Shirt Size`}
                        value={golfers[index].tShirtSize || ""}
                        onChange={(e) => handleGolferChange(index, 'tShirtSize', e.target.value)}
                        className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                            ${formErrors[`golfers.${index}.tShirtSize`] ? 'border-red-500' : 'border-customInputBorder'}
                        `}
                    />
                    {formErrors[`golfers.${index}.tShirtSize`] && <p className="text-red-500 text-sm mt-1">{formErrors[`golfers.${index}.tShirtSize`]}</p>}
                </div>
                {index > 0 && (
                    <Button
                    type="button"
                    onClick={() => removeGolfer(index)}
                    className="mt-2 text-sm text-white/80 hover:text-white/30 bg-transparent hover:bg-transparent 
                      border border-customInputBorder rounded-lg
                      hover:border-customInputBorder/50
                    "
                    >
                      <MdClose /> Delete Player
                    </Button>
                )}
            </div>
        ))}
                   
        {/* Add Golfer Button */}
        <div className="col-span-2">
            {golfers.length < maxGolfers && (
                <Button
                type="button"
                onClick={addGolfer}
                className="bg-customPrimary text-white px-4 py-2 rounded-lg hover:bg-customPrimary/80"
                >
                <TiUserAddOutline /> Add Golfer
                </Button>
            )}
        </div>
    </>
  );
};

export default GolfersFormFields;
