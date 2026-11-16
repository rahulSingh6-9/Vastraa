import { useEffect, useState } from 'react'
import StoreContext from './storeContext.js'
import { getCartItemKey } from '../utils/cart.js'
const STORAGE_KEYS = {
  cart: 'vastraa.cart',
  wishlist: 'vastraa.wishlist',
  coupon: 'vastraa.coupon',
  orders: 'vastraa.orders',
  user: 'vastraa.user',
  addresses: 'vastraa.addresses',
}

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error)
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error)
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(STORAGE_KEYS.cart, []))
  const [wishlist, setWishlist] = useState(() => readStorage(STORAGE_KEYS.wishlist, []))
  const [coupon, setCoupon] = useState(() => readStorage(STORAGE_KEYS.coupon, ''))
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEYS.orders, []))
  const [user, setUser] = useState(() => readStorage(STORAGE_KEYS.user, null))
  const [addresses, setAddresses] = useState(() => readStorage(STORAGE_KEYS.addresses, []))

  useEffect(() => writeStorage(STORAGE_KEYS.cart, cart), [cart])
  useEffect(() => writeStorage(STORAGE_KEYS.wishlist, wishlist), [wishlist])
  useEffect(() => writeStorage(STORAGE_KEYS.coupon, coupon), [coupon])
  useEffect(() => writeStorage(STORAGE_KEYS.orders, orders), [orders])
  useEffect(() => writeStorage(STORAGE_KEYS.user, user), [user])
  useEffect(() => writeStorage(STORAGE_KEYS.addresses, addresses), [addresses])

  const addToCart = (product, size, color, quantity = 1) => {
    const key = getCartItemKey(product.id, size, color)
    setCart((items) => {
      const existing = items.find((item) => item.key === key)
      return existing
        ? items.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...items, { key, productId: product.id, size, color, quantity }]
    })
  }

  const updateQuantity = (key, quantity) => {
    setCart((items) =>
      quantity < 1
        ? items.filter((item) => item.key !== key)
        : items.map((item) => (item.key === key ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (key) =>
    setCart((items) => items.filter((item) => item.key !== key))

  const toggleWishlist = (productId) => {
    setWishlist((items) =>
      items.includes(productId)
        ? items.filter((id) => id !== productId)
        : [...items, productId],
    )
  }

  const applyCoupon = (value) => {
    if (value.trim().toUpperCase() === 'VASTRAA10') {
      setCoupon('VASTRAA10')
      return { applied: true, message: '10% off has been applied.' }
    }

    return { applied: false, message: 'That code is not valid. Try VASTRAA10.' }
  }

  const clearCoupon = () => setCoupon('')

  const placeOrder = (details, itemsToOrder = cart) => {
    const orderItems = itemsToOrder.map(({ key, productId, size, color, quantity }) => ({
      key,
      productId,
      size,
      color,
      quantity,
    }))
    const order = {
      id: `VST-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      status: 'Confirmed',
      details,
      items: orderItems,
      coupon,
    }

    setOrders((items) => [order, ...items])
    const orderedQuantities = new Map()
    orderItems.forEach((item) => {
      orderedQuantities.set(item.key, (orderedQuantities.get(item.key) || 0) + item.quantity)
    })
    setCart((items) => {
      const quantitiesToRemove = new Map(orderedQuantities)
      return items.flatMap((item) => {
        const quantityToRemove = Math.min(
          item.quantity,
          quantitiesToRemove.get(item.key) || 0,
        )
        quantitiesToRemove.set(item.key, (quantitiesToRemove.get(item.key) || 0) - quantityToRemove)
        const remainingQuantity = item.quantity - quantityToRemove
        return remainingQuantity > 0 ? [{ ...item, quantity: remainingQuantity }] : []
      })
    })
    setCoupon('')
    return order
  }

  const register = (profile) => {
    const nextUser = { ...profile, createdAt: new Date().toISOString() }
    setUser(nextUser)
    return nextUser
  }

  const signIn = (profile) => {
    const nextUser = { name: profile.name || profile.email.split('@')[0], email: profile.email }
    setUser(nextUser)
    return nextUser
  }

  const signOut = () => setUser(null)
  const updateProfile = (changes) =>
    setUser((current) => (current ? { ...current, ...changes } : current))
  const saveAddress = (address) =>
    setAddresses((items) => [{ ...address, id: `address-${Date.now()}` }, ...items])
  const removeAddress = (id) =>
    setAddresses((items) => items.filter((address) => address.id !== id))

  const value = {
    cart,
    wishlist,
    coupon,
    orders,
    user,
    addresses,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    applyCoupon,
    clearCoupon,
    placeOrder,
    register,
    signIn,
    signOut,
    updateProfile,
    saveAddress,
    removeAddress,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
