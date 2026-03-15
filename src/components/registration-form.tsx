'use client';

import { Suspense } from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
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
import { getTournamentPricingConfig } from '@/lib/contentful';
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

const sponsorPackageIds = ["platinumSponsorship", "goldSponsorship", "silverSponsorship"];
const sponsorProductIds = ["flagPrizeSponsorship", "holeFlagSponsorship", "drivingRangeSponsorship", "teeBoxSponsorship", "websiteSponsorship"];

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
        const [primarySelection, setPrimarySelection] = useState('');
        const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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
          const ids = [
            ...(primarySelection ? [primarySelection] : []),
            ...selectedProducts,
          ];
          return Array.from(new Set(ids));
        }, [primarySelection, selectedProducts]);

        const selectedPricingOptions = useMemo(() => {
          return pricingData.filter((item) => selectedOptionIds.includes(item.id));
        }, [pricingData, selectedOptionIds]);

        const selectedProductOptions = useMemo(() => {
          return pricingData.filter((item) => selectedProducts.includes(item.id));
        }, [pricingData, selectedProducts]);

        const effectiveParticipantType = primarySelection || selectedProducts[0] || '';

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
          const hasPrimarySelection = Boolean(primarySelection);
          const hasProductSelection = selectedProducts.length > 0;
          const selectionForValidation = hasPrimarySelection ? primarySelection : selectedProducts[0];

          if (!hasPrimarySelection && !hasProductSelection) {
            errors.participantType = "Please select at least one registration option";
          }

          if (selectionForValidation && sponsorProductIds.includes(selectionForValidation)) {
            if (!formData.company) errors.company = "Company is required";
            if (!formData.player1Name) errors.player1Name = "Name is required";
            if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
            if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
          }

          if (selectionForValidation && selectionForValidation !== 'teamSponsorEntry' && !sponsorPackageIds.includes(selectionForValidation) && !sponsorProductIds.includes(selectionForValidation)) {
            if (!formData.player1Name) errors.player1Name = "Name is required";
            if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Invalid email";
            if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Invalid phone number";
            if (!formData.player1Handicap || !handicapRegex.test(formData.player1Handicap)) errors.player1Handicap = "Enter a valid handicap";
            if (!formData.company) errors.company = "Company is required";
            if (!formData.player1TShirtSize) errors.player1TShirtSize = "Shirt size is required";
          }

          if (selectionForValidation === "teamSponsorEntry" && !sponsorPackageIds.includes(selectionForValidation) && !sponsorProductIds.includes(selectionForValidation)) {
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
          }

          if (selectionForValidation && sponsorPackageIds.includes(selectionForValidation)) {
            if (!formData.company) errors.company = "Company is required";
            if (!formData.contactName) errors.contactName = "Team contact name is required";
            if (!formData.contactPhone || !phoneRegex.test(formData.contactPhone.replace(/\D/g, ""))) errors.contactPhone = "Team contact phone is invalid";
            if (!formData.contactEmail || !emailRegex.test(formData.contactEmail)) errors.contactEmail = "Team contact email is invalid";

            formData.golfers.forEach((golfer, index) => {
              if (!golfer.name) errors[`golfers.${index}.name`] = `Player ${index + 1} Name is required`;
              if (!golfer.handicap || (!handicapRegex.test(golfer.handicap) && golfer.handicap.toString().toLowerCase() !== 'placeholder')) {
                errors[`golfers.${index}.handicap`] = `Player ${index + 1} Handicap is required`;
              } if (!golfer.tShirtSize) errors[`golfers.${index}.tShirtSize`] = `Player ${index + 1} T-Shirt Size is required`;
            });
          }

          if (selectionForValidation && !formData.banquet && !sponsorProductIds.includes(selectionForValidation)) errors.banquet = "Banquet choice is required";

          if (formData.flagPrizeContribution && !flagPrizeRegex.test(formData.flagPrizeContribution)) errors.flagPrizeContribution = "Use only whole numbers and no decimals"

          setFormErrors(errors);
          return Object.keys(errors).length === 0;
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;

          if (name === 'participantType') {
            setPrimarySelection(value);
            setFormData({
              ...defaultFormState,
              participantType: value,
              golfers: Array(2).fill({ name: "", handicap: "", tShirtSize: "" })
            });

            setFormErrors({});
          } else {
            setFormData((prev) => ({ ...prev, [name]: value }));

            setFormErrors((prevErrors) => ({
              ...prevErrors,
              [name]: "",
            }));
          }
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

        useEffect(() => {
          const primaryPrice = primarySelection ? (basePrices[primarySelection as keyof typeof basePrices] || 0) : 0;
          const productsPrice = selectedProducts.reduce((sum, productId) => {
            return sum + (basePrices[productId as keyof typeof basePrices] || 0);
          }, 0);
          const newBasePrice = primaryPrice + productsPrice;
          let newDinnerTicketCost = 0;
          let newFlagPrizeCost = 0;

          if (formData.dinnerTickets !== '') {
            newDinnerTicketCost = parseInt(formData.dinnerTickets, 10) * 32.0;
          }

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
        }, [basePrices, flagPrizeRegex, primarySelection, selectedProducts, formData.dinnerTickets, formData.flagPrizeContribution]);

        const checkoutItems = useMemo<CheckoutItem[]>(() => {
          const dinnerQuantity = Number.parseInt(formData.dinnerTickets || '0', 10);

          return [
            ...(primarySelection ? [{
              id: primarySelection,
              name: pricingData.find((option) => option.id === primarySelection)?.label || primarySelection,
              amount: basePrices[primarySelection as keyof typeof basePrices] || 0,
              quantity: 1,
              category: pricingData.find((option) => option.id === primarySelection)?.category || 'individual',
            }] : []),
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
              amount: 32,
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
        }, [formData.dinnerTickets, primarySelection, pricingData, basePrices, selectedProductOptions, flagPrizeCost, stripeFee]);

        const checkoutSummaryItems = useMemo(() => {
          return checkoutItems
            .filter((item) => item.id !== 'processingFee')
            .map((item) => ({
            id: item.id,
            label: item.name,
            quantity: item.quantity,
            total: item.amount * item.quantity,
            }));
        }, [checkoutItems]);

        const handleRemoveCheckoutItem = (itemId: string) => {
          if (itemId === primarySelection) {
            setPrimarySelection('');
            setFormData((prev) => ({ ...prev, participantType: '' }));
            return;
          }

          if (selectedProducts.includes(itemId)) {
            setSelectedProducts((prev) => prev.filter((id) => id !== itemId));
            return;
          }

          if (itemId === 'dinnerTickets') {
            setFormData((prev) => ({ ...prev, dinnerTickets: '' }));
            return;
          }

          if (itemId === 'flagPrizeContribution') {
            setFormData((prev) => ({ ...prev, flagPrizeContribution: '' }));
          }
        };

        const totalRef = useRef<HTMLDivElement | null>(null);
        const [isSticky, setIsSticky] = useState(false);

        useEffect(() => {
          const observer = new IntersectionObserver(
            ([entry]) => {
              setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top <= 0);
            },
            { root: null, threshold: 0 }
          );

          const currentRef = totalRef.current;

          if (currentRef instanceof HTMLElement) {
            observer.observe(currentRef);

            const rect = currentRef.getBoundingClientRect();
            setIsSticky(rect.top <= 0);
          }

          return () => {
            if (currentRef) observer.unobserve(currentRef);
          };
        }, [totalRef]);

        const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          if (!validateForm()) return;

          const participantTypeForSubmission = primarySelection || selectedProducts[0] || '';
          const participantTypeForStorage = selectedOptionIds.join('|');

          const maxGolfers = participantTypeForSubmission === "platinumSponsorship" ? 10 :
            participantTypeForSubmission === "goldSponsorship" ? 5 :
              participantTypeForSubmission === "silverSponsorship" ? 2 : 0;

          const adjustedFormData = { ...formData };
          if (sponsorProductIds.includes(participantTypeForSubmission)) {
            adjustedFormData.contactName = formData.player1Name;
            adjustedFormData.player1Name = "";
          }

          try {
            const formattedFormData = {
              ...adjustedFormData,
              participantType: participantTypeForStorage || participantTypeForSubmission,
              selectedProductIds: selectedProducts,
              ...Object.fromEntries(
                Array.from({ length: maxGolfers }, (_, i) => {
                  const golfer = formData.golfers[i] || { name: "", handicap: "", tShirtSize: "" };
                  return [
                    [`player${i + 1}Name`, golfer.name],
                    [`player${i + 1}Handicap`, golfer.handicap],
                    [`player${i + 1}TShirtSize`, golfer.tShirtSize]
                  ];
                }).flat()
              )
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 bg-customBackground rounded-lg max-w-[1200px] m-auto py-6">
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

              <div className="col-span-full">
                <div ref={totalRef} className="mt-6 md:mt-0">
                  <div className="w-full flex flex-col border border-customInputBorder rounded-lg p-3">
                    <div className="flex flex-row justify-between items-center">
                      <h3 className="text-white/80 text-2xl font-semibold mr-2">TOTAL:</h3>
                      <p className="text-2xl text-white font-bold">${(totalPrice + stripeFee).toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col text-white/60 mt-2 space-y-1">
                      {checkoutSummaryItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2">
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
                </div>

                {isSticky && (
                  <div className="transition-all fixed top-[81px] md:top-[65px] left-0 right-0 bg-secondary-foreground md:bg-black/60 md:backdrop-blur-2xl text-white shadow-lg z-50 p-4 transition-transform">
                    <div className="max-w-[1200px] mx-auto flex justify-between items-center">
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between items-center">
                          <h3 className="text-xl font-bold">TOTAL:</h3>
                          <p className="text-2xl font-bold">${(totalPrice + stripeFee).toFixed(2)}</p>
                        </div>

                        <div className="flex flex-col text-white/60 mt-2 space-y-1">
                          {checkoutSummaryItems.map((item) => (
                            <div key={`sticky-${item.id}`} className="flex items-center justify-between gap-2">
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
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-full">
                <Accordion type="single" collapsible defaultValue={path.includes('sponsor') ? `sponsor-packages` : `individual-participants`} className="w-full">
                  <AccordionItem value="individual-participants" className="border-t border-white/80">
                    <AccordionTrigger className="text-white/80 text-lg font-semibold [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">INDIVIDUAL PARTICIPANTS:</AccordionTrigger>
                    <AccordionContent>
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
                                      type="radio"
                                      name="participantType"
                                      value={option.id}
                                      checked={primarySelection === option.id}
                                      onChange={handleChange}
                                      className="sr-only peer"
                                    />
                                    <div className="h-6 w-6 rounded-full border-2 border-customInputBorder"></div>
                                    <div className="h-4 w-4 rounded-full bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                                  </div>
                                </div>

                                {primarySelection === option.id && (
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

                  <AccordionItem value="sponsor-packages" className="border-white/80">
                    <AccordionTrigger className="text-white/80 text-lg font-semibold [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">SPONSORSHIP PACKAGES:</AccordionTrigger>
                    <AccordionContent>
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
                                      type="radio"
                                      name="participantType"
                                      value={option.id}
                                      checked={primarySelection === option.id}
                                      onChange={handleChange}
                                      className="sr-only peer"
                                    />
                                    <div className="h-6 w-6 rounded-full border-2 border-customInputBorder"></div>
                                    <div className="h-4 w-4 rounded-full bg-customInputBorder absolute top-1 left-1 scale-0 peer-checked:scale-100 transition-transform"></div>
                                  </div>
                                </div>

                                {primarySelection === option.id && (
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

                  <AccordionItem value="individual-sponsorship" className="border-white/80">
                    <AccordionTrigger className="text-white/80 text-lg font-semibold border-white/20 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-white/80">SPONSORSHIP PRODUCTS:</AccordionTrigger>
                    <AccordionContent>
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

              <div className="col-span-full my-8">
                <hr className="border-t border-white/20" />
              </div>

              {effectiveParticipantType === 'teamSponsorEntry' && !sponsorPackageIds.includes(effectiveParticipantType) && (
                <TeamFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
              )}

              {Boolean(effectiveParticipantType) && effectiveParticipantType !== 'teamSponsorEntry' && !sponsorProductIds.includes(effectiveParticipantType) && !sponsorPackageIds.includes(effectiveParticipantType) && (
                <DefaultFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
              )}

              {sponsorPackageIds.includes(effectiveParticipantType) && (
                <GolfersFormFields
                  setFormErrors={setFormErrors}
                  handleSelectChange={handleSelectChange}
                  handleChange={handleChange}
                  golfers={formData.golfers}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  formData={formData}
                  maxGolfers={
                    effectiveParticipantType === "platinumSponsorship" ? 10 :
                      effectiveParticipantType === "goldSponsorship" ? 5 :
                        effectiveParticipantType === "silverSponsorship" ? 2 : 0
                  }
                />
              )}

              {effectiveParticipantType === 'singlePlayerSponsorEntry' && (
                <SingleEntryFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
              )}

              {!primarySelection && selectedProducts.length > 0 && (
                <SponsorProductsFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} formErrors={formErrors} />
              )}

              <div className="col-span-full">
                {showSponsorshipNote && sponsorshipNote?.noteHtml && (
                  <div
                    className={`bg-black/50 mt-6 text-customInputBorder col-span-full p-3 text-sm md:text-lg rounded-lg mb-6`}
                    dangerouslySetInnerHTML={{ __html: sponsorshipNote.noteHtml }}
                  />
                )}
                <Button disabled={loading} onClick={handleCheckout} className="p-0 md:p-6 mr-[1rem] border border-customPrimary w-full bg-customPrimary hover:bg-customPrimary/60 uppercase font-text font-bold flex flex-row justify-center items-center">
                  {loading ? 'Redirecting to Secure Payment...' : 'Continue to Secure Payment'} <FaLock className="h-16 w-16 font-bold" />
                </Button>
              </div>

              <div className="col-span-full mt-8">
                <hr className="border-t border-white/20" />
              </div>
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