// Shared money rules for the cart and checkout pages — kept in one place
// deliberately, per the design handoff: "the cart and checkout must share
// one pricing function" to avoid the two pages drifting apart.
export const FREE_DELIVERY_OVER = 2000
export const DELIVERY_FLAT = 80
export const BUNDLE = { buds: 'pro_3', case: 'silicone-case-cover', discount: 100 }

export const fmt = (n) => `৳${n.toLocaleString()}`

// items: [{ id, qty, product: { price, oldPrice } }]
export const computeCartTotals = (items) => {
  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const listTotal = items.reduce((sum, i) => sum + i.product.oldPrice * i.qty, 0)
  const offerSavings = items.reduce(
    (sum, i) => sum + (i.product.oldPrice - i.product.price) * i.qty,
    0,
  )
  const hasBuds = items.some((i) => i.id === BUNDLE.buds)
  const hasCase = items.some((i) => i.id === BUNDLE.case)
  const bundleDiscount = hasBuds && hasCase ? BUNDLE.discount : 0
  const goods = listTotal - offerSavings - bundleDiscount
  const deliveryCost = count === 0 ? 0 : goods >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FLAT
  const total = goods + deliveryCost

  return {
    count,
    listTotal,
    offerSavings,
    bundleDiscount,
    goods,
    deliveryCost,
    total,
    hasBuds,
    hasCase,
  }
}
