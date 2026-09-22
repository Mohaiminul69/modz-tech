"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// Checkout renders its own reduced footer so nothing competes with the form.
const ConditionalFooter = () => {
  const pathname = usePathname();
  if (pathname === "/checkout") return null;
  return <Footer />;
};

export default ConditionalFooter;
