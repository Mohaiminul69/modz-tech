// Central place for placeholder business details.
// Replace these with Modz Tech's real contact info, socials, and currency.
export const siteConfig = {
  name: 'Modz Tech',
  tagline: 'Tech that keeps up with your day',
  whatsappDisplay: '+880 1786 503069',
  whatsappLink: 'https://wa.me/8801786503069',
  email: 'hello@modztech.com',
  currency: '$',
  social: {
    facebook: '#',
    instagram: '#',
  },
  // Route-based nav. Pages other than Home aren't built yet, so they fall
  // through to the ComingSoon catch-all route in App.jsx until they exist.
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Offers', to: '/offers' },
    { label: 'Packages', to: '/packages' },
    { label: 'Contact', to: '/contact' },
  ],
}
