'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import type { FormErrorsType } from '@/components/registration-form';
import { normalizeRegistrationInput } from '@/lib/registration-input-normalize';

type SegmentContributionFieldsProps = {
  instanceId: string;
  doorPrize: string;
  flagPrizeContribution: string;
  onPatch: (patch: { doorPrize?: string; flagPrizeContribution?: string }) => void;
  setFormErrors: Dispatch<SetStateAction<FormErrorsType>>;
  formErrors: FormErrorsType;
};

export default function SegmentContributionFields({
  instanceId,
  doorPrize,
  flagPrizeContribution,
  onPatch,
  setFormErrors,
  formErrors,
}: SegmentContributionFieldsProps) {
  const prefix = `segment.${instanceId}`;
  const err = (key: 'doorPrize' | 'flagPrizeContribution') => formErrors[`${prefix}.${key}`];

  return (
    <div className="col-span-2 mb-6">
      <h3 className="text-white/80 text-lg font-semibold mb-2">CONTRIBUTION INFO</h3>
      <div className="mt-3">
        <label htmlFor={`doorPrize-${instanceId}`} className="sr-only block text-sm text-white/60 mb-1">
          Door Prize Contribution
        </label>
        <Input
          id={`doorPrize-${instanceId}`}
          name="doorPrize"
          placeholder="Door Prize (please name)"
          value={doorPrize}
          onChange={(e) => {
            const next = normalizeRegistrationInput('doorPrize', e.target.value);
            onPatch({ doorPrize: next });
            setFormErrors((prev) => {
              const n = { ...prev };
              delete n[`${prefix}.doorPrize`];
              return n;
            });
          }}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
            ${err('doorPrize') ? 'border-red-500' : 'border-customInputBorder'}`}
        />
        {err('doorPrize') && <p className="text-red-500 text-sm mt-1">{err('doorPrize')}</p>}
      </div>
      <div className="mt-3">
        <label htmlFor={`flagPrizeContribution-${instanceId}`} className="sr-only block text-sm text-white/60 mb-1">
          Flag Prize Contribution
        </label>
        <Input
          id={`flagPrizeContribution-${instanceId}`}
          name="flagPrizeContribution"
          placeholder="Extra Flag Prize Contribution (optional)"
          value={flagPrizeContribution}
          onChange={(e) => {
            const next = normalizeRegistrationInput('flagPrizeContribution', e.target.value);
            onPatch({ flagPrizeContribution: next });
            setFormErrors((prev) => {
              const n = { ...prev };
              delete n[`${prefix}.flagPrizeContribution`];
              return n;
            });
          }}
          className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg text-lg
            ${err('flagPrizeContribution') ? 'border-red-500' : 'border-customInputBorder'}`}
        />
        {err('flagPrizeContribution') && (
          <p className="text-red-500 text-sm mt-1">{err('flagPrizeContribution')}</p>
        )}
      </div>
    </div>
  );
}
