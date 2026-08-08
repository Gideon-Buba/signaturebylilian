import bodyButter from "@/assets/product-body-butter.jpeg";
import bodyOil from "@/assets/product-body-oil.jpeg";
import bodyScrub from "@/assets/product-body-scrub.jpeg";
import faceSoap from "@/assets/product-face-soap.jpeg";
import glowSerum from "@/assets/product-glow-serum.jpeg";

export type Product = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  rating: number;
  reviews: number;
  tag: "Best Seller" | "New" | "Signature";
  image: string;
  benefits: string[];
};

export const products: Product[] = [
  {
    id: "body-butter-300g",
    name: "Body Butter (300g)",
    blurb: "A rich, whipped body butter with mango, sweet almond and carrot seed oil.",
    price: 19500,
    rating: 4.9,
    reviews: 184,
    tag: "Best Seller",
    image: bodyButter,
    benefits: ["Deep hydration", "Softens skin", "Rich, whipped texture"],
  },
  {
    id: "body-butter-100g",
    name: "Body Butter (100g)",
    blurb: "Our whipped mango and sweet almond body butter in an everyday size.",
    price: 12000,
    rating: 4.9,
    reviews: 112,
    tag: "Signature",
    image: bodyButter,
    benefits: ["Deep hydration", "Softens skin", "Rich, whipped texture"],
  },
  {
    id: "body-butter-50g",
    name: "Body Butter (50g)",
    blurb: "The whipped mango and sweet almond body butter, sized for travel.",
    price: 6500,
    rating: 4.8,
    reviews: 63,
    tag: "New",
    image: bodyButter,
    benefits: ["Deep hydration", "Softens skin", "Travel friendly"],
  },
  {
    id: "body-oil-200ml",
    name: "Body Oil (200ml)",
    blurb: "A luminous body oil blended with argan, rosehip and carrot.",
    price: 18500,
    rating: 4.9,
    reviews: 141,
    tag: "Best Seller",
    image: bodyOil,
    benefits: ["Nourishes skin", "Adds radiant glow", "Fast-absorbing"],
  },
  {
    id: "body-scrub-400g",
    name: "Body Scrub (400g)",
    blurb: "An exfoliating body scrub with citrus, turmeric and papaya.",
    price: 15500,
    rating: 4.7,
    reviews: 98,
    tag: "New",
    image: bodyScrub,
    benefits: ["Gently exfoliates", "Brightens skin", "Smooths texture"],
  },
  {
    id: "face-soap-200g",
    name: "Face Soap (200g)",
    blurb: "A nourishing face soap with carrot, fenugreek and goat milk.",
    price: 9500,
    rating: 4.8,
    reviews: 156,
    tag: "Signature",
    image: faceSoap,
    benefits: ["Cleanses gently", "Evens tone", "Nourishing lather"],
  },
  {
    id: "glow-serum-50ml",
    name: "Glow Serum (50ml)",
    blurb: "A brightening face serum with vitamin C and niacinamide.",
    price: 7000,
    rating: 4.9,
    reviews: 227,
    tag: "Best Seller",
    image: glowSerum,
    benefits: ["Brightens complexion", "Evens tone", "Boosts radiance"],
  },
];

export type Treatment = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  benefits: string[];
};

export const treatments: Treatment[] = [
  {
    id: "signature-facial",
    name: "The Signature Facial",
    description:
      "Our defining ritual — deep cleansing, lymphatic massage and a bespoke mask tailored to your skin on the day.",
    duration: "75 min",
    price: 120,
    benefits: ["Deep renewal", "Visible glow", "Tension release"],
  },
  {
    id: "gold-body-ritual",
    name: "Champagne Gold Body Ritual",
    description:
      "A full-body exfoliation and warm oil massage finished with a shimmering gold hydrating wrap.",
    duration: "90 min",
    price: 165,
    benefits: ["Silken skin", "Deep relaxation", "Circulation"],
  },
  {
    id: "warm-stone",
    name: "Warm Stone Massage",
    description:
      "Heated basalt stones and slow, grounding pressure to unwind held tension from head to toe.",
    duration: "60 min",
    price: 110,
    benefits: ["Muscle relief", "Calms the mind", "Restores balance"],
  },
  {
    id: "oasis-escape",
    name: "The Oasis Escape",
    description:
      "A half-day journey: facial, body ritual, scalp treatment and time in our quiet lounge.",
    duration: "150 min",
    price: 280,
    benefits: ["Total reset", "Head-to-toe care", "Private lounge"],
  },
];
