import Hero from "@components/sections/Hero";
import Offers from "@components/sections/Offers";
import Products from "@components/sections/Products";
import ProductSpotlight from "@components/sections/ProductSpotlight";
import CallToAction from "@components/sections/CallToAction";

const Home = () => {
  return (
    <>
      <Hero />
      <Offers />
      <Products />
      <ProductSpotlight />
      <CallToAction />
    </>
  );
};

export default Home;
