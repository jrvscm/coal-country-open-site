'use client';

import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { FormErrorsType } from '@/components/registration-form';
import type { SegmentFieldState } from '@/lib/registration-segments';
import { ADDITIONAL_DINNER_TICKET_PRICE_USD } from '@/lib/dinner-ticket-price';
import SegmentContributionFields from '@/components/segment-contribution-fields';
import { formatUsPhoneInput, uppercaseRegistrationText } from '@/lib/registration-input-normalize';

type SinglePlayerSegmentFieldsProps = {
  instanceId: string;
  segment: SegmentFieldState;
  onPatch: (patch: Partial<SegmentFieldState>) => void;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrorsType>>;
  formErrors: FormErrorsType;
};

export default function SinglePlayerSegmentFields({
  instanceId,
  segment,
  onPatch,
  setFormErrors,
  formErrors,
}: SinglePlayerSegmentFieldsProps) {
  const g0 = segment.golfers[0] || { name: '', handicap: '', tShirtSize: '' };
  const err = (key: string) => formErrors[`segment.${instanceId}.${key}`];

  const setG0 = (field: 'name' | 'handicap' | 'tShirtSize', value: string) => {
    onPatch({ golfers: [{ ...g0, [field]: value }] });
    setFormErrors((prev) => {
      const n = { ...prev };
      delete n[`segment.${instanceId}.golfers.0.${field}`];
      if (field === 'name') delete n[`segment.${instanceId}.player1Name`];
      return n;
    });
  };

  return (
    <>
      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY INFO</h3>
        <Input
          id={`sp-company-${instanceId}`}
          placeholder="Company Represented"
          value={segment.company ?? ''}
          onChange={(e) => {
            onPatch({ company: uppercaseRegistrationText(e.target.value) });
            setFormErrors((prev) => {
              const n = { ...prev };
              delete n[`segment.${instanceId}.company`];
              return n;
            });
          }}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
            ${err('company') ? 'border-red-500' : 'border-customInputBorder'}`}
        />
        {err('company') && <p className="text-red-500 text-sm mt-1">{err('company')}</p>}
      </div>

      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">PERSONAL INFO</h3>
        <div className="mt-3">
          <Input
            placeholder="Enter Your Name"
            value={g0.name}
            onChange={(e) => setG0('name', uppercaseRegistrationText(e.target.value))}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('golfers.0.name') || err('player1Name') ? 'border-red-500' : 'border-customInputBorder'}`}
          />
          {(err('golfers.0.name') || err('player1Name')) && (
            <p className="text-red-500 text-sm mt-1">{err('golfers.0.name') || err('player1Name')}</p>
          )}
        </div>
        <div className="mt-3">
          <Input
            placeholder="Enter Your Email"
            value={segment.contactEmail ?? ''}
            onChange={(e) => {
              onPatch({ contactEmail: e.target.value });
              setFormErrors((prev) => {
                const n = { ...prev };
                delete n[`segment.${instanceId}.contactEmail`];
                return n;
              });
            }}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('contactEmail') ? 'border-red-500' : 'border-customInputBorder'}`}
          />
          {err('contactEmail') && <p className="text-red-500 text-sm mt-1">{err('contactEmail')}</p>}
        </div>
        <div className="mt-3">
          <Input
            placeholder="(555) 555-5555"
            value={segment.contactPhone ?? ''}
            onChange={(e) => {
              onPatch({ contactPhone: formatUsPhoneInput(e.target.value) });
              setFormErrors((prev) => {
                const n = { ...prev };
                delete n[`segment.${instanceId}.contactPhone`];
                return n;
              });
            }}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('contactPhone') ? 'border-red-500' : 'border-customInputBorder'}`}
          />
          {err('contactPhone') && <p className="text-red-500 text-sm mt-1">{err('contactPhone')}</p>}
        </div>
        <div className="mt-3">
          <Input
            placeholder="Handicap"
            value={g0.handicap}
            onChange={(e) => setG0('handicap', uppercaseRegistrationText(e.target.value))}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('golfers.0.handicap') || err('player1Handicap') ? 'border-red-500' : 'border-customInputBorder'}`}
          />
          {(err('golfers.0.handicap') || err('player1Handicap')) && (
            <p className="text-red-500 text-sm mt-1">{err('golfers.0.handicap') || err('player1Handicap')}</p>
          )}
        </div>
      </div>

      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
        <div className="mt-3">
          <Select
            value={segment.banquet}
            onValueChange={(v) => {
              onPatch({ banquet: v });
              setFormErrors((prev) => {
                const n = { ...prev };
                delete n[`segment.${instanceId}.banquet`];
                return n;
              });
            }}
          >
            <SelectTrigger
              className={`relative flex w-full bg-customInputFill border p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('banquet') ? 'border-red-500' : 'border-customInputBorder'}`}
            >
              <SelectValue placeholder="Will you attend the banquet? (1 ticket included with entry)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {err('banquet') && <p className="text-red-500 text-sm mt-1">{err('banquet')}</p>}
        </div>
        <div className="mt-3">
          <Select value={segment.dinnerTickets} onValueChange={(v) => onPatch({ dinnerTickets: v })}>
            <SelectTrigger className="relative flex w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg">
              <SelectValue
                placeholder={`Additional Dinner Tickets (+$${ADDITIONAL_DINNER_TICKET_PRICE_USD}.00 each)`}
              />
            </SelectTrigger>
            <SelectContent>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">SIZING INFO</h3>
        <div className="mt-3">
          <Input
            placeholder="Enter Your Shirt Size"
            value={g0.tShirtSize}
            onChange={(e) => setG0('tShirtSize', uppercaseRegistrationText(e.target.value))}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('golfers.0.tShirtSize') || err('player1TShirtSize') ? 'border-red-500' : 'border-customInputBorder'}`}
          />
          {(err('golfers.0.tShirtSize') || err('player1TShirtSize')) && (
            <p className="text-red-500 text-sm mt-1">{err('golfers.0.tShirtSize') || err('player1TShirtSize')}</p>
          )}
        </div>
      </div>

      <SegmentContributionFields
        instanceId={instanceId}
        doorPrize={segment.doorPrize ?? ''}
        flagPrizeContribution={segment.flagPrizeContribution ?? ''}
        onPatch={onPatch}
        setFormErrors={setFormErrors}
        formErrors={formErrors}
      />
    </>
  );
}
