import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { clearCart, applyCoupon, removeCoupon } from '../store/cartSlice'

const COUPONS = { SAVE10: 10, SAVE20: 20, LUXE15: 15 }
const formatPrice = (p) => `$${Number(p).toFixed(2)}`
const generateOrderId = () => 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()
const saveOrder = (email, order) => {
  const all = JSON.parse(localStorage.getItem('orders') || '{}')
  if (!all[email]) all[email] = []
  all[email].unshift(order)
  localStorage.setItem('orders', JSON.stringify(all))
}
import { CheckCircle, CreditCard, Smartphone, Package } from 'lucide-react'
import toast from 'react-hot-toast'

const addressSchema = yup.object({ name: yup.string().required('Name is required'), email: yup.string().email().required(), phone: yup.string().min(10).required(), address: yup.string().required(), city: yup.string().required(), state: yup.string().required(), zip: yup.string().required() })

const steps = ['Shipping', 'Payment', 'Review', 'Confirmation']

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const { items, coupon } = useSelector(s => s.cart)
  const currentUser = useSelector(s => s.auth?.currentUser)
  const [step, setStep] = useState(0)
  const [shippingData, setShippingData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [orderId, setOrderId] = useState('')

  const subtotal = items.reduce((a, i) => a + i.discountPrice * i.quantity, 0)
  const discount = coupon ? (subtotal * COUPONS[coupon]) / 100 : 0
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(addressSchema), defaultValues: { name: currentUser?.name || '', email: currentUser?.email || '' } })

  const onShippingSubmit = (data) => { setShippingData(data); setStep(1) }

  const handlePlaceOrder = () => {
    const id = generateOrderId()
    setOrderId(id)
    const order = { id, items, shippingData, paymentMethod, subtotal, discount, shipping, tax, total, date: new Date().toISOString(), status: 'Processing' }
    saveOrder(currentUser.email, order)
    dispatch(clearCart())
    setStep(3)
    toast.success('Order placed successfully!')
  }

// eslint-disable-next-line react-hooks/static-components\n  const OrderSummary = () => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 space-y-3">
      <h3 className="font-body font-semibold text-sm uppercase tracking-widest text-charcoal dark:text-warmwhite">Order Summary</h3>
      {items.map(item => (
        <div key={item.key} className="flex items-center gap-3">
          <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-charcoal dark:text-warmwhite line-clamp-1">{item.name}</p>
            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
          </div>
          <span className="text-xs font-bold text-charcoal dark:text-warmwhite">{formatPrice(item.discountPrice * item.quantity)}</span>
        </div>
      ))}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1 text-xs">
        <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        {coupon && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
        <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Tax</span><span>{formatPrice(tax)}</span></div>
        <div className="flex justify-between font-bold text-base text-charcoal dark:text-warmwhite pt-1 border-t border-gray-200 dark:border-gray-700">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Steps */}
        {step < 3 && (
          <div className="flex items-center justify-center mb-10">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${i <= step ? 'bg-gold text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${i <= step ? 'text-gold' : 'text-gray-400'}`}>{s}</span>
                {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-3 ${i < step ? 'bg-gold' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0: Shipping */}
              {step === 0 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-900 p-6 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-charcoal dark:text-warmwhite mb-6">Shipping Address</h2>
                  <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Full Name</label>
                        <input {...register('name')} className="input-field" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Email</label>
                        <input {...register('email')} className="input-field" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Phone</label>
                      <input {...register('phone')} className="input-field" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Street Address</label>
                      <input {...register('address')} className="input-field" />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">City</label>
                        <input {...register('city')} className="input-field" />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">State</label>
                        <input {...register('state')} className="input-field" />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">ZIP</label>
                        <input {...register('zip')} className="input-field" />
                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
                      </div>
                    </div>
                    <button type="submit" className="w-full btn-gold py-4 mt-2 uppercase tracking-widest text-sm">Continue to Payment</button>
                  </form>
                </motion.div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-900 p-6 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-charcoal dark:text-warmwhite mb-6">Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI Payment', icon: Smartphone },
                      { id: 'cod', label: 'Cash on Delivery', icon: Package },
                    ].map(({ id, label, icon: Icon }) => (
                      <label key={id} className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-colors ${paymentMethod === id ? 'border-gold bg-gold/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-gold" />
                        <Icon size={20} className={paymentMethod === id ? 'text-gold' : 'text-gray-500'} />
                        <span className="font-medium text-charcoal dark:text-warmwhite">{label}</span>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Card Number</label>
                        <input placeholder="1234 5678 9012 3456" className="input-field" maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Expiry</label>
                          <input placeholder="MM/YY" className="input-field" maxLength={5} />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">CVV</label>
                          <input placeholder="123" className="input-field" maxLength={3} type="password" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">Name on Card</label>
                        <input placeholder="John Doe" className="input-field" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                      <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">UPI ID</label>
                      <input placeholder="yourname@upi" className="input-field" />
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="flex-1 btn-outline py-3 text-sm">Back</button>
                    <button onClick={() => setStep(2)} className="flex-1 btn-gold py-3 text-sm uppercase tracking-widest">Review Order</button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-900 p-6 shadow-sm space-y-6">
                  <h2 className="font-display text-2xl font-bold text-charcoal dark:text-warmwhite">Review Order</h2>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-charcoal dark:text-warmwhite mb-3">Shipping To</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData?.address}, {shippingData?.city}, {shippingData?.state} {shippingData?.zip}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData?.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-charcoal dark:text-warmwhite mb-2">Payment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 btn-outline py-3 text-sm">Back</button>
                    <button onClick={handlePlaceOrder} className="flex-1 btn-gold py-3 text-sm uppercase tracking-widest">Place Order</button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-900 p-10 shadow-sm text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite mb-3">Order Confirmed!</h2>
                  <p className="text-gray-500 mb-2">Thank you for your purchase, {currentUser?.name}.</p>
                  <p className="text-sm text-gray-400 mb-6">Order ID: <span className="font-mono font-bold text-gold">{orderId}</span></p>
                  <p className="text-sm text-gray-500 mb-8">A confirmation has been sent to {shippingData?.email}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/profile?tab=orders" className="btn-primary px-8 py-3 text-sm">View Orders</a>
                    <a href="/products" className="btn-outline px-8 py-3 text-sm">Continue Shopping</a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 3 && (
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
