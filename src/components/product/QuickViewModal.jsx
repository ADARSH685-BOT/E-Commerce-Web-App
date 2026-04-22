import { useState } from 'react'
import { X, ShoppingBag, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlist } from '../../store/wishlistSlice'

const formatPrice = (p) => `$${Number(p).toFixed(2)}`
const getDiscount = (price, disc) => Math.round(((price - disc) / price) * 100)
import StarRating from '../common/StarRating'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(s => s.wishlist.items)
  const isWishlisted = wishlistItems.some(i => i.id === product.id)
  const [imgIdx, setImgIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [qty, setQty] = useState(1)

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty, size: selectedSize, color: selectedColor }))
    toast.success(`${product.name} added to cart`)
    onClose()
  }

  const discount = product.discountPrice < product.price ? getDiscount(product.price, product.discountPrice) : 0

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-warmwhite dark:bg-gray-900 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col md:flex-row">
            {/* Images */}
            <div className="md:w-1/2 relative">
              <img src={product.images[imgIdx]} alt={product.name} className="w-full aspect-square object-cover" />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 hover:bg-white"><ChevronLeft size={18} /></button>
                  <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 hover:bg-white"><ChevronRight size={18} /></button>
                </>
              )}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-gold' : 'bg-white/60'}`} />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-6 flex flex-col gap-4">
              <button onClick={onClose} className="self-end text-gray-400 hover:text-charcoal dark:hover:text-warmwhite"><X size={20} /></button>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{product.brand}</p>
                <h2 className="font-display text-xl font-bold text-charcoal dark:text-warmwhite mt-1">{product.name}</h2>
                <StarRating rating={product.rating} showCount count={product.reviewCount} />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-charcoal dark:text-warmwhite">{formatPrice(product.discountPrice)}</span>
                {discount > 0 && <><span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5">-{discount}%</span></>}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

              {product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-charcoal dark:text-warmwhite">Color: <span className="font-normal normal-case">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(c => (
                      <button key={c} onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1 text-xs border transition-colors ${selectedColor === c ? 'border-gold bg-gold text-white' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold'}`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-charcoal dark:text-warmwhite">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 text-xs border transition-colors ${selectedSize === s ? 'border-gold bg-gold text-white' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 dark:border-gray-600">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal dark:text-warmwhite">-</button>
                  <span className="px-4 py-2 text-sm font-medium text-charcoal dark:text-warmwhite">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal dark:text-warmwhite">+</button>
                </div>
                <button onClick={() => { dispatch(toggleWishlist(product)); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                  className={`p-3 border transition-colors ${isWishlisted ? 'border-gold bg-gold text-white' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold'}`}>
                  <Heart size={16} className={isWishlisted ? 'fill-white' : ''} />
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={!product.inStock}
                className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={16} /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link to={`/product/${product.id}`} onClick={onClose} className="text-center text-sm text-gold hover:underline">View Full Details</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
