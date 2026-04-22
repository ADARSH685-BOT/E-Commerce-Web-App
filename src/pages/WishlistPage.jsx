import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { toggleWishlist, removeFromWishlist } from '../store/wishlistSlice'

const formatPrice = (p) => `$${Number(p).toFixed(2)}`
import { Link } from 'react-router-dom'
import StarRating from '../components/common/StarRating'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const { items } = useSelector(s => s.wishlist)

  const moveToCart = (item) => {
    dispatch(addToCart({ product: item, quantity: 1, size: item.sizes?.[0] || '', color: item.colors?.[0] || '' }))
    dispatch(removeFromWishlist(item.id))
    toast.success(`${item.name} moved to cart`)
  }

  if (items.length === 0) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Heart size={64} className="text-gray-300 mx-auto mb-6" />
        <h2 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save items you love for later.</p>
        <Link to="/products" className="btn-primary px-10 py-4">Explore Products</Link>
      </motion.div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite mb-8">Wishlist ({items.length})</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm group">
                <Link to={`/product/${item.id}`} className="block relative overflow-hidden aspect-[3/4]">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button onClick={(e) => { e.preventDefault(); dispatch(removeFromWishlist(item.id)); toast.success('Removed from wishlist') }}
                    className="absolute top-3 right-3 bg-white/90 p-2 hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{item.brand}</p>
                  <Link to={`/product/${item.id}`} className="font-body font-medium text-sm text-charcoal dark:text-warmwhite hover:text-gold line-clamp-2 mt-1">{item.name}</Link>
                  <StarRating rating={item.rating} size={12} />
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-charcoal dark:text-warmwhite">{formatPrice(item.discountPrice)}</span>
                    <button onClick={() => moveToCart(item)} className="flex items-center gap-1 text-xs bg-charcoal dark:bg-warmwhite text-warmwhite dark:text-charcoal px-3 py-2 hover:bg-gold transition-colors">
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
