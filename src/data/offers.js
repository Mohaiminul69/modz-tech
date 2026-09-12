import heroProduct from "../assets/products/hero_section_product.jpg";
import airpodsPro2 from "../assets/products/earbuds_pro2.jpg";
import airpodsPro3 from "../assets/products/earbuds_pro3.jpg";

// "01 — Offers" strip on the homepage, directly under the hero.
// image: null shows a styled placeholder — swap in a real 3:4 product shot
// (~600x800 @2x) once photography exists, per the design handoff.
// end date drives the "ENDS ..." pill; hide the section once it has passed.
export const offersEndDate = "Ends 30 Sep, 11:59 PM";

export const offers = [
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
