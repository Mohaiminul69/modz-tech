import Hero from '../components/sections/Hero'
import Bundles from '../components/sections/Bundles'
import Identity from '../components/sections/Identity'
import Products from '../components/sections/Products'
import Testimonials from '../components/sections/Testimonials'
import CallToAction from '../components/sections/CallToAction'

export default function Home() {
  return (
    <>
      <Hero />
      <Bundles />
      <Identity />
      <Products />
      <Testimonials />
      <CallToAction />
    </>
  )
}
