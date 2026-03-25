import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FormDataType } from '@/components/registration-form';
import SingleEntryFields from '@/components/single-entry-fields';
import { MdClose } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ADDITIONAL_DINNER_TICKET_PRICE_USD } from '@/lib/dinner-ticket-price';
import { uppercaseRegistrationText } from '@/lib/registration-input-normalize';

type FormErrorsType = Record<string, string>;

export type GolferRow = { name: string; handicap: string; tShirtSize: string };

interface GolfersFormProps {
  golfers: GolferRow[];
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  formData: FormDataType;
  maxGolfers: number;
  formErrors: Partial<FormDataType>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrorsType>>;
  /** Second+ sponsor package blocks: company/contact collected on first package only */
  rosterOnly?: boolean;
  segmentEntryId?: string;
  segmentBanquet?: string;
  segmentDinnerTickets?: string;
  onSegmentFieldChange?: (field: 'banquet' | 'dinnerTickets', value: string) => void;
  updateGolfers?: (updater: (prev: GolferRow[]) => GolferRow[]) => void;
  segmentTitle?: string;
}

const GolfersFormFields: React.FC<GolfersFormProps> = ({
  golfers,
  setFormData,
  maxGolfers,
  formErrors,
  formData,
  handleChange,
  handleSelectChange,
  setFormErrors,
  rosterOnly = false,
  segmentEntryId,
  segmentBanquet,
  segmentDinnerTickets,
  onSegmentFieldChange,
  updateGolfers,
  segmentTitle,
}) => {
  const golferErrorPrefix = segmentEntryId ? `segment.${segmentEntryId}.golfers` : 'golfers';

  const getError = (field: string): string | undefined => {
    return (formErrors as Record<string, string | undefined>)[field];
  };

  const applyGolfers = (updater: (prev: GolferRow[]) => GolferRow[]) => {
    if (updateGolfers) {
      updateGolfers(updater);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      golfers: updater(prev.golfers),
    }));
  };

  const addGolfer = () => {
    if (golfers.length < maxGolfers) {
      applyGolfers((prev) => [...prev, { name: "", handicap: "", tShirtSize: "" }]);
    }
  };

  const removeGolfer = (index: number) => {
    applyGolfers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGolferChange = (
    index: number,
    field: keyof GolferRow,
    value: string
  ) => {
    const fieldKey = `${golferErrorPrefix}.${index}.${field}`;
    const normalized =
      field === 'name' || field === 'handicap' || field === 'tShirtSize'
        ? uppercaseRegistrationText(value)
        : value;

    applyGolfers((prev) =>
      prev.map((golfer, i) => (i === index ? { ...golfer, [field]: normalized } : golfer)),
    );

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldKey];
      return newErrors;
    });
  };

  const mealFromSegment = Boolean(onSegmentFieldChange);
  const banquetValue = mealFromSegment ? (segmentBanquet ?? '') : formData.banquet;
  const dinnerValue = mealFromSegment ? (segmentDinnerTickets ?? '') : formData.dinnerTickets;
  const onBanquetChange = (v: string) => {
    if (onSegmentFieldChange) {
      onSegmentFieldChange('banquet', v);
    } else {
      handleSelectChange('banquet', v);
    }
  };
  const onDinnerChange = (v: string) => {
    if (onSegmentFieldChange) {
      onSegmentFieldChange('dinnerTickets', v);
    } else {
      handleSelectChange('dinnerTickets', v);
    }
  };

  const banquetErrorKey = segmentEntryId ? `segment.${segmentEntryId}.banquet` : 'banquet';
  const banquetError = segmentEntryId
    ? (formErrors as Record<string, string | undefined>)[banquetErrorKey]
    : formErrors.banquet;

  return (
    <>
        {segmentTitle ? (
          <h3 className="text-white/80 text-xl font-semibold mb-6">{segmentTitle}</h3>
        ) : null}
        {!rosterOnly && (
          <>
        <div className="col-span-2 mb-6">
            <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY NAME</h3>
            <label htmlFor="company" className="sr-only block text-sm text-white/60 mb-1">Company Name</label>
            <Input
              id="company"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                ${formErrors.company ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
        </div>

        <div className="col-span-2 mb-6">
          <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY CONTACT</h3>
          <div className="mt-3">
            <label htmlFor="contactName" className="sr-only hidden block text-sm text-white/60 mb-1">Contact Name</label>
            <Input
              id="contactName"
              name="contactName"
              placeholder="Contact Name"
              value={formData.contactName}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
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
              placeholder="(555) 555-5555"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
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
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                ${formErrors.contactEmail ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.contactEmail && <p className="text-red-500 text-sm mt-1">{formErrors.contactEmail}</p>}
          </div>
        </div>

        <SingleEntryFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
          </>
        )}

        <div className="col-span-2 mb-6">
            <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
            <div className="mt-3">
              <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
              <Select value={banquetValue} onValueChange={onBanquetChange}>
                <SelectTrigger className={`relative flex justify-start align-center w-full bg-customInputFill border p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg text-lg 
                  ${banquetError ? 'border-red-500' : 'border-customInputBorder'}
                `}>
                  <SelectValue placeholder={`Will attend the banquet? (${maxGolfers} tickets incl.)`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {banquetError && <p className="text-red-500 text-sm mt-1">{banquetError}</p>}
            </div>
            <div className="mt-3">
            <label className="sr-only block text-sm text-white/60 mb-1">
                {`Additional Dinner Tickets (+$${ADDITIONAL_DINNER_TICKET_PRICE_USD}.00 each)`}
            </label>
            <Select value={dinnerValue} onValueChange={onDinnerChange}>
                <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg text-lg">
                <SelectValue placeholder={`Additional Dinner Tickets (+$${ADDITIONAL_DINNER_TICKET_PRICE_USD}.00 each)`} />
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
            <div className="col-span-2 md:col-span-full relative mb-6" key={`${segmentEntryId ?? 'default'}-team-member-${index}`}>
                <h3 className="text-white/80 text-lg font-semibold mb-2">{`PLAYER ${index + 1}`}</h3>
                <div className="mt-3">
                    <label htmlFor={`player[${index + 1}Name]`} className="sr-only block text-sm text-white/60 mb-1">Player {index + 1} Name</label>
                    <Input
                        name={`player${index + 1}Name`}
                        placeholder={`Player ${index + 1} Name`}
                        value={golfers[index].name || ""}
                        onChange={(e) => handleGolferChange(index, 'name', e.target.value)}
                        className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                          ${getError(`${golferErrorPrefix}.${index}.name`) ? 'border-red-500' : 'border-customInputBorder'}
                        `}
                    />
                    {getError(`${golferErrorPrefix}.${index}.name`) && (
                      <p className="text-red-500 text-sm mt-1">{getError(`${golferErrorPrefix}.${index}.name`)}</p>
                    )}
                </div>
                <div className="mt-3">
                    <label htmlFor={`player${index + 1}Handicap`} className="sr-only block text-sm text-white/60 mb-1">Player {index + 1} Handicap</label>
                    <Input
                        name={`player${index + 1}Handicap`}
                        placeholder={`Player ${index + 1} Handicap`}
                        value={golfers[index].handicap || ""}
                        onChange={(e) => handleGolferChange(index, 'handicap', e.target.value)}
                        className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                          ${getError(`${golferErrorPrefix}.${index}.handicap`) ? 'border-red-500' : 'border-customInputBorder'}
                        `}
                    />
                    {getError(`${golferErrorPrefix}.${index}.handicap`) && (
                      <p className="text-red-500 text-sm mt-1">{getError(`${golferErrorPrefix}.${index}.handicap`)}</p>
                    )}
                </div>
                <div className="mt-3">
                    <label htmlFor={`player${index + 1}TShirtSize`} className="sr-only block text-sm text-white/60 mb-1">Player {index + 1} T-Shirt Size</label>
                    <Input
                        name={`player${index + 1}TShirtSize`}
                        placeholder={`Player ${index + 1} T-Shirt Size`}
                        value={golfers[index].tShirtSize || ""}
                        onChange={(e) => handleGolferChange(index, 'tShirtSize', e.target.value)}
                        className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
                          ${getError(`${golferErrorPrefix}.${index}.tShirtSize`) ? 'border-red-500' : 'border-customInputBorder'}
                        `}
                    />
                    {getError(`${golferErrorPrefix}.${index}.tShirtSize`) && (
                      <p className="text-red-500 text-sm mt-1">{getError(`${golferErrorPrefix}.${index}.tShirtSize`)}</p>
                    )}
                </div>
                {index > 0 && (
                    <Button
                    type="button"
                    onClick={() => removeGolfer(index)}
                    className="
                      absolute right-0 top-0 justify-self-end text-white/80 
                      hover:text-white/30 bg-transparent hover:bg-transparent p-0
                      hover:border-customInputBorder/50
                    "
                    >
                      <MdClose style={{height: '24px', width: '24px'}}/>
                    </Button>
                )}
            </div>
        ))}

        {golfers.length < maxGolfers && (
            <Button
            type="button"
            onClick={addGolfer}
            className="w-[fit-content] text-sm bg-customPrimary text-white px-4 py-2 hover:bg-customPrimary/80"
            >
              <TiUserAddOutline style={{height: '100%', width: 'auto'}}/>
            </Button>
        )}
    </>
  );
};

export default GolfersFormFields;
