'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { SegmentFieldState } from '@/lib/registration-segments';
import { ADDITIONAL_DINNER_TICKET_PRICE_USD } from '@/lib/dinner-ticket-price';
import { formatUsPhoneInput, uppercaseRegistrationText } from '@/lib/registration-input-normalize';
import type { FormErrorsType } from '@/components/registration-form';
import SegmentContributionFields from '@/components/segment-contribution-fields';

type IndividualSegmentFieldsProps = {
  segmentId: string;
  segmentTitle: string;
  segment: SegmentFieldState;
  onSegmentChange: (segmentId: string, patch: Partial<SegmentFieldState>) => void;
  setFormErrors: Dispatch<SetStateAction<FormErrorsType>>;
  formErrors: FormErrorsType;
};

export default function IndividualSegmentFields({
  segmentId,
  segmentTitle,
  segment,
  onSegmentChange,
  setFormErrors,
  formErrors,
}: IndividualSegmentFieldsProps) {
  const p = segment.golfers[0] || { name: '', handicap: '', tShirtSize: '' };
  const prefix = `segment.${segmentId}`;

  const err = (key: string) => formErrors[`${prefix}.${key}`];

  return (
    <div className="col-span-2 space-y-6">
      <h3 className="text-white/80 text-xl font-semibold">{segmentTitle}</h3>

      <div className="col-span-2 mb-2">
        <h4 className="text-white/80 text-lg font-semibold mb-2">COMPANY INFO</h4>
        <Input
          name={`${segmentId}-company`}
          placeholder="Company Represented"
          value={segment.company ?? ''}
          onChange={(e) => onSegmentChange(segmentId, { company: uppercaseRegistrationText(e.target.value) })}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-lg text-lg
            ${err('company') ? 'border-red-500' : ''}`}
        />
        {err('company') && <p className="text-red-500 text-sm mt-1">{err('company')}</p>}
      </div>

      <div className="space-y-3">
        <h4 className="text-white/80 text-lg font-semibold mb-2">CONTACT</h4>
        <Input
          placeholder="Email"
          value={segment.contactEmail ?? ''}
          onChange={(e) => onSegmentChange(segmentId, { contactEmail: e.target.value })}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
            ${err('contactEmail') ? 'border-red-500' : ''}`}
        />
        {err('contactEmail') && <p className="text-red-500 text-sm">{err('contactEmail')}</p>}
        <Input
          placeholder="(555) 555-5555"
          value={segment.contactPhone ?? ''}
          onChange={(e) => onSegmentChange(segmentId, { contactPhone: formatUsPhoneInput(e.target.value) })}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
            ${err('contactPhone') ? 'border-red-500' : ''}`}
        />
        {err('contactPhone') && <p className="text-red-500 text-sm">{err('contactPhone')}</p>}
      </div>

      <div>
        <h4 className="text-white/80 text-lg font-semibold mb-2">PLAYER</h4>
        <Input
          placeholder="Name"
          value={p.name}
          onChange={(e) =>
            onSegmentChange(segmentId, {
              golfers: [{ ...p, name: uppercaseRegistrationText(e.target.value) }],
            })
          }
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 mb-3 placeholder:text-lg text-lg
            ${err('golfers.0.name') ? 'border-red-500' : ''}`}
        />
        {err('golfers.0.name') && <p className="text-red-500 text-sm mb-2">{err('golfers.0.name')}</p>}
        <Input
          placeholder="Handicap"
          value={p.handicap}
          onChange={(e) =>
            onSegmentChange(segmentId, {
              golfers: [{ ...p, handicap: uppercaseRegistrationText(e.target.value) }],
            })
          }
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 mb-3 placeholder:text-lg text-lg
            ${err('golfers.0.handicap') ? 'border-red-500' : ''}`}
        />
        {err('golfers.0.handicap') && <p className="text-red-500 text-sm mb-2">{err('golfers.0.handicap')}</p>}
        <Input
          placeholder="T-Shirt Size"
          value={p.tShirtSize}
          onChange={(e) =>
            onSegmentChange(segmentId, {
              golfers: [{ ...p, tShirtSize: uppercaseRegistrationText(e.target.value) }],
            })
          }
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
            ${err('golfers.0.tShirtSize') ? 'border-red-500' : ''}`}
        />
        {err('golfers.0.tShirtSize') && <p className="text-red-500 text-sm mt-1">{err('golfers.0.tShirtSize')}</p>}
      </div>

      <div>
        <h4 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h4>
        <Select
          value={segment.banquet}
          onValueChange={(v) => onSegmentChange(segmentId, { banquet: v })}
        >
          <SelectTrigger className={`relative flex w-full bg-customInputFill border p-6 rounded-xl text-white/60 ${err('banquet') ? 'border-red-500' : 'border-customInputBorder'}`}>
            <SelectValue placeholder="Will you attend the banquet? (1 ticket included)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
        {err('banquet') && <p className="text-red-500 text-sm mt-1">{err('banquet')}</p>}
        <label className="sr-only mt-3 block">Additional dinner tickets</label>
        <Select
          value={segment.dinnerTickets}
          onValueChange={(v) => onSegmentChange(segmentId, { dinnerTickets: v })}
        >
          <SelectTrigger className="relative flex w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 mt-3">
            <SelectValue placeholder={`Additional Dinner Tickets (+$${ADDITIONAL_DINNER_TICKET_PRICE_USD}.00 each)`} />
          </SelectTrigger>
          <SelectContent>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SegmentContributionFields
        instanceId={segmentId}
        doorPrize={segment.doorPrize ?? ''}
        flagPrizeContribution={segment.flagPrizeContribution ?? ''}
        onPatch={(patch) => onSegmentChange(segmentId, patch)}
        setFormErrors={setFormErrors}
        formErrors={formErrors}
      />
    </div>
  );
}
