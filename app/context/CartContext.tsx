'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  italian: string
  price: number
  quantity: number
  frame: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isHydrated: boolean
}

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; items: CartItem[] }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'SET_QTY':
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'HYDRATE':
      return { ...state, items: action.items, isHydrated: true }
    default:
      return state
  }
}

interface CartContextValue {
  state: CartState
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  setQuantity: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'piozza_cart'
const DELIVERY_FEE = 3.99
const FREE_DELIVERY_THRESHOLD = 50

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    isOpen: false,
    isHydrated: false,
  })

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        dispatch({ type: 'HYDRATE', items: JSON.parse(stored) })
      } else {
        dispatch({ type: 'HYDRATE', items: [] })
      }
    } catch {
      dispatch({ type: 'HYDRATE', items: [] })
    }
  }, [])

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (state.isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    }
  }, [state.items, state.isHydrated])

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  const value: CartContextValue = {
    state,
    addToCart: (item) => dispatch({ type: 'ADD', item: { ...item, quantity: 1 } }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
    setQuantity: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    itemCount,
    subtotal,
    deliveryFee,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
