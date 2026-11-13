import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Earbuds, speakers, microphones, smart watches, trackers, chargers and more. 100% authentic, cash on delivery all over Bangladesh.",
  alternates: { canonical: "/shop" },
};

const ShopRoute = ({ searchParams }: PageProps<"/shop">) => (
  <ShopPage
    title="All products"
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
    searchParams={searchParams}
  />
);

export default ShopRoute;
