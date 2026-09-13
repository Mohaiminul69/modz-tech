import Hero from "../components/sections/Hero";
import Offers from "../components/sections/Offers";
// import Bundles from '../components/sections/Bundles'
// import Identity from '../components/sections/Identity'
import Products from "../components/sections/Products";
import ProductSpotlight from "../components/sections/ProductSpotlight";
// import Testimonials from '../components/sections/Testimonials'
import CallToAction from "../components/sections/CallToAction";

const Home = () => {
  return (
    <>
      <Hero />
      <Offers />
      <Products />
      <ProductSpotlight />
      <CallToAction />
      {/* <Bundles />
      <Identity />
      <Testimonials /> */}
    </>
  );
};

export default Home;
