import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '../store/cartSlice'

const COUPONS = { SAVE10: 10, SAVE20: 20, LUXE15: 15 }
const formatPrice = (p) => `$${Number(p).toFixed(2)}`
import toast from 'react-hot-toast'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, coupon } = useSelector(s => s.cart)
  const isAuthenticated = useSelector(s => s.auth?.isAuthenticated)
  const [couponInput, setCouponInput] = useState('')

  const subtotal = items.reduce((a, i) => a + i.discountPrice * i.quantity, 0)
  const discount = coupon ? (subtotal * COUPONS[coupon]) / 100 : 0
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  const handleCoupon = () => {
    if (COUPONS[couponInput.toUpperCase()]) {
      dispatch(applyCoupon(couponInput.toUpperCase()))
      toast.success(`Coupon applied! ${COUPONS[couponInput.toUpperCase()]}% off`)
      setCouponInput('')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) { toast.error('Please login to checkout'); navigate('/login'); return }
    navigate('/checkout')
  }

  if (items.length === 0) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <ShoppingBag size={64} className="text-gray-300 mx-auto mb-6" />
        <h2 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary px-10 py-4">Start Shopping</Link>
      </motion.div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite mb-8">Shopping Cart ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex gap-4 bg-white dark:bg-gray-900 p-4 shadow-sm">
                  <Link to={`/product/${item.id}`}>
                    <img src={item.images[0]} alt={item.name} className="w-24 h-28 object-cover flex-shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{item.brand}</p>
                        <Link to={`/product/${item.id}`} className="font-body font-medium text-charcoal dark:text-warmwhite hover:text-gold line-clamp-2">{item.name}</Link>
                        {item.color && <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>}
                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                      </div>
                      <button onClick={() => { dispatch(removeFromCart(item.key)); toast.success('Item removed') }}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700">
                        <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal dark:text-warmwhite">-</button>
                        <span className="px-3 py-1 text-sm font-medium text-charcoal dark:text-warmwhite">{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal dark:text-warmwhite">+</button>
                      </div>
                      <span className="font-display font-bold text-charcoal dark:text-warmwhite">{formatPrice(item.discountPrice * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-charcoal dark:text-warmwhite mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-charcoal dark:text-warmwhite"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {coupon && <div className="flex justify-between text-green-600"><span>Discount ({COUPONS[coupon]}%)</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-charcoal dark:text-warmwhite"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-charcoal dark:text-warmwhite"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-charcoal dark:text-warmwhite">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1"><Tag size={12} /> Promo Code</p>
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 px-3 py-2 border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">{coupon} applied</span>
                    <button onClick={() => dispatch(removeCoupon())} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div className="flex">
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Enter code"
                      className="flex-1 input-field py-2 text-sm" onKeyDown={e => e.key === 'Enter' && handleCoupon()} />
                    <button onClick={handleCoupon} className="bg-charcoal dark:bg-warmwhite text-warmwhite dark:text-charcoal px-4 text-sm hover:bg-gold transition-colors">Apply</button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Try: SAVE10, SAVE20, LUXE15</p>
              </div>

              <button onClick={handleCheckout} className="w-full btn-gold mt-6 py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/products" className="block text-center text-sm text-gold hover:underline mt-3">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
