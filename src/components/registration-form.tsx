'use client';

import { Suspense } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { FaLock, FaRegCheckCircle } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import SingleEntryFields from '@/components/single-entry-fields';
import TeamSegmentFields from '@/components/team-segment-fields';
import SinglePlayerSegmentFields from '@/components/single-player-segment-fields';
import SponsorProductsFields from '@/components/sponsor-products-fields';
import { stripePromise } from '@/lib/stripe';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTournamentDate } from '@/context/TournamentDateContext';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import GolfersFormFields from '@/components/golfers-form-fields';
import IndividualSegmentFields from '@/components/individual-segment-fields';
import { getTournamentPricingConfig } from '@/lib/contentful';
import {
  golferSlotsForEntryId,
  sponsorPackageIds as regSponsorPackageIds,
  sponsorProductIds as regSponsorProductIds,
} from '@/lib/registration-selection';
import {
  emptySegmentFieldStateForSlots,
  masterColumnCParticipantType,
  type PersistedRegistrationSegment,
  type SegmentFieldState,
} from '@/lib/registration-segments';
import { ADDITIONAL_DINNER_TICKET_PRICE_USD } from '@/lib/dinner-ticket-price';
import { normalizeRegistrationInput } from '@/lib/registration-input-normalize';
import store from 'store';
import { v4 as uuidv4 } from 'uuid';

export type Golfer = {
  name: string;
  handicap: string;
  tShirtSize: string;
};

export type FormErrorsType = {
  [key: string]: string;
};

export type FormDataType = {
  golfers: Array<Golfer>;
  company: string;
  banquet: string;
  dinnerTickets: string;
  participantType: string;
  doorPrize?: string;
  flagPrizeContribution?: string;
  teamName?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  player1Name?: string;
  player2Name?: string;
  player3Name?: string;
  player1Handicap?: string;
  player2Handicap?: string;
  player3Handicap?: string;
  player1TShirtSize?: string;
  player2TShirtSize?: string;
  player3TShirtSize?: string;
  selectedProductIds?: string[];
  segments?: PersistedRegistrationSegment[];
};

type RegistrationStoreData = {
  uid: string;
  formData: FormDataType;
};

type CheckoutItemCategory = 'individual' | 'sponsor' | 'product' | 'addon';

type CheckoutItem = {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  category: CheckoutItemCategory;
};

type ProductAvailability = {
  id: string;
  limit: number;
  purchased: number;
  remaining: number;
  soldOut: boolean;
};

const sponsorPackageIds = [...regSponsorPackageIds] as unknown as string[];
const sponsorProductIds = [...regSponsorProductIds] as unknown as string[];

const MAX_PACKAGE_QTY = 20;
const MAX_PRODUCT_QTY = 10;

function effectivePackageQty(entryId: string, packageQuantities: Record<string, number>): number {
  return Math.min(MAX_PACKAGE_QTY, Math.max(1, packageQuantities[entryId] ?? 1));
}

/** Website sponsorship is always a single slot — no quantity selector. */
function effectiveProductQty(productId: string, productQuantities: Record<string, number>): number {
  if (productId === 'websiteSponsorship') return 1;
  return Math.min(MAX_PRODUCT_QTY, Math.max(1, productQuantities[productId] ?? 1));
}

function optionHasDisclaimer(opt: { subText?: string | null; highlightText?: string | null } | undefined): boolean {
  return Boolean(opt?.subText?.length || opt?.highlightText?.length);
}

function RegistrationOptionDisclaimer({
  option,
}: {
  option?: { subText?: string | null; highlightText?: string | null };
}) {
  if (!option || !optionHasDisclaimer(option)) return null;
  return (
    <div className="bg-black/50 mb-6 text-customInputBorder p-3 text-sm md:text-lg rounded-lg space-y-4">
      {option.subText && <div dangerouslySetInnerHTML={{ __html: option.subText }} />}
      {option.highlightText && (
        <div
          dangerouslySetInnerHTML={{
            __html: `<p class="p-3 mt-3 text-sm md:text-lg bg-customYellow text-secondary-foreground font-bold rounded-lg">${option.highlightText}</p>`,
          }}
        />
      )}
    </div>
  );
}

export default function RegistrationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/*
      HARDCODED: Registration is currently closed
      <div className="bg-customBackground rounded-lg max-w-[1200px] m-auto py-24 px-8 mt-32">
        <div className="text-center">
          <div className="text-white/80 text-4xl font-bold mb-8">Registration Closed</div>
          <div className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Registration for this year&apos;s tournament has ended. Please check back next year for registration details.
          </div>
        </div>
      </div>
      */}

      <RegistrationFormContent />
    </Suspense>
  );
}

function RegistrationFormContent() {
        const tournamentStartDate = useTournamentDate();
        const params = useSearchParams();
        const path = usePathname();
        const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'canceled'>('idle');
        const [pricingData, setPricingData] = useState<PricingOption[]>([]);
        const [selectedEntryPackages, setSelectedEntryPackages] = useState<string[]>([]);
        const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
        const [packageQuantities, setPackageQuantities] = useState<Record<string, number>>({});
        const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
        const [segmentFields, setSegmentFields] = useState<Record<string, SegmentFieldState>>({});

        useEffect(() => {
          const fetchPricing = async () => {
            const config = await getTournamentPricingConfig();

            if (Array.isArray(config)) {
              setPricingData(config as PricingOption[]);

              const newBasePrices: Record<string, number> = {};
              config.forEach((item) => {
                if (item && typeof item === 'object' && 'id' in item && 'price' in item) {
                  newBasePrices[item.id as string] = item.price as number;
                }
              });
              setBasePrices(newBasePrices);
            } else {
              console.error("Invalid pricing config received:", config);
            }
          };

          fetchPricing();
        }, []);

        const [basePrices, setBasePrices] = useState<Record<string, number>>({});

        const defaultFormState = useMemo<FormDataType>(() => ({
          golfers: Array(3).fill({ name: "", handicap: "", tShirtSize: "" }),
          company: '',
          handicap: '',
          banquet: '',
          dinnerTickets: '',
          participantType: '',
          doorPrize: '',
          flagPrizeContribution: '',
          teamName: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          player1Name: '',
          player2Name: '',
          player3Name: '',
          player1Handicap: '',
          player2Handicap: '',
          player3Handicap: '',
          player1TShirtSize: '',
          player2TShirtSize: '',
          player3TShirtSize: '',
        }), [path]);

        const [formData, setFormData] = useState<FormDataType>(defaultFormState);
        const [formErrors, setFormErrors] = useState<FormErrorsType>({} as FormErrorsType);
        const [totalPrice, setTotalPrice] = useState(0);
        const [stripeFee, setStripeFee] = useState(0);
        const [loading, setLoading] = useState(false);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const handicapRegex = /^[+-]?\d+(\.\d{1,2})?$/;
        const flagPrizeRegex = useMemo(() => (/^\d+$/), [])

        const [productAvailability, setProductAvailability] = useState<Record<string, ProductAvailability>>({});

        const selectedOptionIds = useMemo(() => {
          return Array.from(new Set([...selectedEntryPackages, ...selectedProducts]));
        }, [selectedEntryPackages, selectedProducts]);

        const lineInstances = useMemo(() => {
          const out: { instanceId: string; entryId: string }[] = [];
          for (const entryId of selectedEntryPackages) {
            const slots = golferSlotsForEntryId(entryId, pricingData);
            if (slots <= 0) continue;
            const q = effectivePackageQty(entryId, packageQuantities);
            for (let i = 0; i < q; i++) {
              out.push({ instanceId: `${entryId}::${i}`, entryId });
            }
          }
          return out;
        }, [selectedEntryPackages, pricingData, packageQuantities]);

        useEffect(() => {
          setSegmentFields((prev) => {
            const next = { ...prev };
            const validIds = new Set(lineInstances.map((l) => l.instanceId));
            for (const key of Object.keys(next)) {
              if (!validIds.has(key)) delete next[key];
            }
            for (const { instanceId, entryId } of lineInstances) {
              if (!next[instanceId]) {
                const slots = golferSlotsForEntryId(entryId, pricingData);
                next[instanceId] = emptySegmentFieldStateForSlots(slots);
              }
            }
            return next;
          });
        }, [lineInstances, pricingData]);

        const selectedPricingOptions = useMemo(() => {
          return pricingData.filter((item) => selectedOptionIds.includes(item.id));
        }, [pricingData, selectedOptionIds]);

        const selectedProductOptions = useMemo(() => {
          return pricingData.filter((item) => selectedProducts.includes(item.id));
        }, [pricingData, selectedProducts]);

        const effectiveParticipantType = selectedEntryPackages[0] || selectedProducts[0] || '';

        const sponsorshipNote = useMemo(() => {
          return pricingData.find(item => item.id === 'sponsorshipNote');
        }, [pricingData]);

        useEffect(() => {
          const fetchProductAvailability = async () => {
            try {
              const res = await fetch('/api/registration/product-availability');
              const data = await res.json();
              if (res.ok && data?.products) {
                setProductAvailability(data.products as Record<string, ProductAvailability>);
              }
            } catch (err) {
              console.error('Failed to check product availability:', err);
            }
          };
          fetchProductAvailability();
        }, []);

        const showSponsorshipNote = useMemo(() => {
          return selectedPricingOptions.some((item) => item.category === 'sponsor');
        }, [selectedPricingOptions]);

        const manualEntryMode = params.get('manual') === '1';
        const [adminManualSecret, setAdminManualSecret] = useState('');
        const [manualSheetSuccess, setManualSheetSuccess] = useState(false);
        const [submittingMode, setSubmittingMode] = useState<'stripe' | 'manual' | null>(null);

        const validateForm = (options?: { bypassWebsiteCapacity?: boolean }) => {
          const errors: FormErrorsType = {};
          const hasEntry = selectedEntryPackages.length > 0;
          const bypassWebsite = Boolean(options?.bypassWebsiteCapacity);

          if (!hasEntry && selectedProducts.length === 0) {
            errors.participantType = "Please select at least one registration option";
          }

          const hasSelectedSponsorProduct = selectedProducts.some((id) => sponsorProductIds.includes(id));
          if (hasSelectedSponsorProduct) {
            if (!formData.company) errors.company = "Company is required";
            if (!formData.player1Name) errors.player1Name = "Name is required";
            if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
            if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
          }

          for (const { instanceId, entryId } of lineInstances) {
            const slots = golferSlotsForEntryId(entryId, pricingData);
            const opt = pricingData.find((o) => o.id === entryId);
            const seg = segmentFields[instanceId];

            if (sponsorPackageIds.includes(entryId)) {
              const g = seg?.golfers ?? [];
              if (!seg?.company) errors[`segment.${instanceId}.company`] = "Company is required";
              if (!seg?.contactName) errors[`segment.${instanceId}.contactName`] = "Contact name is required";
              if (!seg?.contactPhone || !phoneRegex.test(seg.contactPhone.replace(/\D/g, ""))) {
                errors[`segment.${instanceId}.contactPhone`] = "Contact phone is invalid";
              }
              if (!seg?.contactEmail || !emailRegex.test(seg.contactEmail)) {
                errors[`segment.${instanceId}.contactEmail`] = "Contact email is invalid";
              }
              for (let index = 0; index < slots; index++) {
                const golfer = g[index];
                if (!golfer?.name) errors[`segment.${instanceId}.golfers.${index}.name`] = `Player ${index + 1} Name is required`;
                if (!golfer?.handicap || (!handicapRegex.test(golfer.handicap) && golfer.handicap.toLowerCase() !== 'placeholder')) {
                  errors[`segment.${instanceId}.golfers.${index}.handicap`] = `Player ${index + 1} Handicap is required`;
                }
                if (!golfer?.tShirtSize) {
                  errors[`segment.${instanceId}.golfers.${index}.tShirtSize`] = `Player ${index + 1} T-Shirt Size is required`;
                }
              }
              if (!seg?.banquet) errors[`segment.${instanceId}.banquet`] = "Banquet choice is required";
            }

            if (entryId === 'teamSponsorEntry' && seg) {
              const g = seg.golfers ?? [];
              if (!seg.company) errors[`segment.${instanceId}.company`] = "Company is required";
              if (!seg.teamName?.trim()) errors[`segment.${instanceId}.teamName`] = "Team Name is required";
              for (let index = 0; index < 3; index++) {
                const golfer = g[index];
                if (!golfer?.name) errors[`segment.${instanceId}.golfers.${index}.name`] = `Player ${index + 1} Name is required`;
                if (!golfer?.handicap || !handicapRegex.test(golfer.handicap)) {
                  errors[`segment.${instanceId}.golfers.${index}.handicap`] = `Player ${index + 1} Handicap is required`;
                }
                if (!golfer?.tShirtSize) {
                  errors[`segment.${instanceId}.golfers.${index}.tShirtSize`] = `Player ${index + 1} T-Shirt size is required`;
                }
              }
              if (!seg.contactName) errors[`segment.${instanceId}.contactName`] = "Team contact name is required";
              if (!seg.contactPhone || !phoneRegex.test(seg.contactPhone.replace(/\D/g, ""))) {
                errors[`segment.${instanceId}.contactPhone`] = "Contact phone is invalid";
              }
              if (!seg.contactEmail || !emailRegex.test(seg.contactEmail)) {
                errors[`segment.${instanceId}.contactEmail`] = "Contact email is invalid";
              }
              if (!seg.banquet) errors[`segment.${instanceId}.banquet`] = "Banquet choice is required";
            }

            if (opt?.category === 'individual') {
              const p = seg?.golfers[0];
              if (!seg?.company) errors[`segment.${instanceId}.company`] = "Company is required";
              if (!seg?.contactEmail || !emailRegex.test(seg.contactEmail)) {
                errors[`segment.${instanceId}.contactEmail`] = "Invalid email";
              }
              if (!seg?.contactPhone || !phoneRegex.test(seg.contactPhone.replace(/\D/g, ""))) {
                errors[`segment.${instanceId}.contactPhone`] = "Invalid phone number";
              }
              if (!p?.name) errors[`segment.${instanceId}.golfers.0.name`] = "Name is required";
              if (!p?.handicap || !handicapRegex.test(p.handicap)) {
                errors[`segment.${instanceId}.golfers.0.handicap`] = "Enter a valid handicap";
              }
              if (!p?.tShirtSize) errors[`segment.${instanceId}.golfers.0.tShirtSize`] = "Shirt size is required";
              if (!seg?.banquet) errors[`segment.${instanceId}.banquet`] = "Banquet choice is required";
            }

            if (entryId === 'singlePlayerSponsorEntry' && seg) {
              const p = seg.golfers[0];
              if (!seg.company) errors[`segment.${instanceId}.company`] = "Company is required";
              if (!p?.name) errors[`segment.${instanceId}.golfers.0.name`] = "Name is required";
              if (!seg.contactEmail || !emailRegex.test(seg.contactEmail)) {
                errors[`segment.${instanceId}.contactEmail`] = "Invalid email";
              }
              if (!seg.contactPhone || !phoneRegex.test(seg.contactPhone.replace(/\D/g, ""))) {
                errors[`segment.${instanceId}.contactPhone`] = "Invalid phone number";
              }
              if (!p?.handicap || !handicapRegex.test(p.handicap)) {
                errors[`segment.${instanceId}.golfers.0.handicap`] = "Enter a valid handicap";
              }
              if (!p?.tShirtSize) errors[`segment.${instanceId}.golfers.0.tShirtSize`] = "Shirt size is required";
              if (!seg.banquet) errors[`segment.${instanceId}.banquet`] = "Banquet choice is required";
            }

            const slotsForContrib = golferSlotsForEntryId(entryId, pricingData);
            if (slotsForContrib > 0 && seg) {
              if (!(seg.doorPrize ?? '').trim()) {
                errors[`segment.${instanceId}.doorPrize`] = 'Door prize description is required';
              }
              const flagVal = seg.flagPrizeContribution ?? '';
              if (flagVal && !flagPrizeRegex.test(flagVal)) {
                errors[`segment.${instanceId}.flagPrizeContribution`] =
                  'Use only whole numbers and no decimals';
              }
            }
          }

          if (!bypassWebsite) {
            for (const productId of selectedProducts) {
              const q = effectiveProductQty(productId, productQuantities);
              if (productId === 'websiteSponsorship') {
                const rem = productAvailability.websiteSponsorship?.remaining;
                if (rem !== undefined && q > rem) {
                  errors.participantType = `Only ${rem} website sponsorship slot(s) available`;
                }
              }
            }
          }

          if (
            selectedEntryPackages.length === 0 &&
            lineInstances.length === 0 &&
            formData.flagPrizeContribution &&
            !flagPrizeRegex.test(formData.flagPrizeContribution)
          ) {
            errors.flagPrizeContribution = "Use only whole numbers and no decimals";
          }

          setFormErrors(errors);
          return Object.keys(errors).length === 0;
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          const next = normalizeRegistrationInput(name, value);
          setFormData((prev) => ({ ...prev, [name]: next }));
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        };

        const handleEntryPackageToggle = (packageId: string) => {
          setSelectedEntryPackages((prev) => {
            if (prev.includes(packageId)) {
              setPackageQuantities((pq) => {
                const n = { ...pq };
                delete n[packageId];
                return n;
              });
              return prev.filter((id) => id !== packageId);
            }
            setPackageQuantities((pq) => ({ ...pq, [packageId]: 1 }));
            return [...prev, packageId];
          });
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            participantType: "",
          }));
        };

        const bumpPackageQuantity = (entryId: string, delta: number) => {
          setPackageQuantities((prev) => {
            const cur = prev[entryId] ?? 1;
            const next = Math.min(MAX_PACKAGE_QTY, Math.max(1, cur + delta));
            return { ...prev, [entryId]: next };
          });
        };

        const bumpProductQuantity = (productId: string, delta: number) => {
          if (productId === 'websiteSponsorship') return;
          setProductQuantities((prev) => {
            const cur = prev[productId] ?? 1;
            const next = Math.min(MAX_PRODUCT_QTY, Math.max(1, cur + delta));
            return { ...prev, [productId]: next };
          });
        };

        const updateSegmentField = (instanceId: string, patch: Partial<SegmentFieldState>) => {
          setSegmentFields((prev) => ({
            ...prev,
            [instanceId]: { ...prev[instanceId], ...patch } as SegmentFieldState,
          }));
        };

        const isProductSoldOut = (productId: string) => {
          const availability = productAvailability[productId];
          return Boolean(availability?.soldOut);
        };

        const handleProductToggle = (productId: string) => {
          setSelectedProducts((prev) => {
            if (prev.includes(productId)) {
              setProductQuantities((pq) => {
                const n = { ...pq };
                delete n[productId];
                return n;
              });
              return prev.filter((id) => id !== productId);
            }
            if (isProductSoldOut(productId)) return prev;
            setProductQuantities((pq) => {
              const n = { ...pq };
              if (productId === 'websiteSponsorship') {
                delete n[productId];
              } else {
                n[productId] = 1;
              }
              return n;
            });
            return [...prev, productId];
          });

          setFormErrors((prevErrors) => ({
            ...prevErrors,
            participantType: "",
          }));
        };

        const handleSelectChange = (name: keyof FormDataType | string, value: string) => {
          setFormData((prev) => ({ ...prev, [name]: value }));

          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        };

        const [basePrice, setBasePrice] = useState(0);
        const [dinnerTicketCost, setDinnerTicketCost] = useState(0);
        const [flagPrizeCost, setFlagPrizeCost] = useState(0);

        const totalDinnerTicketUnits = useMemo(() => {
          let n = 0;
          if (selectedEntryPackages.length === 0) {
            if (formData.dinnerTickets !== '') n += parseInt(formData.dinnerTickets, 10) || 0;
            return n;
          }
          for (const { instanceId, entryId } of lineInstances) {
            const slots = golferSlotsForEntryId(entryId, pricingData);
            if (slots <= 0) continue;
            const seg = segmentFields[instanceId];
            const raw = seg?.dinnerTickets;
            if (raw !== '' && raw !== undefined) n += parseInt(String(raw), 10) || 0;
          }
          return n;
        }, [selectedEntryPackages, lineInstances, segmentFields, formData.dinnerTickets, pricingData]);

        const totalFlagPrizeDollars = useMemo(() => {
          let sum = 0;
          for (const { instanceId } of lineInstances) {
            const raw = segmentFields[instanceId]?.flagPrizeContribution ?? '';
            if (raw && flagPrizeRegex.test(raw)) sum += parseInt(raw, 10);
          }
          if (
            lineInstances.length === 0 &&
            formData.flagPrizeContribution &&
            flagPrizeRegex.test(formData.flagPrizeContribution)
          ) {
            sum += parseInt(formData.flagPrizeContribution, 10);
          }
          return sum;
        }, [lineInstances, segmentFields, formData.flagPrizeContribution, flagPrizeRegex]);

        useEffect(() => {
          const entryPrice = selectedEntryPackages.reduce((sum, id) => {
            const qty = effectivePackageQty(id, packageQuantities);
            return sum + (basePrices[id as keyof typeof basePrices] || 0) * qty;
          }, 0);
          const productsPrice = selectedProducts.reduce((sum, productId) => {
            const q = effectiveProductQty(productId, productQuantities);
            return sum + (basePrices[productId as keyof typeof basePrices] || 0) * q;
          }, 0);
          const newBasePrice = entryPrice + productsPrice;

          const newDinnerTicketCost =
            totalDinnerTicketUnits * ADDITIONAL_DINNER_TICKET_PRICE_USD;

          const newTotal = newBasePrice + newDinnerTicketCost + totalFlagPrizeDollars;
          const newStripeFee = (newTotal * 0.029) + 0.30;

          setBasePrice(newBasePrice);
          setDinnerTicketCost(newDinnerTicketCost);
          setFlagPrizeCost(totalFlagPrizeDollars);
          setTotalPrice(newTotal);
          setStripeFee(newStripeFee);
        }, [
          basePrices,
          selectedEntryPackages,
          selectedProducts,
          packageQuantities,
          productQuantities,
          totalDinnerTicketUnits,
          totalFlagPrizeDollars,
        ]);

        const checkoutItems = useMemo<CheckoutItem[]>(() => {
          const dinnerQuantity = totalDinnerTicketUnits;

          const entryLines: CheckoutItem[] = selectedEntryPackages.map((entryId) => {
            const option = pricingData.find((o) => o.id === entryId);
            const qty = effectivePackageQty(entryId, packageQuantities);
            return {
              id: entryId,
              name: option?.label || entryId,
              amount: basePrices[entryId as keyof typeof basePrices] || 0,
              quantity: qty,
              category: (option?.category || 'individual') as CheckoutItem['category'],
            };
          });

          return [
            ...entryLines,
            ...selectedProductOptions.map((option): CheckoutItem => ({
              id: option.id,
              name: option.label,
              amount: option.price,
              quantity: effectiveProductQty(option.id, productQuantities),
              category: 'product',
            })),
            ...(dinnerQuantity > 0 ? [{
              id: 'dinnerTickets',
              name: 'Dinner Tickets',
              amount: ADDITIONAL_DINNER_TICKET_PRICE_USD,
              quantity: dinnerQuantity,
              category: 'addon',
            }] : []),
            ...(flagPrizeCost > 0 ? [{
              id: 'flagPrizeContribution',
              name: 'Flag Prize Contribution',
              amount: flagPrizeCost,
              quantity: 1,
              category: 'addon',
            }] : []),
            ...(stripeFee > 0 ? [{
              id: 'processingFee',
              name: 'Processing Fee',
              amount: Number(stripeFee.toFixed(2)),
              quantity: 1,
              category: 'addon',
            }] : []),
          ] as CheckoutItem[];
        }, [totalDinnerTicketUnits, selectedEntryPackages, packageQuantities, productQuantities, pricingData, basePrices, selectedProductOptions, flagPrizeCost, stripeFee]);

        const checkoutSummaryItems = useMemo(() => {
          const stripTrailingPriceFromLabel = (label: string) => (
            label.replace(/\s*\(\$\d[\d,]*(?:\.\d{1,2})?\)\s*$/, '').trim()
          );

          return checkoutItems
            .filter((item) => item.id !== 'processingFee')
            .map((item) => ({
            id: item.id,
            label: stripTrailingPriceFromLabel(item.name),
            quantity: item.quantity,
            total: item.amount * item.quantity,
            }));
        }, [checkoutItems]);

        const handleRemoveCheckoutItem = (itemId: string) => {
          if (selectedEntryPackages.includes(itemId)) {
            setSelectedEntryPackages((prev) => prev.filter((id) => id !== itemId));
            setPackageQuantities((pq) => {
              const n = { ...pq };
              delete n[itemId];
              return n;
            });
            return;
          }

          if (selectedProducts.includes(itemId)) {
            setSelectedProducts((prev) => prev.filter((id) => id !== itemId));
            setProductQuantities((pq) => {
              const n = { ...pq };
              delete n[itemId];
              return n;
            });
            return;
          }

          if (itemId === 'dinnerTickets') {
            setFormData((prev) => ({ ...prev, dinnerTickets: '' }));
            setSegmentFields((prev) => {
              const next = { ...prev };
              for (const k of Object.keys(next)) {
                next[k] = { ...next[k], dinnerTickets: '' };
              }
              return next;
            });
            return;
          }

          if (itemId === 'flagPrizeContribution') {
            setFormData((prev) => ({ ...prev, flagPrizeContribution: '' }));
            setSegmentFields((prev) => {
              const next = { ...prev };
              for (const k of Object.keys(next)) {
                next[k] = { ...next[k], flagPrizeContribution: '' };
              }
              return next;
            });
          }
        };

        const buildPersistedSegments = (_base: FormDataType): PersistedRegistrationSegment[] => {
          return lineInstances.map(({ instanceId, entryId }) => {
            const label = pricingData.find((p) => p.id === entryId)?.label || entryId;
            const slots = golferSlotsForEntryId(entryId, pricingData);
            const seg = segmentFields[instanceId];

            if (sponsorPackageIds.includes(entryId)) {
              let golfers = [...(seg?.golfers || [])];
              while (golfers.length < slots) golfers.push({ name: '', handicap: '', tShirtSize: '' });
              return {
                entryId,
                label,
                banquet: seg?.banquet || '',
                dinnerTickets: seg?.dinnerTickets || '',
                golfers: golfers.slice(0, slots),
                company: seg?.company || '',
                contactName: seg?.contactName || '',
                contactPhone: seg?.contactPhone || '',
                contactEmail: seg?.contactEmail || '',
                doorPrize: seg?.doorPrize ?? '',
                flagPrizeContribution: seg?.flagPrizeContribution ?? '',
              };
            }

            if (entryId === 'teamSponsorEntry') {
              let golfers = [...(seg?.golfers || [])];
              while (golfers.length < 3) golfers.push({ name: '', handicap: '', tShirtSize: '' });
              return {
                entryId,
                label,
                banquet: seg?.banquet || '',
                dinnerTickets: seg?.dinnerTickets || '',
                golfers: golfers.slice(0, 3),
                company: seg?.company || '',
                contactName: seg?.contactName || '',
                contactPhone: seg?.contactPhone || '',
                contactEmail: seg?.contactEmail || '',
                teamName: seg?.teamName || '',
                doorPrize: seg?.doorPrize ?? '',
                flagPrizeContribution: seg?.flagPrizeContribution ?? '',
              };
            }

            if (entryId === 'singlePlayerSponsorEntry') {
              const g0 = seg?.golfers[0];
              return {
                entryId,
                label,
                banquet: seg?.banquet || '',
                dinnerTickets: seg?.dinnerTickets || '',
                golfers: [{
                  name: g0?.name || '',
                  handicap: g0?.handicap || '',
                  tShirtSize: g0?.tShirtSize || '',
                }],
                company: seg?.company || '',
                contactName: g0?.name || '',
                contactPhone: seg?.contactPhone || '',
                contactEmail: seg?.contactEmail || '',
                doorPrize: seg?.doorPrize ?? '',
                flagPrizeContribution: seg?.flagPrizeContribution ?? '',
              };
            }

            const p = seg?.golfers[0];
            return {
              entryId,
              label,
              banquet: seg?.banquet || '',
              dinnerTickets: seg?.dinnerTickets || '',
              golfers: [{
                name: p?.name || '',
                handicap: p?.handicap || '',
                tShirtSize: p?.tShirtSize || '',
              }],
              company: seg?.company || '',
              contactName: p?.name || '',
              contactPhone: seg?.contactPhone || '',
              contactEmail: seg?.contactEmail || '',
              doorPrize: seg?.doorPrize ?? '',
              flagPrizeContribution: seg?.flagPrizeContribution ?? '',
            };
          });
        };

        const getFormattedRegistrationPayload = (): FormDataType & {
          participantType: string;
          selectedProductIds: string[];
          segments?: PersistedRegistrationSegment[];
        } => {
          const participantTypeForStorage = masterColumnCParticipantType(selectedEntryPackages, selectedProducts);
          const productsOnlyLead = !selectedEntryPackages.length && selectedProducts[0] ? selectedProducts[0] : '';

          const adjustedFormData = { ...formData };
          if (productsOnlyLead && sponsorProductIds.includes(productsOnlyLead)) {
            adjustedFormData.contactName = formData.player1Name;
            adjustedFormData.player1Name = '';
          }

          const segmentsPayload = lineInstances.length > 0 ? buildPersistedSegments(adjustedFormData) : undefined;
          const legacyPlayerFlat: Record<string, string> = {};
          const expandedProductIds = selectedProducts.flatMap((id) =>
            Array.from({ length: effectiveProductQty(id, productQuantities) }, () => id),
          );
          return {
            ...adjustedFormData,
            participantType: participantTypeForStorage || productsOnlyLead,
            selectedProductIds: expandedProductIds,
            ...legacyPlayerFlat,
            ...(segmentsPayload ? { segments: segmentsPayload } : {}),
          };
        };

        const handleManualSubmitToSheet = async (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          if (!adminManualSecret.trim()) {
            alert('Enter the admin password.');
            return;
          }
          if (!validateForm({ bypassWebsiteCapacity: true })) return;

          try {
            setSubmittingMode('manual');
            setLoading(true);
            const formattedFormData = getFormattedRegistrationPayload();
            const res = await fetch('/api/admin/manual-registration', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                adminSecret: adminManualSecret,
                formData: formattedFormData,
              }),
            });

            if (res.status === 403 || res.status === 404) {
              alert('Invalid admin password or manual entry is not enabled on this server.');
              return;
            }
            if (!res.ok) {
              alert('Could not write to the registration sheet. Please try again.');
              return;
            }
            setManualSheetSuccess(true);
            setRegistrationStatus('success');
            handleScrollDown();
          } catch (err) {
            console.error('Manual registration error:', err);
            alert('An unexpected error occurred.');
          } finally {
            setLoading(false);
            setSubmittingMode(null);
          }
        };

        const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          if (!validateForm()) return;

          try {
            const formattedFormData = getFormattedRegistrationPayload();
            setSubmittingMode('stripe');
            setLoading(true);
            const uid = uuidv4();
            store.set<RegistrationStoreData>('registrationData', { uid, formData: formattedFormData });

            const res = await fetch('/api/registration/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                formData: formattedFormData,
                uid: uid,
              }),
            });

            if (!res.ok) {
              return alert('Something went wrong. Please refresh the page and try again.')
            }

            const stripe = await stripePromise;
            if (!stripe) {
              alert('Something went wrong. Please refresh the page and try again.')
              console.error("Stripe failed to load.");
              return;
            }

            const checkoutResponse = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: uid,
                totalPrice: (totalPrice + stripeFee).toFixed(2),
                items: checkoutItems,
                breakdown: {
                  basePrice: basePrice.toFixed(2),
                  dinnerTickets: dinnerTicketCost.toFixed(2),
                  flagPrize: flagPrizeCost.toFixed(2),
                  selectedProducts,
                },
              }),
            });

            if (!checkoutResponse.ok) {
              const errorData = await checkoutResponse.json().catch(() => null) as {
                error?: string;
                soldOutProductIds?: string[];
              } | null;

              if (checkoutResponse.status === 409 && Array.isArray(errorData?.soldOutProductIds)) {
                const soldOutIds = new Set(errorData.soldOutProductIds);
                const soldOutLabels = pricingData
                  .filter((option) => soldOutIds.has(option.id))
                  .map((option) => option.label);

                setSelectedProducts((prev) => prev.filter((id) => !soldOutIds.has(id)));
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  participantType: `Sold out: ${soldOutLabels.join(', ') || 'selected sponsorship product(s)'}`,
                }));
                alert(`Some sponsorship products sold out before checkout: ${soldOutLabels.join(', ') || 'please reselect options'}.`);
                return;
              }

              alert(errorData?.error || 'Error creating checkout session, please refresh the page and try again');
              return;
            }

            const session = await checkoutResponse.json();

            if (session.url) {
              window.location.href = session.url;
            } else {
              alert('Error creating Stripe session, please refresh the page and try again');
            }
          } catch (error) {
            console.error('Checkout Error:', error);
            alert('An unexpected error occurred. Please refresh and try again.');
          } finally {
            setLoading(false);
            setSubmittingMode(null);
          }
        };

        const handleScrollDown = () => {
          document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
        };

        useEffect(() => {
          const confirmed = params.get('confirmed');
          if (confirmed) {
            setManualSheetSuccess(false);
            setRegistrationStatus('success');
            handleScrollDown();
          }
        }, [params]);

        return (
          <>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">
              <div className="col-span-full">
                <h3 className="text-white/80 text-lg font-semibold mt-4">REGISTRATION INCLUDES:</h3>
                <ul className="text-white/60 list-disc pl-5 mt-2 space-y-1 text-lg">
                  <li>54 HOLES OF GOLF ON TWO COURSES</li>
                  <li>CARTS FOR THE TOURNAMENT</li>
                  <li>PREMIUM TOURNAMENT GIFT BAG</li>
                  <li>ON COURSE REFRESHMENTS</li>
                  <li>DAILY FLAG PRIZES</li>
                  <li>THURSDAY NIGHT SOCIAL</li>
                  <li>SATURDAY BANQUET AT CAM-PLEX</li>
                  <li>A CALCUTTA WILL TAKE PLACE FRIDAY EVENING</li>
                </ul>
              </div>

              <div className="col-span-full my-8">
                <hr className="border-t border-white/20" />
              </div>

              {manualEntryMode && (
                <div className="col-span-full rounded-lg border border-amber-500/60 bg-amber-950/40 p-4 md:p-5 text-amber-100/90 space-y-3">
                  <p className="font-semibold text-lg">Board manual entry</p>
                  <p className="text-sm text-amber-100/80">
                    Rows are written directly to the Registrations sheet. No payment.
                  </p>
                  <div>
                    <label htmlFor="admin-manual-secret" className="sr-only">
                      Admin password
                    </label>
                    <input
                      id="admin-manual-secret"
                      type="password"
                      autoComplete="off"
                      placeholder="Admin password"
                      value={adminManualSecret}
                      onChange={(e) => setAdminManualSecret(e.target.value)}
                      className="block w-full max-w-md bg-customInputFill border border-customInputBorder p-4 rounded-xl text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              )}

              <div className="md:col-span-2 md:min-w-0">
              <div className="col-span-full">
                <Accordion type="single" collapsible defaultValue={path.includes('sponsor') ? `sponsor-packages` : `individual-participants`} className="w-full">
                  <AccordionItem value="individual-participants" className="border-t border-white/80 pb-8 md:pb-10">
                    <AccordionTrigger className="text-white/80 text-lg font-semibold [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">INDIVIDUAL PARTICIPANTS:</AccordionTrigger>
                    <AccordionContent className="!pb-8 md:!pb-10">
                      <div className="space-y-1">
                        {pricingData
                          .filter((option) => option.category === 'individual')
                          .map((option) => (
                            <div className="group" key={option.id}>
                              <label className="flex flex-col cursor-pointer text-white/60 text-lg pb-2
                                  group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                                  group-has-[input:checked]:bg-black/80
                                  hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                                  border border-transparent rounded-lg transition-all">

                                <div className="flex items-center justify-between">
                                  <span>{option.label}</span>
                                  <div className="relative ml-auto">
                                    <input
                                      type="checkbox"
                                      name={`entry-${option.id}`}
                                      value={option.id}
                                      checked={selectedEntryPackages.includes(option.id)}
                                      onChange={() => handleEntryPackageToggle(option.id)}
                                      className="sr-only peer"
                                    />
                                    <div className="h-6 w-6 rounded border-2 border-customInputBorder"></div>
                                    <div className="h-4 w-4 rounded-sm bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                                  </div>
                                </div>

                                {selectedEntryPackages.includes(option.id) && (
                                  <div className="mt-2 text-sm text-white/60">
                                    {option.details}
                                  </div>
                                )}
                                {selectedEntryPackages.includes(option.id) &&
                                  golferSlotsForEntryId(option.id, pricingData) > 0 && (
                                    <div
                                      className="mt-3 flex flex-wrap items-center gap-3 text-white/80"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      <span className="text-sm font-semibold uppercase tracking-wide">Quantity</span>
                                      <div className="flex items-center gap-0 border border-customInputBorder rounded-lg overflow-hidden">
                                        <button
                                          type="button"
                                          className="px-4 py-2 text-lg hover:bg-white/10 disabled:opacity-40"
                                          disabled={effectivePackageQty(option.id, packageQuantities) <= 1}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            bumpPackageQuantity(option.id, -1);
                                          }}
                                          aria-label="Decrease quantity"
                                        >
                                          −
                                        </button>
                                        <span className="min-w-[2.5rem] text-center tabular-nums px-2">
                                          {effectivePackageQty(option.id, packageQuantities)}
                                        </span>
                                        <button
                                          type="button"
                                          className="px-4 py-2 text-lg hover:bg-white/10 disabled:opacity-40"
                                          disabled={effectivePackageQty(option.id, packageQuantities) >= MAX_PACKAGE_QTY}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            bumpPackageQuantity(option.id, 1);
                                          }}
                                          aria-label="Increase quantity"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  )}
                              </label>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="sponsor-packages" className="border-white/80 pb-8 md:pb-10">
                    <AccordionTrigger className="text-white/80 text-lg font-semibold [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">SPONSORSHIP PACKAGES:</AccordionTrigger>
                    <AccordionContent className="!pb-8 md:!pb-10">
                      <div className="space-y-1">
                        {pricingData
                          .filter((option) => option.category === 'sponsor')
                          .map((option) => (
                            <div className="group" key={option.id}>
                              <label className="flex flex-col cursor-pointer text-white/60 text-lg pb-2
                                  group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                                  group-has-[input:checked]:bg-black/80
                                  hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                                  border border-transparent rounded-lg transition-all">

                                <div className="flex items-center justify-between">
                                  <span>{option.label}</span>
                                  <div className="relative ml-auto">
                                    <input
                                      type="checkbox"
                                      name={`entry-${option.id}`}
                                      value={option.id}
                                      checked={selectedEntryPackages.includes(option.id)}
                                      onChange={() => handleEntryPackageToggle(option.id)}
                                      className="sr-only peer"
                                    />
                                    <div className="h-6 w-6 rounded border-2 border-customInputBorder"></div>
                                    <div className="h-4 w-4 rounded-sm bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                                  </div>
                                </div>

                                {selectedEntryPackages.includes(option.id) && (
                                  <div className="mt-2 text-sm text-white/60">
                                    {option.details}
                                  </div>
                                )}
                                {selectedEntryPackages.includes(option.id) &&
                                  golferSlotsForEntryId(option.id, pricingData) > 0 && (
                                    <div
                                      className="mt-3 flex flex-wrap items-center gap-3 text-white/80"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      <span className="text-sm font-semibold uppercase tracking-wide">Quantity</span>
                                      <div className="flex items-center gap-0 border border-customInputBorder rounded-lg overflow-hidden">
                                        <button
                                          type="button"
                                          className="px-4 py-2 text-lg hover:bg-white/10 disabled:opacity-40"
                                          disabled={effectivePackageQty(option.id, packageQuantities) <= 1}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            bumpPackageQuantity(option.id, -1);
                                          }}
                                          aria-label="Decrease quantity"
                                        >
                                          −
                                        </button>
                                        <span className="min-w-[2.5rem] text-center tabular-nums px-2">
                                          {effectivePackageQty(option.id, packageQuantities)}
                                        </span>
                                        <button
                                          type="button"
                                          className="px-4 py-2 text-lg hover:bg-white/10 disabled:opacity-40"
                                          disabled={effectivePackageQty(option.id, packageQuantities) >= MAX_PACKAGE_QTY}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            bumpPackageQuantity(option.id, 1);
                                          }}
                                          aria-label="Increase quantity"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  )}
                              </label>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="individual-sponsorship" className="border-white/80 pb-8 md:pb-10">
                    <AccordionTrigger className="text-white/80 text-lg font-semibold border-white/20 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">SPONSORSHIP PRODUCTS:</AccordionTrigger>
                    <AccordionContent className="!pb-8 md:!pb-10">
                      <div className="space-y-1">
                        {pricingData
                          .filter((option) => option.category === 'product')
                          .map((option) => (
                            <div className="group" key={option.id}>
                              <label className={`flex flex-col cursor-pointer text-white/60 text-lg pb-2
                                  group-has-[input:checked]:border group-has-[input:checked]:border-customInputBorder group-has-[input:checked]:rounded-lg
                                  group-has-[input:checked]:bg-black/80
                                  hover:border hover:border-customInputBorder hover:bg-black/20 p-2
                                  border border-transparent rounded-lg transition-all
                                  ${isProductSoldOut(option.id) ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}>

                                <div className="flex items-center justify-between">
                                  <span>
                                    {option.label}
                                    {isProductSoldOut(option.id) ? ' (Sold out)' : ''}
                                  </span>
                                  <div className="relative ml-auto">
                                    <input
                                      type="checkbox"
                                      name={`product-${option.id}`}
                                      value={option.id}
                                      checked={selectedProducts.includes(option.id)}
                                      onChange={() => handleProductToggle(option.id)}
                                      disabled={isProductSoldOut(option.id) && !selectedProducts.includes(option.id)}
                                      className="sr-only peer"
                                    />
                                    <div className="h-6 w-6 rounded border-2 border-customInputBorder"></div>
                                    <div className="h-4 w-4 rounded-sm bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                                  </div>
                                </div>

                                {selectedProducts.includes(option.id) && (
                                  <div className="mt-2 text-sm text-white/60">
                                    {option.details}
                                  </div>
                                )}
                                {selectedProducts.includes(option.id) && option.id !== 'websiteSponsorship' && (
                                  <div
                                    className="mt-3 flex flex-wrap items-center gap-3 text-white/80"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <span className="text-sm font-semibold uppercase tracking-wide">Quantity</span>
                                    <div className="flex items-center gap-0 border border-customInputBorder rounded-lg overflow-hidden">
                                      <button
                                        type="button"
                                        className="px-4 py-2 text-lg hover:bg-white/10 disabled:opacity-40"
                                        disabled={(productQuantities[option.id] ?? 1) <= 1}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          bumpProductQuantity(option.id, -1);
                                        }}
                                        aria-label="Decrease quantity"
                                      >
                                        −
                                      </button>
                                      <span className="min-w-[2.5rem] text-center tabular-nums px-2">
                                        {Math.min(MAX_PRODUCT_QTY, Math.max(1, productQuantities[option.id] ?? 1))}
                                      </span>
                                      <button
                                        type="button"
                                        className="px-4 py-2 text-lg hover:bg-white/10 disabled:opacity-40"
                                        disabled={(productQuantities[option.id] ?? 1) >= MAX_PRODUCT_QTY}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          bumpProductQuantity(option.id, 1);
                                        }}
                                        aria-label="Increase quantity"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </label>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {formErrors.participantType && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.participantType}</p>
                )}
              </div>

              <div className="col-span-full mt-10 mb-10 pt-2 pb-2">
                <hr className="border-t border-white/20" />
              </div>

              {lineInstances.map(({ instanceId, entryId }) => {
                const option = pricingData.find((p) => p.id === entryId);
                const seg = segmentFields[instanceId];
                if (!seg) return null;

                const segmentCardClass =
                  'col-span-2 w-full border border-customInputBorder rounded-lg p-4 md:p-6 mb-8 pb-8 md:pb-10';

                const pkgQty = effectivePackageQty(entryId, packageQuantities);
                const ordinal =
                  lineInstances.filter((l) => l.entryId === entryId).findIndex((l) => l.instanceId === instanceId) + 1;
                const blockTitle = `${option?.label ?? entryId}${pkgQty > 1 ? ` (${ordinal} of ${pkgQty})` : ''}`;

                if (sponsorPackageIds.includes(entryId)) {
                  const slots = golferSlotsForEntryId(entryId, pricingData);
                  return (
                    <div key={instanceId} className={segmentCardClass}>
                      <RegistrationOptionDisclaimer option={option} />
                      <GolfersFormFields
                        setFormErrors={setFormErrors}
                        handleSelectChange={handleSelectChange}
                        handleChange={handleChange}
                        golfers={seg.golfers}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        formData={formData}
                        maxGolfers={slots}
                        rosterOnly={false}
                        segmentContribution={{
                          instanceId,
                          doorPrize: seg.doorPrize ?? '',
                          flagPrizeContribution: seg.flagPrizeContribution ?? '',
                          onPatch: (patch) => updateSegmentField(instanceId, patch),
                        }}
                        segmentEntryId={instanceId}
                        segmentTitle={blockTitle}
                        segmentBanquet={seg.banquet}
                        segmentDinnerTickets={seg.dinnerTickets}
                        instanceContact={{
                          company: seg.company ?? '',
                          contactName: seg.contactName ?? '',
                          contactPhone: seg.contactPhone ?? '',
                          contactEmail: seg.contactEmail ?? '',
                          onPatch: (patch) => updateSegmentField(instanceId, patch),
                        }}
                        onSegmentFieldChange={(field, value) => updateSegmentField(instanceId, { [field]: value })}
                        updateGolfers={(fn) => {
                          setSegmentFields((p) => {
                            const cur = p[instanceId];
                            if (!cur) return p;
                            return { ...p, [instanceId]: { ...cur, golfers: fn(cur.golfers) } };
                          });
                        }}
                      />
                    </div>
                  );
                }

                if (entryId === 'teamSponsorEntry') {
                  return (
                    <div key={instanceId} className={segmentCardClass}>
                      <RegistrationOptionDisclaimer option={option} />
                      <h3 className="text-white/80 text-xl font-semibold mb-6">{blockTitle}</h3>
                      <TeamSegmentFields
                        instanceId={instanceId}
                        segment={seg}
                        onPatch={(patch) => updateSegmentField(instanceId, patch)}
                        setFormErrors={setFormErrors}
                        formErrors={formErrors}
                      />
                    </div>
                  );
                }

                if (entryId === 'singlePlayerSponsorEntry') {
                  return (
                    <div key={instanceId} className={segmentCardClass}>
                      <RegistrationOptionDisclaimer option={option} />
                      <h3 className="text-white/80 text-xl font-semibold mb-6">{blockTitle}</h3>
                      <SinglePlayerSegmentFields
                        instanceId={instanceId}
                        segment={seg}
                        onPatch={(patch) => updateSegmentField(instanceId, patch)}
                        setFormErrors={setFormErrors}
                        formErrors={formErrors}
                      />
                    </div>
                  );
                }

                if (option?.category === 'individual') {
                  return (
                    <div key={instanceId} className={segmentCardClass}>
                      <RegistrationOptionDisclaimer option={option} />
                      <IndividualSegmentFields
                        segmentId={instanceId}
                        segmentTitle={blockTitle}
                        segment={seg}
                        onSegmentChange={(id, patch) => updateSegmentField(id, patch)}
                        setFormErrors={setFormErrors}
                        formErrors={formErrors}
                      />
                    </div>
                  );
                }

                return null;
              })}

              {selectedProducts.some((id) => sponsorProductIds.includes(id)) && (
                <div className="col-span-2 w-full border border-customInputBorder rounded-lg p-4 md:p-6 mb-8 pb-8 md:pb-10 space-y-6">
                  <h3 className="text-white/80 text-xl font-semibold mb-4">Sponsorship product contact</h3>
                  <SponsorProductsFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
                  {selectedProducts.map((productId) => {
                    const opt = pricingData.find((p) => p.id === productId);
                    return <RegistrationOptionDisclaimer key={`product-disclaimer-${productId}`} option={opt} />;
                  })}
                </div>
              )}

              <div className="col-span-full">
                {showSponsorshipNote && sponsorshipNote?.noteHtml && (
                  <div
                    className={`bg-black/50 mt-6 text-customInputBorder col-span-full p-3 text-sm md:text-lg rounded-lg mb-6`}
                    dangerouslySetInnerHTML={{ __html: sponsorshipNote.noteHtml }}
                  />
                )}
                <div className="col-span-full mb-6 rounded-lg border border-white/15 bg-black/40 p-4 md:p-5 text-sm md:text-base text-white/70 leading-relaxed space-y-3">
                  <p>
                    By registering for the Coal Country Open you consent to receive emails related to your
                    participation, including updates, reminders, and event details.
                  </p>
                  <p>
                    To stop receiving emails, reply &ldquo;unsubscribe&rdquo; or email{' '}
                    <a
                      href="mailto:coalcountryopen@gmail.com"
                      className="text-customInputBorder underline underline-offset-2 hover:text-white"
                    >
                      coalcountryopen@gmail.com
                    </a>
                    .
                  </p>
                  <p>
                    We respect your privacy and will not share your information. See our{' '}
                    <a
                      href="https://highplainsmedia.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-customInputBorder underline underline-offset-2 hover:text-white"
                    >
                      Privacy Policy
                    </a>
                    {' '}and{' '}
                    <a
                      href="https://highplainsmedia.com/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-customInputBorder underline underline-offset-2 hover:text-white"
                    >
                      Terms
                    </a>{' '}
                    for more information.
                  </p>
                </div>
                <div className={`flex flex-col gap-3 ${manualEntryMode ? 'sm:flex-row sm:flex-wrap' : ''}`}>
                  <Button
                    disabled={loading}
                    onClick={handleCheckout}
                    className="p-0 md:p-6 border border-customPrimary w-full sm:flex-1 bg-customPrimary hover:bg-customPrimary/60 uppercase font-text font-bold flex flex-row justify-center items-center"
                  >
                    {loading && submittingMode === 'stripe'
                      ? 'Redirecting to Secure Payment...'
                      : 'Continue to Secure Payment'}{' '}
                    <FaLock className="h-16 w-16 font-bold" />
                  </Button>
                  {manualEntryMode && (
                    <Button
                      type="button"
                      disabled={loading}
                      onClick={handleManualSubmitToSheet}
                      className="p-0 md:p-6 border border-amber-600 w-full sm:flex-1 bg-amber-700 hover:bg-amber-600 text-white uppercase font-text font-bold flex flex-row justify-center items-center"
                    >
                      {loading && submittingMode === 'manual'
                        ? 'Writing to sheet...'
                        : 'Submit to sheet (no payment)'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="col-span-full mt-8">
                <hr className="border-t border-white/20" />
              </div>
              </div>

              <aside className="md:col-span-1 md:self-start md:sticky md:top-[220px] md:z-30">
                <div className="w-full flex flex-col border border-customInputBorder rounded-lg p-3 md:max-h-[calc(100vh-240px)] md:overflow-y-auto">
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="text-white/80 text-2xl font-semibold mr-2">TOTAL:</h3>
                    <p className="text-2xl text-white font-bold">${(totalPrice + stripeFee).toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col text-white/60 mt-2 space-y-1">
                    {checkoutSummaryItems.map((item) => (
                      <div key={`summary-${item.id}`} className="flex items-center justify-between gap-2">
                        <p>{item.label} x {item.quantity}: ${item.total.toFixed(2)}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveCheckoutItem(item.id)}
                          className="text-white/70 hover:text-white font-bold px-2"
                          aria-label={`Remove ${item.label}`}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <p className="mt-1">Processing Fee: ${stripeFee.toFixed(2)}</p>
                  </div>
                </div>
              </aside>
            </form>

            {registrationStatus === 'success' && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center">
                <div className="bg-white text-black rounded-xl shadow-lg p-8 max-w-md text-center">
                  <FaRegCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
                  <p className="mb-2">See you at the tournament on {tournamentStartDate} {new Date().getFullYear()}.</p>
                  {manualSheetSuccess ? (
                    <p className="text-sm text-gray-600">
                      Registration row(s) were added to the sheet. No payment was processed.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">Check your email for payment receipt and details.</p>
                  )}
                  <button
                    className="mt-6 bg-customPrimary text-white px-4 py-2 rounded hover:bg-customPrimary/80"
                    onClick={() => {
                      setRegistrationStatus('idle');
                      setManualSheetSuccess(false);
                      const url = new URL(window.location.href);
                      url.searchParams.delete('confirmed');
                      window.history.replaceState({}, document.title, url.toString());
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        );
}

type PricingOption = {
  id: string;
  label: string;
  price: number;
  details: string;
  category: 'individual' | 'sponsor' | 'product';
  subText?: string | null;
  highlightText?: string | null;
  noteHtml?: string | null;
};