'use client';

import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { FormErrorsType } from '@/components/registration-form';
import type { SegmentFieldState } from '@/lib/registration-segments';
import { ADDITIONAL_DINNER_TICKET_PRICE_USD } from '@/lib/dinner-ticket-price';
import SegmentContributionFields from '@/components/segment-contribution-fields';
import { formatUsPhoneInput, uppercaseRegistrationText } from '@/lib/registration-input-normalize';

type TeamSegmentFieldsProps = {
  instanceId: string;
  segment: SegmentFieldState;
  onPatch: (patch: Partial<SegmentFieldState>) => void;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrorsType>>;
  formErrors: FormErrorsType;
};

export default function TeamSegmentFields({
  instanceId,
  segment,
  onPatch,
  setFormErrors,
  formErrors,
}: TeamSegmentFieldsProps) {
  const p = (i: number) => segment.golfers[i] || { name: '', handicap: '', tShirtSize: '' };
  const err = (key: string) => formErrors[`segment.${instanceId}.${key}`];

  const setGolfer = (index: number, field: 'name' | 'handicap' | 'tShirtSize', value: string) => {
    const next = [...segment.golfers];
    while (next.length < 3) next.push({ name: '', handicap: '', tShirtSize: '' });
    const g = { ...next[index], [field]: value };
    next[index] = g;
    onPatch({ golfers: next });
    setFormErrors((prev) => {
      const n = { ...prev };
      delete n[`segment.${instanceId}.golfers.${index}.${field}`];
      return n;
    });
  };

  return (
    <>
      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">COMPANY NAME</h3>
        <Input
          id={`company-${instanceId}`}
          placeholder="Company"
          value={segment.company ?? ''}
          onChange={(e) => {
            onPatch({ company: uppercaseRegistrationText(e.target.value) });
            setFormErrors((prev) => {
              const n = { ...prev };
              delete n[`segment.${instanceId}.company`];
              return n;
            });
          }}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-lg text-lg
            ${err('company') ? 'border-red-500' : 'border-customInputBorder'}`}
        />
        {err('company') && <p className="text-red-500 text-sm mt-1">{err('company')}</p>}
      </div>

      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">TEAM NAME</h3>
        <Input
          id={`teamName-${instanceId}`}
          placeholder="Team Name"
          value={segment.teamName ?? ''}
          onChange={(e) => {
            onPatch({ teamName: uppercaseRegistrationText(e.target.value) });
            setFormErrors((prev) => {
              const n = { ...prev };
              delete n[`segment.${instanceId}.teamName`];
              return n;
            });
          }}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
            ${err('teamName') ? 'border-red-500' : 'border-customInputBorder'}`}
        />
        {err('teamName') && <p className="text-red-500 text-sm mt-1">{err('teamName')}</p>}
      </div>

      {[0, 1, 2].map((i) => (
        <div key={i} className="col-span-2 mb-6">
          <h3 className="text-white/80 text-lg font-semibold mb-2">{`PLAYER ${i + 1}`}</h3>
          <div className="mt-3">
            <Input
              placeholder={`Player ${i + 1} Name`}
              value={p(i).name}
              onChange={(e) => setGolfer(i, 'name', uppercaseRegistrationText(e.target.value))}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
                ${err(`golfers.${i}.name`) ? 'border-red-500' : 'border-customInputBorder'}`}
            />
            {err(`golfers.${i}.name`) && <p className="text-red-500 text-sm mt-1">{err(`golfers.${i}.name`)}</p>}
          </div>
          <div className="mt-3">
            <Input
              placeholder={`Player ${i + 1} Handicap`}
              value={p(i).handicap}
              onChange={(e) => setGolfer(i, 'handicap', uppercaseRegistrationText(e.target.value))}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
                ${err(`golfers.${i}.handicap`) ? 'border-red-500' : 'border-customInputBorder'}`}
            />
            {err(`golfers.${i}.handicap`) && <p className="text-red-500 text-sm mt-1">{err(`golfers.${i}.handicap`)}</p>}
          </div>
          <div className="mt-3">
            <Input
              placeholder={`Player ${i + 1} T-Shirt Size`}
              value={p(i).tShirtSize}
              onChange={(e) => setGolfer(i, 'tShirtSize', uppercaseRegistrationText(e.target.value))}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
                ${err(`golfers.${i}.tShirtSize`) ? 'border-red-500' : 'border-customInputBorder'}`}
            />
            {err(`golfers.${i}.tShirtSize`) && <p className="text-red-500 text-sm mt-1">{err(`golfers.${i}.tShirtSize`)}</p>}
          </div>
        </div>
      ))}

      <div className="col-span-2 mb-6">
        <h3 className="text-white/80 text-lg font-semibold mb-2">TEAM CONTACT</h3>
        <div className="mt-3">
          <Input
            placeholder="Team Contact Name"
            value={segment.contactName ?? ''}
            onChange={(e) => {
              onPatch({ contactName: uppercaseRegistrationText(e.target.value) });
              setFormErrors((prev) => {
                const n = { ...prev };
                delete n[`segment.${instanceId}.contactName`];
                return n;
              });
            }}
            className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-lg text-lg
              ${err('contactName') ? 'border-red-500' : 'border-customInputBorder'}`}
          />
          {err('contactName') && <p className="text-red-500 text-sm mt-1">{err('contactName')}</p>}
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
            placeholder="Team Contact Email"
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
              <SelectValue placeholder="Will attend the banquet? (3 tickets incl.)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {err('banquet') && <p className="text-red-500 text-sm mt-1">{err('banquet')}</p>}
        </div>
        <div className="mt-3">
          <Select
            value={segment.dinnerTickets}
            onValueChange={(v) => onPatch({ dinnerTickets: v })}
          >
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
