import { Banknote, Headphones, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Banknote, title: "Cash on delivery", text: "Pay when it arrives" },
  { icon: ShieldCheck, title: "100% authentic", text: "Original products only" },
  { icon: Truck, title: "All over Bangladesh", text: "Home delivery" },
  { icon: Headphones, title: "Here to help", text: "Message us on Facebook" },
];

// brand-tint box with the four shop promises. Reused on product and cart pages later.
export const TrustStrip = () => (
  <section aria-label="Why shop with us" className="p-4 lg:px-0 lg:pt-8 lg:pb-2">
    <ul className="grid grid-cols-2 gap-x-3 gap-y-3.5 rounded-lg bg-brand-tint p-4 lg:grid-cols-4 lg:gap-6 lg:px-7 lg:py-6">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-center gap-2 lg:gap-3">
          <Icon aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-brand-bright lg:size-7" />
          <div>
            <p className="text-label font-semibold text-ink lg:text-body lg:leading-5.5">{title}</p>
            <p className="text-small text-ink-muted lg:text-small-lg">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
