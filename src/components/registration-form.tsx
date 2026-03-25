'use client';

import { Suspense } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { FaLock, FaRegCheckCircle } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import TeamFormFields from '@/components/team-form-fields';
import DefaultFormFields from '@/components/default-form-fields';
import SingleEntryFields from '@/components/single-entry-fields';
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
  entryIdsWithGolferSlots,
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

        type FormErrorsType = {
          [key: string]: string;
        };

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

        const orderedEntrySlotsIds = useMemo(
          () => entryIdsWithGolferSlots(selectedEntryPackages, pricingData),
          [selectedEntryPackages, pricingData],
        );

        const firstSponsorSlotEntryId = useMemo(
          () => orderedEntrySlotsIds.find((id) => sponsorPackageIds.includes(id)),
          [orderedEntrySlotsIds],
        );

        useEffect(() => {
          setSegmentFields((prev) => {
            const next = { ...prev };
            for (const id of selectedEntryPackages) {
              const slots = golferSlotsForEntryId(id, pricingData);
              if (slots <= 0) continue;
              if (!next[id]) {
                next[id] = emptySegmentFieldStateForSlots(slots);
              }
            }
            for (const key of Object.keys(next)) {
              if (!selectedEntryPackages.includes(key)) {
                delete next[key];
              }
            }
            return next;
          });
        }, [selectedEntryPackages, pricingData]);

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

        const validateForm = () => {
          const errors: FormErrorsType = {};
          const hasEntry = selectedEntryPackages.length > 0;
          const hasProductOnly = !hasEntry && selectedProducts.length > 0;
          const productsFirstId = selectedProducts[0];

          if (!hasEntry && selectedProducts.length === 0) {
            errors.participantType = "Please select at least one registration option";
          }

          if (hasProductOnly && productsFirstId && sponsorProductIds.includes(productsFirstId)) {
            if (!formData.company) errors.company = "Company is required";
            if (!formData.player1Name) errors.player1Name = "Name is required";
            if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
            if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
          }

          if (hasEntry && selectedEntryPackages.some((id) => sponsorPackageIds.includes(id))) {
            if (!formData.company) errors.company = "Company is required";
            if (!formData.contactName) errors.contactName = "Team contact name is required";
            if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) {
              errors.contactPhone = "Team contact phone is invalid";
            }
            if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) {
              errors.contactEmail = "Team contact email is invalid";
            }
          }

          for (const entryId of orderedEntrySlotsIds) {
            const slots = golferSlotsForEntryId(entryId, pricingData);
            const opt = pricingData.find((o) => o.id === entryId);
            const seg = segmentFields[entryId];

            if (sponsorPackageIds.includes(entryId)) {
              const g = seg?.golfers ?? [];
              for (let index = 0; index < slots; index++) {
                const golfer = g[index];
                if (!golfer?.name) errors[`segment.${entryId}.golfers.${index}.name`] = `Player ${index + 1} Name is required`;
                if (!golfer?.handicap || (!handicapRegex.test(golfer.handicap) && golfer.handicap.toLowerCase() !== 'placeholder')) {
                  errors[`segment.${entryId}.golfers.${index}.handicap`] = `Player ${index + 1} Handicap is required`;
                }
                if (!golfer?.tShirtSize) {
                  errors[`segment.${entryId}.golfers.${index}.tShirtSize`] = `Player ${index + 1} T-Shirt Size is required`;
                }
              }
              if (!seg?.banquet) errors[`segment.${entryId}.banquet`] = "Banquet choice is required";
            }

            if (entryId === 'teamSponsorEntry') {
              if (!formData.company) errors.company = "Company is required";
              if (!formData.teamName) errors.teamName = "Team Name is required";
              if (!formData.player1Name) errors.player1Name = "Player One Name is required";
              if (!formData.player2Name) errors.player2Name = "Player Two Name is required";
              if (!formData.player3Name) errors.player3Name = "Player Three Name is required";
              if (!formData.player1Handicap || !handicapRegex.test(formData.player1Handicap)) errors.player1Handicap = "Player One Handicap is required";
              if (!formData.player2Handicap || !handicapRegex.test(formData.player2Handicap)) errors.player2Handicap = "Player Two Handicap is required";
              if (!formData.player3Handicap || !handicapRegex.test(formData.player3Handicap)) errors.player3Handicap = "Player Three Handicap is required";
              if (!formData.player1TShirtSize) errors.player1TShirtSize = "Player One T-Shirt size is required";
              if (!formData.player2TShirtSize) errors.player2TShirtSize = "Player Two T-Shirt size is required";
              if (!formData.player3TShirtSize) errors.player3TShirtSize = "Player Three T-Shirt size is required";
              if (!formData.contactName) errors.contactName = "Team contact name is required";
              if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Contact phone is invalid";
              if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Contact email is invalid";
              if (!formData.banquet) errors.banquet = "Banquet choice is required";
            }

            if (opt?.category === 'individual') {
              const p = seg?.golfers[0];
              if (!seg?.company) errors[`segment.${entryId}.company`] = "Company is required";
              if (!seg?.contactEmail || !emailRegex.test(seg.contactEmail)) {
                errors[`segment.${entryId}.contactEmail`] = "Invalid email";
              }
              if (!seg?.contactPhone || !phoneRegex.test(seg.contactPhone.replace(/\D/g, ""))) {
                errors[`segment.${entryId}.contactPhone`] = "Invalid phone number";
              }
              if (!p?.name) errors[`segment.${entryId}.golfers.0.name`] = "Name is required";
              if (!p?.handicap || !handicapRegex.test(p.handicap)) {
                errors[`segment.${entryId}.golfers.0.handicap`] = "Enter a valid handicap";
              }
              if (!p?.tShirtSize) errors[`segment.${entryId}.golfers.0.tShirtSize`] = "Shirt size is required";
              if (!seg?.banquet) errors[`segment.${entryId}.banquet`] = "Banquet choice is required";
            }

            if (entryId === 'singlePlayerSponsorEntry') {
              if (!formData.player1Name) errors.player1Name = "Name is required";
              if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
              if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
              if (!formData.player1Handicap || !handicapRegex.test(formData.player1Handicap)) errors.player1Handicap = "Enter a valid handicap";
              if (!formData.company) errors.company = "Company is required";
              if (!formData.player1TShirtSize) errors.player1TShirtSize = "Shirt size is required";
              const sBanquet = seg?.banquet ?? formData.banquet;
              if (!sBanquet) errors[`segment.${entryId}.banquet`] = "Banquet choice is required";
            }
          }

          if (formData.flagPrizeContribution && !flagPrizeRegex.test(formData.flagPrizeContribution)) {
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
          setSelectedEntryPackages((prev) => (
            prev.includes(packageId)
              ? prev.filter((id) => id !== packageId)
              : [...prev, packageId]
          ));
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            participantType: "",
          }));
        };

        const updateSegmentField = (entryId: string, patch: Partial<SegmentFieldState>) => {
          setSegmentFields((prev) => ({
            ...prev,
            [entryId]: { ...prev[entryId], ...patch } as SegmentFieldState,
          }));
        };

        const isProductSoldOut = (productId: string) => {
          const availability = productAvailability[productId];
          return Boolean(availability?.soldOut);
        };

        const handleProductToggle = (productId: string) => {
          setSelectedProducts((prev) => (
            prev.includes(productId)
              ? prev.filter((id) => id !== productId)
              : isProductSoldOut(productId)
                ? prev
                : [...prev, productId]
          ));

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
          for (const id of selectedEntryPackages) {
            const slots = golferSlotsForEntryId(id, pricingData);
            if (slots <= 0) continue;
            if (id === 'teamSponsorEntry') {
              if (formData.dinnerTickets !== '') n += parseInt(formData.dinnerTickets, 10) || 0;
              continue;
            }
            const seg = segmentFields[id];
            const raw = seg?.dinnerTickets;
            if (raw !== '' && raw !== undefined) n += parseInt(String(raw), 10) || 0;
          }
          return n;
        }, [selectedEntryPackages, segmentFields, formData.dinnerTickets, pricingData]);

        useEffect(() => {
          const entryPrice = selectedEntryPackages.reduce((sum, id) => {
            return sum + (basePrices[id as keyof typeof basePrices] || 0);
          }, 0);
          const productsPrice = selectedProducts.reduce((sum, productId) => {
            return sum + (basePrices[productId as keyof typeof basePrices] || 0);
          }, 0);
          const newBasePrice = entryPrice + productsPrice;
          let newFlagPrizeCost = 0;

          const newDinnerTicketCost =
            totalDinnerTicketUnits * ADDITIONAL_DINNER_TICKET_PRICE_USD;

          if (formData.flagPrizeContribution && flagPrizeRegex.test(formData.flagPrizeContribution)) {
            newFlagPrizeCost = parseInt(formData.flagPrizeContribution, 10);
          }

          const newTotal = newBasePrice + newDinnerTicketCost + newFlagPrizeCost;
          const newStripeFee = (newTotal * 0.029) + 0.30;

          setBasePrice(newBasePrice);
          setDinnerTicketCost(newDinnerTicketCost);
          setFlagPrizeCost(newFlagPrizeCost);
          setTotalPrice(newTotal);
          setStripeFee(newStripeFee);
        }, [basePrices, flagPrizeRegex, selectedEntryPackages, selectedProducts, totalDinnerTicketUnits, formData.flagPrizeContribution]);

        const checkoutItems = useMemo<CheckoutItem[]>(() => {
          const dinnerQuantity = totalDinnerTicketUnits;

          const entryLines: CheckoutItem[] = selectedEntryPackages.map((entryId) => {
            const option = pricingData.find((o) => o.id === entryId);
            return {
              id: entryId,
              name: option?.label || entryId,
              amount: basePrices[entryId as keyof typeof basePrices] || 0,
              quantity: 1,
              category: (option?.category || 'individual') as CheckoutItem['category'],
            };
          });

          return [
            ...entryLines,
            ...selectedProductOptions.map((option): CheckoutItem => ({
              id: option.id,
              name: option.label,
              amount: option.price,
              quantity: 1,
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
        }, [totalDinnerTicketUnits, selectedEntryPackages, pricingData, basePrices, selectedProductOptions, flagPrizeCost, stripeFee]);

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
            return;
          }

          if (selectedProducts.includes(itemId)) {
            setSelectedProducts((prev) => prev.filter((id) => id !== itemId));
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
          }
        };

        const buildPersistedSegments = (base: FormDataType): PersistedRegistrationSegment[] => {
          return orderedEntrySlotsIds.map((entryId) => {
            const label = pricingData.find((p) => p.id === entryId)?.label || entryId;
            const slots = golferSlotsForEntryId(entryId, pricingData);
            const seg = segmentFields[entryId];

            if (sponsorPackageIds.includes(entryId)) {
              let golfers = [...(seg?.golfers || [])];
              while (golfers.length < slots) golfers.push({ name: '', handicap: '', tShirtSize: '' });
              return {
                entryId,
                label,
                banquet: seg?.banquet || '',
                dinnerTickets: seg?.dinnerTickets || '',
                golfers: golfers.slice(0, slots),
                company: base.company || '',
                contactName: base.contactName || '',
                contactPhone: base.contactPhone || '',
                contactEmail: base.contactEmail || '',
              };
            }

            if (entryId === 'teamSponsorEntry') {
              return {
                entryId,
                label,
                banquet: base.banquet || '',
                dinnerTickets: base.dinnerTickets || '',
                golfers: [
                  { name: base.player1Name || '', handicap: base.player1Handicap || '', tShirtSize: base.player1TShirtSize || '' },
                  { name: base.player2Name || '', handicap: base.player2Handicap || '', tShirtSize: base.player2TShirtSize || '' },
                  { name: base.player3Name || '', handicap: base.player3Handicap || '', tShirtSize: base.player3TShirtSize || '' },
                ],
                company: base.company || '',
                contactName: base.contactName || '',
                contactPhone: base.contactPhone || '',
                contactEmail: base.contactEmail || '',
              };
            }

            if (entryId === 'singlePlayerSponsorEntry') {
              return {
                entryId,
                label,
                banquet: seg?.banquet || base.banquet || '',
                dinnerTickets: seg?.dinnerTickets || base.dinnerTickets || '',
                golfers: [{
                  name: base.player1Name || '',
                  handicap: base.player1Handicap || '',
                  tShirtSize: base.player1TShirtSize || '',
                }],
                company: base.company || '',
                contactName: base.contactName || '',
                contactPhone: base.contactPhone || '',
                contactEmail: base.contactEmail || '',
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
            };
          });
        };

        const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          if (!validateForm()) return;

          const participantTypeForStorage = masterColumnCParticipantType(selectedEntryPackages, selectedProducts);
          const productsOnlyLead = !selectedEntryPackages.length && selectedProducts[0] ? selectedProducts[0] : '';

          const adjustedFormData = { ...formData };
          if (productsOnlyLead && sponsorProductIds.includes(productsOnlyLead)) {
            adjustedFormData.contactName = formData.player1Name;
            adjustedFormData.player1Name = '';
          }

          const firstSlot = orderedEntrySlotsIds[0];
          const firstOpt = firstSlot ? pricingData.find((p) => p.id === firstSlot) : undefined;
          if (firstOpt?.category === 'individual' && firstSlot && segmentFields[firstSlot]) {
            const s = segmentFields[firstSlot];
            const g0 = s.golfers[0];
            adjustedFormData.company = s.company ?? adjustedFormData.company;
            adjustedFormData.contactEmail = s.contactEmail ?? adjustedFormData.contactEmail;
            adjustedFormData.contactPhone = s.contactPhone ?? adjustedFormData.contactPhone;
            adjustedFormData.player1Name = g0?.name ?? adjustedFormData.player1Name;
            adjustedFormData.player1Handicap = g0?.handicap ?? adjustedFormData.player1Handicap;
            adjustedFormData.player1TShirtSize = g0?.tShirtSize ?? adjustedFormData.player1TShirtSize;
          }

          const segmentsPayload = orderedEntrySlotsIds.length > 0 ? buildPersistedSegments(adjustedFormData) : undefined;

          const firstSeg = segmentsPayload?.[0];
          const legacyMax = firstSeg ? Math.max(1, firstSeg.golfers.length) : 0;
          const legacyPlayers = firstSeg?.golfers || [];
          const legacyPlayerFlat = segmentsPayload
            ? Object.fromEntries(
                Array.from({ length: Math.max(legacyMax, 10) }, (_, i) => {
                  const golfer = legacyPlayers[i] || { name: '', handicap: '', tShirtSize: '' };
                  return [
                    [`player${i + 1}Name`, golfer.name],
                    [`player${i + 1}Handicap`, golfer.handicap],
                    [`player${i + 1}TShirtSize`, golfer.tShirtSize],
                  ];
                }).flat(),
              )
            : {};

          try {
            const formattedFormData = {
              ...adjustedFormData,
              participantType: participantTypeForStorage || productsOnlyLead,
              selectedProductIds: selectedProducts,
              ...(legacyPlayerFlat),
              ...(segmentsPayload ? { segments: segmentsPayload } : {}),
            };
            setLoading(true)
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
          }
        };

        const handleScrollDown = () => {
          document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
        };

        useEffect(() => {
          const confirmed = params.get('confirmed');
          if (confirmed) {
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

              {selectedPricingOptions.some((option) => option.subText?.length || option.highlightText?.length) && (
                <div className="bg-black/50 mt-6 text-customInputBorder col-span-full p-3 text-sm md:text-lg rounded-lg space-y-4">
                  {selectedPricingOptions.map((option) => (
                    <div key={`selected-message-${option.id}`}>
                      {option.subText && (
                        <div
                          dangerouslySetInnerHTML={{ __html: option.subText }}
                        />
                      )}
                      {option.highlightText && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<p class="p-3 mt-3 text-sm md:text-lg bg-customYellow text-secondary-foreground font-bold rounded-lg">${option.highlightText}</p>`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="col-span-full mt-10 mb-10 pt-2 pb-2">
                <hr className="border-t border-white/20" />
              </div>

              {orderedEntrySlotsIds.map((entryId) => {
                const option = pricingData.find((p) => p.id === entryId);
                const seg = segmentFields[entryId];
                if (!seg) return null;

                const segmentCardClass =
                  'col-span-2 w-full border border-customInputBorder rounded-lg p-4 md:p-6 mb-8 pb-8 md:pb-10';

                if (sponsorPackageIds.includes(entryId)) {
                  const slots = golferSlotsForEntryId(entryId, pricingData);
                  const rosterOnly = entryId !== firstSponsorSlotEntryId;
                  return (
                    <div key={entryId} className={segmentCardClass}>
                      <GolfersFormFields
                        setFormErrors={setFormErrors}
                        handleSelectChange={handleSelectChange}
                        handleChange={handleChange}
                        golfers={seg.golfers}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        formData={formData}
                        maxGolfers={slots}
                        rosterOnly={rosterOnly}
                        segmentEntryId={entryId}
                        segmentTitle={option?.label ?? entryId}
                        segmentBanquet={seg.banquet}
                        segmentDinnerTickets={seg.dinnerTickets}
                        onSegmentFieldChange={(field, value) => updateSegmentField(entryId, { [field]: value })}
                        updateGolfers={(fn) => {
                          setSegmentFields((p) => {
                            const cur = p[entryId];
                            if (!cur) return p;
                            return { ...p, [entryId]: { ...cur, golfers: fn(cur.golfers) } };
                          });
                        }}
                      />
                    </div>
                  );
                }

                if (entryId === 'teamSponsorEntry') {
                  return (
                    <div key={entryId} className={segmentCardClass}>
                      <h3 className="text-white/80 text-xl font-semibold mb-6">{option?.label ?? entryId}</h3>
                      <TeamFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
                    </div>
                  );
                }

                if (entryId === 'singlePlayerSponsorEntry') {
                  return (
                    <div key={entryId} className={segmentCardClass}>
                      <h3 className="text-white/80 text-xl font-semibold mb-6">{option?.label ?? entryId}</h3>
                      <DefaultFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
                      <SingleEntryFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
                    </div>
                  );
                }

                if (option?.category === 'individual') {
                  return (
                    <div key={entryId} className={segmentCardClass}>
                      <IndividualSegmentFields
                        segmentId={entryId}
                        segmentTitle={option.label ?? entryId}
                        segment={seg}
                        onSegmentChange={(id, patch) => updateSegmentField(id, patch)}
                        formErrors={formErrors as Record<string, string | undefined>}
                      />
                    </div>
                  );
                }

                return null;
              })}

              {!selectedEntryPackages.length && selectedProducts.length > 0 && (
                <SponsorProductsFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
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
                <Button disabled={loading} onClick={handleCheckout} className="p-0 md:p-6 mr-[1rem] border border-customPrimary w-full bg-customPrimary hover:bg-customPrimary/60 uppercase font-text font-bold flex flex-row justify-center items-center">
                  {loading ? 'Redirecting to Secure Payment...' : 'Continue to Secure Payment'} <FaLock className="h-16 w-16 font-bold" />
                </Button>
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
                  <p className="text-sm text-gray-600">Check your email for payment receipt and details.</p>
                  <button
                    className="mt-6 bg-customPrimary text-white px-4 py-2 rounded hover:bg-customPrimary/80"
                    onClick={() => {
                      setRegistrationStatus('idle');
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