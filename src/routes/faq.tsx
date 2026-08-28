import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const title = "FAQ - Signature by Lilian";
const description =
  "Answers to common questions about Signature by Lilian skincare: choosing products, routines, results, safety, orders, delivery and returns.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Faq,
});

const WHATSAPP_LINK = "https://wa.me/2349046004543";

type Qa = { q: string; a: string };
type Category = { n: string; title: string; items: Qa[] };

const categories: Category[] = [
  {
    n: "01",
    title: "About SBL",
    items: [
      {
        q: "What is Signature by Lilian?",
        a: "Signature by Lilian (SBL) is a premium skincare brand focused on helping you achieve healthy, balanced, radiant skin through thoughtfully formulated skincare powered by effective ingredients and skin-loving botanicals.",
      },
      {
        q: "What makes SBL different?",
        a: "We believe skincare should be intentional, not complicated. Our products are designed to work together to support healthier-looking, more even-toned, well-nourished skin, without unnecessary product overload.",
      },
      {
        q: "Who are SBL products for?",
        a: "SBL is created with diverse skin tones and skin needs in mind, with particular attention to the unique needs of melanin-rich skin.",
      },
      {
        q: "Are SBL products suitable for all skin types?",
        a: "Our products are formulated for a range of skin types, but every skin is different. If you have particularly sensitive or reactive skin, we recommend patch testing before full use.",
      },
    ],
  },
  {
    n: "02",
    title: "Finding the Right Products",
    items: [
      {
        q: "I don't know which SBL products are right for my skin. What should I do?",
        a: "Don't guess your way through skincare. Send us a message with your skin type, major skin concerns, current routine and the products you currently use. Our team can help you build a simple SBL routine suited to your needs.",
      },
      {
        q: "Can I use more than one SBL product at a time?",
        a: "Yes. In fact, our products are designed to complement one another. However, we recommend introducing new products gradually, especially when your routine contains active ingredients.",
      },
      {
        q: "Do I need the entire SBL range to see results?",
        a: "Absolutely not. Your skin does not need a shelf full of products. A well-selected routine used consistently is more important than using everything at once.",
      },
    ],
  },
  {
    n: "03",
    title: "Using Your SBL Products",
    items: [
      {
        q: "How often should I use my SBL products?",
        a: "This depends on the specific product. Always follow the directions provided on the product packaging or product page.",
      },
      {
        q: "In what order should I apply my SBL products?",
        a: "As a general rule, apply products from the lightest texture to the heaviest. A typical routine may look like: Cleanse → Mist/Tone → Serum → Moisturise → Sunscreen. For body care: Cleanse → Exfoliate → Treat/Moisturise → Seal. Your exact routine may vary depending on the products you use.",
      },
      {
        q: "Can I use SBL products every day?",
        a: "Some products are designed for daily use, while exfoliating or highly active products may require less frequent use. Always follow the recommended usage for each product.",
      },
      {
        q: "Should I patch test before using an SBL product?",
        a: "Yes. We recommend patch testing new skincare products, particularly if you have sensitive skin or are introducing active ingredients. Apply a small amount to a discreet area and monitor your skin before applying the product more broadly.",
      },
      {
        q: "Can I use SBL products if I have acne-prone or oily skin?",
        a: "Some SBL products may be suitable for oily or acne-prone skin, but the right combination depends on your skin and concerns. Send us a message for a personalised product recommendation.",
      },
      {
        q: "Can I combine SBL products with products from other brands?",
        a: "Yes, but ingredients matter. If you are using multiple active ingredients, introducing too many at once may increase the risk of irritation. If you're unsure about combining products, ask us before adding them to your routine.",
      },
    ],
  },
  {
    n: "04",
    title: "Results & Expectations",
    items: [
      {
        q: "How long will it take to see results?",
        a: "Skincare is a consistency game, not a magic trick. The time required varies according to your skin, concern and routine. Some improvements may be noticed relatively quickly, while concerns such as uneven tone and pigmentation generally require consistent care over time.",
      },
      {
        q: "Will SBL products change my natural skin colour?",
        a: "No. Our goal is healthy, radiant and even-looking skin, not to change your natural complexion.",
      },
      {
        q: "Can SBL products remove dark spots?",
        a: "Our targeted products are formulated to support a more even-looking complexion and improve the appearance of uneven tone and dark spots with consistent use. Results vary from person to person.",
      },
      {
        q: "Can I expect overnight results?",
        a: "We'd rather give you honest skincare than fairy tales. SBL focuses on healthy, sustainable skin improvement. Consistency, patience and the right routine matter.",
      },
    ],
  },
  {
    n: "05",
    title: "Product Safety",
    items: [
      {
        q: "What if a product irritates my skin?",
        a: "Discontinue use if you experience significant irritation, burning, swelling, rash or persistent discomfort. If symptoms continue or are severe, seek advice from a qualified healthcare professional.",
      },
      {
        q: "Can I use SBL products during pregnancy or breastfeeding?",
        a: "Because individual circumstances and ingredients vary, we recommend speaking with your doctor or qualified healthcare provider before introducing new skincare products during pregnancy or breastfeeding.",
      },
      {
        q: "Where can I find the ingredients in SBL products?",
        a: "The ingredients are listed on the relevant product packaging and/or product information provided by SBL. If you have an allergy or ingredient concern, please check the ingredient list before use.",
      },
    ],
  },
  {
    n: "06",
    title: "Orders & Delivery",
    items: [
      {
        q: "How do I place an order?",
        a: "You can place your order through our official SBL ordering channels. If you need help selecting products, our team can assist you before you complete your purchase.",
      },
      {
        q: "Do you deliver outside Abuja?",
        a: "Yes. SBL delivers to customers across Nigeria. Delivery timelines and fees depend on your location and the courier service available.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery time depends on your location and the courier. Your delivery timeline will be communicated when your order is confirmed.",
      },
      {
        q: "How much is delivery?",
        a: "Delivery fees vary according to location, package size and courier charges. Your applicable delivery fee will be communicated before your order is dispatched.",
      },
      {
        q: "Can someone else receive my order for me?",
        a: "Yes. Please provide the correct recipient's name and phone number when placing your order.",
      },
      {
        q: "What happens if my order arrives damaged or incorrect?",
        a: "Please contact us as soon as possible with your order details and clear photos or videos of the package and affected product. We will review the issue and guide you through the resolution process.",
      },
    ],
  },
  {
    n: "07",
    title: "Returns & Exchanges",
    items: [
      {
        q: "Can I return an SBL product?",
        a: "Because skincare products are personal-use products, returns and exchanges are subject to SBL's return policy. Please contact us before sending any product back.",
      },
      {
        q: "Can I return a product because I don't like the result?",
        a: "Skincare results vary between individuals and depend on factors such as skin type, consistency and existing routine. A change in skin concern or lack of immediate results does not automatically qualify a product for return.",
      },
      {
        q: "What if I received the wrong product?",
        a: "Contact us immediately with your order number and details of the product received. We will investigate and assist with the appropriate resolution.",
      },
    ],
  },
  {
    n: "08",
    title: "Authenticity & Storage",
    items: [
      {
        q: "How do I know my SBL product is authentic?",
        a: "For product integrity and customer safety, we recommend purchasing directly from SBL or an authorised SBL sales channel.",
      },
      {
        q: "How should I store my SBL products?",
        a: "Store products in a cool, dry place away from direct sunlight and excessive heat. Keep containers properly closed when not in use. Proper storage helps maintain product quality.",
      },
      {
        q: "Can my skincare change colour or texture over time?",
        a: "Some formulations containing botanical ingredients or active ingredients may naturally show slight variations. However, if you notice a significant change in appearance, smell or texture, discontinue use and contact us.",
      },
    ],
  },
];

function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-serif text-3xl text-accent/30 lg:text-4xl">{n}</span>
      <span className="eyebrow text-sm tracking-[0.32em] text-accent">{children}</span>
    </div>
  );
}

function Faq() {
  return (
    <>
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 font-serif text-[13rem] leading-none text-accent/[0.05] select-none lg:text-[20rem]"
        >
          FAQ
        </span>
        <div className="relative mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <Reveal className="max-w-2xl">
            <SectionLabel n="00">Frequently Asked Questions</SectionLabel>
            <h1 className="mt-7 font-serif text-[2.75rem] leading-[1.05] text-foreground lg:text-6xl">
              Your skin doesn't need
              <span className="block text-plum italic">mixed signals.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              It needs the right care, consistently. Here are answers to the questions we hear
              most, from choosing your first routine to orders, delivery and returns.
            </p>
          </Reveal>
        </div>
      </section>

      {categories.map((cat, i) => (
        <section
          key={cat.title}
          className={i === 0 ? "border-t border-border" : "border-t border-border"}
        >
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16 lg:px-10 lg:py-20">
            <Reveal>
              <SectionLabel n={cat.n}>{cat.title}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <Accordion type="single" collapsible className="w-full">
                {cat.items.map((item, idx) => (
                  <AccordionItem key={item.q} value={`${cat.n}-${idx}`} className="border-border">
                    <AccordionTrigger className="py-6 text-left font-serif text-lg text-foreground hover:no-underline lg:text-xl">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-2xl pb-6 leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="relative overflow-hidden border-t border-border bg-plum text-primary-foreground">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[16rem] leading-none text-primary-foreground/[0.06] select-none"
        >
          &rdquo;
        </span>
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10 lg:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <span className="eyebrow text-sm tracking-[0.32em] text-champagne">
              Still Have Questions?
            </span>
            <p className="mt-8 font-serif text-3xl leading-snug italic lg:text-4xl">
              Tell us your skin type, your main concern, your current routine and what products
              you use.
            </p>
            <p className="mt-6 leading-relaxed text-primary-foreground/75">
              We'll help you build a routine that makes sense for your skin, not just sell you a
              basket of products.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="eyebrow bg-champagne px-8 py-4 text-center text-plum transition-colors hover:bg-background"
              >
                Message Us on WhatsApp
              </a>
              <Link
                to="/contact"
                className="eyebrow border border-champagne/70 px-8 py-4 text-center text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
