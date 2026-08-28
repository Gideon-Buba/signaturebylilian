import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";

const title = "Return & Exchange Policy - Signature by Lilian";
const description =
  "Signature by Lilian Skincare's Return & Exchange Policy: when returns are accepted, how to request one, and how refunds and store credit work.";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Returns,
});

type Block = { p: string } | { ul: string[] };
type Section = { id: string; n: string; title: string; blocks: Block[] };

const sections: Section[] = [
  {
    id: "general-policy",
    n: "01",
    title: "Our General Return Policy",
    blocks: [
      { p: "SBL accepts returns or exchanges for products that are:" },
      {
        ul: [
          "Received damaged or leaking.",
          "Incorrectly supplied by SBL.",
          "Defective or compromised before use.",
          "Significantly different from the product ordered.",
          "Unopened, unused and in their original condition, where a return is approved by SBL.",
        ],
      },
      {
        p: "Returns are not accepted simply because a customer has changed their mind after receiving an order, unless SBL expressly agrees to the return.",
      },
      {
        p: "Due to hygiene, safety and product-integrity considerations, opened, used or partially used skincare products are generally not eligible for return or exchange.",
      },
    ],
  },
  {
    id: "damaged-products",
    n: "02",
    title: "Damaged Products",
    blocks: [
      {
        p: "We take great care in packaging our products before dispatch. However, products may occasionally be damaged during transportation.",
      },
      { p: "If your order arrives damaged:" },
      {
        ul: [
          "Take clear photographs of the package before opening it, where possible.",
          "Take clear photographs of the damaged product and packaging.",
          "Contact SBL within 24 hours of delivery.",
          "Provide your order number and the required photographs/videos.",
        ],
      },
      { p: "After reviewing the evidence, SBL may, at its discretion:" },
      {
        ul: [
          "Replace the damaged product at no additional product cost;",
          "Replace the affected item with an equivalent product;",
          "Issue store credit; or",
          "Provide another appropriate resolution.",
        ],
      },
      {
        p: "Where the damage is clearly attributable to SBL or the delivery process, SBL will bear the reasonable cost of replacing the affected product.",
      },
    ],
  },
  {
    id: "wrong-or-missing",
    n: "03",
    title: "Wrong Product or Missing Item",
    blocks: [
      {
        p: "If you receive an item that you did not order, or an item is missing from your package, please notify us within 24 hours of delivery.",
      },
      { p: "The notification should include:" },
      {
        ul: [
          "Your full name;",
          "Order number;",
          "Description of the incorrect or missing item;",
          "Clear photographs of the items received; and",
          "A photograph of the packaging/order label where applicable.",
        ],
      },
      {
        p: "Where SBL confirms that the error originated from us, we will arrange for the correct item to be supplied or provide another appropriate resolution.",
      },
      { p: "If the incorrect product was supplied by SBL, please do not open or use it." },
    ],
  },
  {
    id: "defective-products",
    n: "04",
    title: "Defective or Compromised Products",
    blocks: [
      {
        p: "If you believe a product is defective, contaminated, compromised or otherwise unsuitable for use, stop using the product immediately and contact SBL.",
      },
      { p: "Examples may include:" },
      {
        ul: [
          "Damaged packaging affecting product integrity;",
          "Product leakage;",
          "Broken or defective packaging;",
          "An unusual change in the product's appearance, texture or smell that is inconsistent with the product's normal characteristics;",
          "A product received in a condition that suggests it may have been compromised.",
        ],
      },
      { p: "Customers should not continue using a product they believe may be compromised." },
      {
        p: "SBL may request photographs, videos, batch information and other details to enable us to investigate the complaint.",
      },
      { p: "Where appropriate, the product may be requested for inspection." },
    ],
  },
  {
    id: "unopened-products",
    n: "05",
    title: "Unopened and Unused Products",
    blocks: [
      { p: "An unopened and unused product may be considered for return or exchange where:" },
      {
        ul: [
          "The request is made within 7 days of delivery;",
          "The product remains completely unopened and unused;",
          "The original packaging, seals and labels are intact;",
          "The product is in a resalable condition; and",
          "SBL approves the return before the product is sent back.",
        ],
      },
      { p: "Customers must not send products back without receiving approval from SBL first." },
      { p: "Products returned without prior approval may not be accepted." },
      {
        p: "Return delivery costs for approved change-of-mind returns are the responsibility of the customer unless the return resulted from an error attributable to SBL.",
      },
    ],
  },
  {
    id: "opened-products",
    n: "06",
    title: "Opened or Used Products",
    blocks: [
      {
        p: "For hygiene and safety reasons, SBL does not accept returns or exchanges of opened, used or partially used skincare products, except where required by applicable law or where SBL determines that the product is defective or otherwise compromised.",
      },
      { p: "This applies even where:" },
      {
        ul: [
          "The customer does not like the smell, colour or texture;",
          "The customer has changed their mind;",
          "The customer purchased the wrong product;",
          "The product was not what the customer expected;",
          "The customer decides that the product is not suitable for their personal skincare preferences.",
        ],
      },
      {
        p: "We therefore encourage customers to carefully review product descriptions and, where necessary, contact SBL before purchasing if they need assistance selecting a product.",
      },
    ],
  },
  {
    id: "allergic-reactions",
    n: "07",
    title: "Allergic Reactions and Skin Sensitivity",
    blocks: [
      {
        p: "SBL takes product safety seriously. However, individual skin types can respond differently to skincare products.",
      },
      {
        p: "A customer experiencing irritation, discomfort, redness, itching, burning or another unexpected reaction should discontinue use immediately.",
      },
      { p: "Where a reaction occurs, contact SBL as soon as possible and provide details of:" },
      {
        ul: [
          "The product used;",
          "How the product was used;",
          "When the reaction occurred;",
          "Any relevant photographs; and",
          "The product batch number, where available.",
        ],
      },
      { p: "SBL may request additional information to assist with investigating the matter." },
      {
        p: "A product will not automatically qualify for a refund or exchange solely because it caused an individual reaction.",
      },
      {
        p: "Customers are encouraged to perform a patch test before introducing a new skincare product and to follow the directions provided by SBL.",
      },
      {
        p: "Where a customer has a known allergy or sensitivity to an ingredient, the customer is responsible for reviewing the product information and seeking appropriate professional advice before use.",
      },
    ],
  },
  {
    id: "wrong-product-ordered",
    n: "08",
    title: "Wrong Product Ordered by Customer",
    blocks: [
      {
        p: "If a customer accidentally orders the wrong product, size, quantity or variant, please contact SBL as soon as possible.",
      },
      {
        p: "If the order has not yet been dispatched, SBL will make reasonable efforts to amend the order where possible.",
      },
      { p: "Once an order has been dispatched or delivered, changes may not be possible." },
      { p: "An exchange may be considered only where the product is:" },
      {
        ul: [
          "Unopened;",
          "Unused;",
          "In its original packaging; and",
          "Returned within the applicable return period.",
        ],
      },
      {
        p: "Any additional delivery or price difference arising from an approved exchange may be borne by the customer.",
      },
    ],
  },
  {
    id: "gifts",
    n: "09",
    title: "Products Purchased as Gifts",
    blocks: [
      { p: "Products purchased as gifts are subject to the same return and exchange conditions." },
      {
        p: "Refunds, where applicable, will generally be issued to the original purchaser and through the original payment method.",
      },
      { p: "SBL does not guarantee that a gift recipient will be eligible for a cash refund." },
    ],
  },
  {
    id: "sale-products",
    n: "10",
    title: "Sale, Promotional and Discounted Products",
    blocks: [
      {
        p: "Products purchased during a sale, promotion, flash sale or special campaign are subject to the terms communicated for that particular promotion.",
      },
      { p: "Unless otherwise stated:" },
      {
        ul: [
          "Promotional products remain subject to our damage, defect and incorrect-order protections.",
          "Change-of-mind returns may not be available for promotional purchases.",
          "Complimentary products or gifts included with an order are not refundable and have no cash value.",
        ],
      },
      {
        p: "Where a promotional order is approved for return, SBL may adjust the refund to account for discounts, promotional pricing, complimentary items or bundled offers.",
      },
    ],
  },
  {
    id: "bundles",
    n: "11",
    title: "Bundles and Gift Sets",
    blocks: [
      {
        p: "Where products are purchased as part of a bundle or gift set, the products may be required to be returned together.",
      },
      {
        p: "Individual items from a bundle may not be eligible for a separate refund where the bundle was purchased at a discounted price.",
      },
      {
        p: "If an individual item within a bundle is damaged or incorrectly supplied by SBL, SBL will assess the affected item and provide an appropriate resolution.",
      },
    ],
  },
  {
    id: "delivery-return-costs",
    n: "12",
    title: "Delivery and Return Costs",
    blocks: [
      { p: "Where SBL is responsible" },
      { p: "SBL will bear reasonable return or replacement delivery costs where the issue resulted from:" },
      {
        ul: [
          "An incorrect item supplied by SBL;",
          "A confirmed manufacturing/product defect;",
          "A confirmed damaged item attributable to SBL's packaging or handling; or",
          "Another error directly attributable to SBL.",
        ],
      },
      { p: "Where the customer is responsible" },
      {
        p: "The customer may be responsible for return and redelivery costs where the return or exchange is due to:",
      },
      {
        ul: [
          "Change of mind;",
          "Incorrect product selected by the customer;",
          "Incorrect size or quantity selected by the customer;",
          "Incorrect delivery information supplied by the customer; or",
          "Another circumstance not caused by SBL.",
        ],
      },
    ],
  },
  {
    id: "address-errors",
    n: "13",
    title: "Delivery Address Errors",
    blocks: [
      {
        p: "Customers are responsible for providing accurate delivery information at the time of placing an order.",
      },
      { p: "SBL is not responsible for delays, failed deliveries or additional delivery charges arising from:" },
      {
        ul: [
          "Incorrect address;",
          "Incomplete address;",
          "Incorrect telephone number;",
          "Unavailable recipient; or",
          "Failure to respond to the delivery agent.",
        ],
      },
      {
        p: "If an order needs to be redelivered because incorrect information was supplied by the customer, additional delivery charges may apply.",
      },
    ],
  },
  {
    id: "uncollected-orders",
    n: "14",
    title: "Uncollected Orders",
    blocks: [
      {
        p: "Where a customer fails to collect or receive an order after reasonable delivery attempts, the order may be returned to SBL.",
      },
      { p: "If the customer requests redelivery, the customer may be required to pay the applicable redelivery fee." },
      { p: "Failure to collect an order does not automatically qualify the customer for a refund." },
    ],
  },
  {
    id: "refunds",
    n: "15",
    title: "Refunds",
    blocks: [
      {
        p: "Where SBL approves a refund, the refund will generally be processed through the original payment method.",
      },
      { p: "Refund processing times may depend on the payment provider or financial institution." },
      { p: "Depending on the circumstances, SBL may instead offer:" },
      { ul: ["A replacement product;", "Store credit;", "An exchange; or", "A refund."] },
      { p: "SBL will communicate the applicable resolution before processing the return." },
      {
        p: "Delivery charges are generally non-refundable, except where the return is due to an error or issue attributable to SBL.",
      },
    ],
  },
  {
    id: "store-credit",
    n: "16",
    title: "Store Credit",
    blocks: [
      { p: "Where store credit is offered or selected, the credit may be applied toward a future SBL purchase." },
      { p: "Store credit:" },
      {
        ul: [
          "Is not redeemable for cash;",
          "Cannot be transferred unless SBL expressly permits it;",
          "May be subject to an expiry period where stated; and",
          "Cannot be used to cover charges that are not included in the applicable credit.",
        ],
      },
    ],
  },
  {
    id: "approval-process",
    n: "17",
    title: "Return Approval Process",
    blocks: [
      {
        p: "To request a return or exchange, customers should contact SBL through the official customer service channel and provide:",
      },
      {
        ul: [
          "Full name;",
          "Order number;",
          "Date of purchase;",
          "Product name;",
          "Reason for the return/exchange;",
          "Clear photographs or videos where applicable; and",
          "Any other information reasonably requested by SBL.",
        ],
      },
      { p: "SBL will review the request and communicate whether the return or exchange has been approved." },
      { p: "Do not send a product back until SBL has provided return instructions." },
    ],
  },
  {
    id: "return-conditions",
    n: "18",
    title: "Return Conditions",
    blocks: [
      { p: "Approved returned products must:" },
      {
        ul: [
          "Be securely packaged;",
          "Include the original packaging where applicable;",
          "Have all original seals and labels intact, where applicable;",
          "Not have been altered, refilled or tampered with;",
          "Not show signs of use unless SBL specifically requests the product for investigation; and",
          "Be returned according to the instructions provided by SBL.",
        ],
      },
      {
        p: "SBL reserves the right to reject a return where the product does not meet the applicable return conditions.",
      },
    ],
  },
  {
    id: "third-parties",
    n: "19",
    title: "Products Purchased Through Third Parties",
    blocks: [
      {
        p: "If an SBL product was purchased through an authorised retailer, reseller, distributor, spa or other third-party seller, the customer's first point of contact should generally be the seller from whom the product was purchased.",
      },
      { p: "The third party's return policy may apply." },
      {
        p: "Where necessary, SBL may assist with product-related complaints concerning authenticity, quality or safety.",
      },
    ],
  },
  {
    id: "unauthorised-resellers",
    n: "20",
    title: "Unauthorised Resellers",
    blocks: [
      {
        p: "SBL cannot guarantee the authenticity, storage conditions, handling or integrity of products purchased from unauthorised sellers.",
      },
      {
        p: "Returns or complaints relating to products purchased from unauthorised sources may therefore be subject to additional verification.",
      },
      { p: "Customers are encouraged to purchase SBL products directly from SBL or through authorised sales channels." },
    ],
  },
  {
    id: "product-storage",
    n: "21",
    title: "Product Storage",
    blocks: [
      {
        p: "Customers are responsible for storing products according to the instructions provided on the product packaging.",
      },
      { p: "SBL may not accept returns or product complaints arising from improper storage, including exposure to:" },
      {
        ul: [
          "Excessive heat;",
          "Direct sunlight;",
          "Moisture;",
          "Contamination;",
          "Freezing conditions; or",
          "Other inappropriate storage conditions.",
        ],
      },
    ],
  },
  {
    id: "expired-products",
    n: "22",
    title: "Expired Products",
    blocks: [
      {
        p: "Customers should not use products beyond the stated expiry period or recommended period after opening, where applicable.",
      },
      {
        p: "Products that have expired after delivery due to the customer's failure to use or store them appropriately are not eligible for return.",
      },
      {
        p: "If an expired product is received from SBL, please contact us immediately with photographs showing the relevant batch and expiry information.",
      },
    ],
  },
  {
    id: "fraudulent-returns",
    n: "23",
    title: "Fraudulent or Abusive Returns",
    blocks: [
      {
        p: "SBL reserves the right to refuse returns, exchanges or refunds where there is reasonable evidence of:",
      },
      {
        ul: [
          "Fraudulent activity;",
          "Product tampering;",
          "Repeated unreasonable return requests;",
          "Misrepresentation of the condition of a product;",
          "Intentional damage;",
          "Removal or alteration of product labels or batch information; or",
          "Any attempt to misuse this policy.",
        ],
      },
      { p: "This does not affect any rights available to customers under applicable law." },
    ],
  },
  {
    id: "customer-responsibility",
    n: "24",
    title: "Customer Responsibility",
    blocks: [
      { p: "Before placing an order, customers are encouraged to:" },
      {
        ul: [
          "Review product descriptions;",
          "Review ingredients where available;",
          "Select the appropriate product and quantity;",
          "Provide accurate delivery information;",
          "Follow product directions;",
          "Perform a patch test where appropriate; and",
          "Contact SBL if they require assistance selecting a product.",
        ],
      },
      {
        p: "SBL's customer service team may provide general product guidance, but such guidance does not constitute medical advice or a diagnosis.",
      },
    ],
  },
  {
    id: "our-commitment",
    n: "25",
    title: "Our Commitment to You",
    blocks: [
      {
        p: "At SBL, we believe that customer service should not end when an order leaves our hands.",
      },
      {
        p: "If you experience a genuine issue with your order, please contact us. We will review the situation fairly and work toward a reasonable resolution.",
      },
      { p: "Our goal is to protect both your experience and the integrity of our products." },
    ],
  },
  {
    id: "important-note",
    n: "26",
    title: "Important Note",
    blocks: [
      {
        p: "This policy is intended to establish SBL's standard returns and exchange procedures. Nothing in this policy is intended to remove or restrict any consumer rights that cannot legally be excluded under applicable law.",
      },
      {
        p: "SBL reserves the right to amend this policy when necessary. The version applicable to an order will generally be the policy in effect at the time the order was placed, subject to applicable law.",
      },
    ],
  },
];

const EFFECTIVE_DATE = "27 August 2026";
const LAST_UPDATED = "27 August 2026";

function Returns() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-accent">Signature by Lilian Skincare</p>
            <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.08] text-foreground lg:text-6xl">
              Return &amp; Exchange Policy
            </h1>
            <p className="mt-6 text-sm text-muted-foreground">
              Effective date: {EFFECTIVE_DATE} · Last updated: {LAST_UPDATED}
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              At Signature by Lilian Skincare (SBL), we are committed to providing high-quality
              skincare products that are carefully formulated, packaged and prepared for your skin
              journey.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Because our products are skincare and personal-care products, we maintain strict
              hygiene and product-safety standards. For this reason, returns and exchanges are
              accepted only under the circumstances outlined in this policy.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              By placing an order with SBL, you acknowledge and agree to the terms of this Return
              &amp; Exchange Policy.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[260px_1fr] lg:gap-20">
          <Reveal as="header" className="hidden lg:block">
            <nav aria-label="Sections" className="sticky top-28">
              <p className="eyebrow text-muted-foreground">On this page</p>
              <ul className="mt-5 space-y-3 border-l border-border pl-5 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-muted-foreground transition-colors hover:text-accent"
                    >
                      {s.n}. {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#contact"
                    className="text-muted-foreground transition-colors hover:text-accent"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </Reveal>

          <div className="max-w-2xl">
            {sections.map((section, i) => (
              <Reveal
                key={section.id}
                delay={Math.min(i * 20, 200)}
                as="section"
                className="scroll-mt-28 border-b border-border py-10 first:pt-0"
              >
                <div id={section.id} className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-accent/40">{section.n}</span>
                  <h2 className="font-serif text-2xl text-foreground lg:text-[1.7rem]">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                  {section.blocks.map((block, bi) =>
                    "p" in block ? (
                      <p key={bi}>{block.p}</p>
                    ) : (
                      <ul key={bi} className="list-disc space-y-2 pl-5">
                        {block.ul.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </Reveal>
            ))}

            <Reveal as="section" className="scroll-mt-28 py-10">
              <div id="contact" className="flex scroll-mt-28 items-baseline gap-4">
                <span className="font-serif text-2xl text-accent/40">·</span>
                <h2 className="font-serif text-2xl text-foreground lg:text-[1.7rem]">Contact Us</h2>
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                For return, exchange or product-related enquiries, reach Signature by Lilian
                Skincare (SBL) through:
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <span className="eyebrow text-muted-foreground">Email </span>
                  <a
                    href="mailto:info@signaturebylilian.com"
                    className="text-foreground transition-colors hover:text-accent"
                  >
                    info@signaturebylilian.com
                  </a>
                </li>
                <li>
                  <span className="eyebrow text-muted-foreground">WhatsApp </span>
                  <a
                    href="https://wa.me/2349046004543"
                    className="text-foreground transition-colors hover:text-accent"
                  >
                    09046004543
                  </a>
                </li>
                <li>
                  <span className="eyebrow text-muted-foreground">Instagram </span>
                  <a
                    href="https://www.instagram.com/sbl.skincare?igsh=MWExdjYyeHJ2dWpycg=="
                    className="text-foreground transition-colors hover:text-accent"
                  >
                    @sbl.skincare
                  </a>
                </li>
                <li>
                  <span className="eyebrow text-muted-foreground">Website </span>
                  <span className="text-foreground">signaturebylilian.com</span>
                </li>
              </ul>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Please include your order number in all return and exchange enquiries.
              </p>
              <p className="eyebrow mt-10 text-plum">
                SBL Skincare — Healthy Skin. Intentional Care. Signature Glow.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
