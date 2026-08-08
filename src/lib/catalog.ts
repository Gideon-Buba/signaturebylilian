import serum from "@/assets/product-serum.jpg";
import cream from "@/assets/product-cream.jpg";
import cleanser from "@/assets/product-cleanser.jpg";
import oil from "@/assets/product-oil.jpg";

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
    id: "radiance-serum",
    name: "Radiance Renewal Serum",
    blurb: "A weightless brightening serum with peptides and vitamin C.",
    price: 48,
    rating: 4.9,
    reviews: 214,
    tag: "Best Seller",
    image: serum,
    benefits: ["Evens tone", "Boosts glow", "Softens fine lines"],
  },
  {
    id: "brightening-cream",
    name: "Brightening Face Cream",
    blurb: "Rich yet breathable moisture with niacinamide and peony extract.",
    price: 42,
    rating: 4.8,
    reviews: 168,
    tag: "Signature",
    image: cream,
    benefits: ["24h hydration", "Strengthens barrier", "Luminous finish"],
  },
  {
    id: "gentle-cleanser",
    name: "Gentle Cleanser",
    blurb: "A pH-balanced cleanse that never strips or tightens the skin.",
    price: 28,
    rating: 4.7,
    reviews: 302,
    tag: "Best Seller",
    image: cleanser,
    benefits: ["Soothes", "Removes impurities", "Fragrance free"],
  },
  {
    id: "nourish-oil",
    name: "Nourish Facial Oil",
    blurb: "A silken night oil of marula, rosehip and squalane.",
    price: 54,
    rating: 4.9,
    reviews: 97,
    tag: "New",
    image: oil,
    benefits: ["Deep nourishment", "Restores suppleness", "Overnight repair"],
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
