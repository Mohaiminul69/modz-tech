import { createContext, useContext, useMemo, useState } from 'react'
import { shopProducts } from '../data/shopProducts'

const CART_MAX_QTY = 9

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [lines, setLines] = useState([])

  const addItem = (id, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id)
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(CART_MAX_QTY, l.qty + qty) } : l,
        )
      }
      return [...prev, { id, qty: Math.min(CART_MAX_QTY, qty) }]
    })
  }

  const incrementItem = (id) =>
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: Math.min(CART_MAX_QTY, l.qty + 1) } : l)),
    )

  const decrementItem = (id) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l)))

  const removeItem = (id) => setLines((prev) => prev.filter((l) => l.id !== id))

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = shopProducts.find((p) => p.id === l.id)
          return product ? { id: l.id, qty: l.qty, product } : null
        })
        .filter(Boolean),
    [lines],
  )

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const value = { items, count, addItem, incrementItem, decrementItem, removeItem }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
