import heroProduct from "../assets/products/hero_section_product.jpg";
import airpodsPro2 from "../assets/products/earbuds_pro2.jpg";
import airpodsPro3 from "../assets/products/earbuds_pro3.jpg";
import nintentoCover from "../assets/products/nintendo.png";

// "02 — Featured products" grid, directly under the offers strip.
// image: null shows a styled icon placeholder — swap in a real 4:3 product
// shot (~560x420 @2x) once photography exists, per the design handoff.
export const products = [
  {
    id: "hoco-eq-34-plus",
    slug: "/shop/hoco-eq-34-plus",
    category: "Audio",
    badge: "Bestseller",
    name: "Hoco EQ34 Plus",
    note: "ANC+ENC TWS with a 32-hour case battery.",
    price: 729,
    image: heroProduct,
    icon: "earbuds",
  },
  {
    id: "pro_2",
    slug: "/shop/pro_2",
    category: "Power",
    badge: "New",
    name: "Hoco J102",
    note: "20,000mAh power bank, best in budget.",
    price: 500,
    image: airpodsPro2,
    icon: "battery",
  },
  {
    id: "pro_3",
    slug: "/shop/pro_3",
    category: "Audio",
    badge: "Limited",
    name: "Airpods Pro 3",
    note: "Active noise cancellation, USB-C case.",
    price: 2149,
    image: airpodsPro3,
    icon: "watch",
  },
  {
    id: "nitento_cover",
    slug: "/shop/nitento_cover",
    category: "Accessories",
    badge: "Restocked",
    name: "Nitento Phone Case",
    note: "Protect your phone with our premium case.",
    price: 890,
    image: nintentoCover,
    icon: "hub",
  },
];
