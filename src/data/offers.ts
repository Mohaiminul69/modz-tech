import type { StaticImageData } from "next/image";
import heroProduct from "@public/products/hero-section-product.jpg";
import airpodsPro2 from "@public/products/earbuds-pro2.jpg";
import airpodsPro3 from "@public/products/earbuds-pro3.jpg";

export type OfferIcon = "earbuds" | "battery" | "watch";

export type Offer = {
  id: string;
  slug: string;
  discount: string;
  name: string;
  descriptor: string;
  price: number;
  oldPrice: number;
  image: StaticImageData | null;
  icon: OfferIcon;
};

// "01 — Offers" strip on the homepage, directly under the hero.
// end date drives the "ENDS ..." pill; hide the section once it has passed.
export const offersEndDate = "Ends 30 Sep, 11:59 PM";

export const offers: Offer[] = [
  {
    id: "hoco-eq-34-plus",
    slug: "/shop/hoco-eq-34-plus",
    discount: "-26%",
    name: "Hoco EQ34 Plus",
    descriptor: "ANC+ENC TWS",
    price: 729,
    oldPrice: 990,
    image: heroProduct,
    icon: "earbuds",
  },
  {
    id: "pro_2",
    slug: "/shop/pro_2",
    discount: "-21%",
    name: "Hoco J102",
    descriptor: "Best in budget",
    price: 500,
    oldPrice: 550,
    image: airpodsPro2,
    icon: "battery",
  },
  {
    id: "pro_3",
    slug: "/shop/pro_3",
    discount: "-19%",
    name: "Airpods Pro 3",
    descriptor: "Comes with ANC",
    price: 2149,
    oldPrice: 2500,
    image: airpodsPro3,
    icon: "watch",
  },
];
