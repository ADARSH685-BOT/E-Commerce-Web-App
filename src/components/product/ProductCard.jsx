import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlist } from '../../store/wishlistSlice'

const formatPrice = (p) => `$${Number(p).toFixed(2)}`
const getDiscount = (price, disc) => Math.round(((price - disc) / price) * 100)
import StarRating from '../common/StarRating'
import toast from 'react-hot-toast'

export default function ProductCard({ product, onQuickView }) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(s => s.wishlist.items)
  const isWishlisted = wishlistItems.some(i => i.id === product.id)
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1, size: product.sizes?.[0] || '', color: product.colors?.[0] || '' }))
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    dispatch(toggleWishlist(product))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const discount = product.discountPrice < product.price ? getDiscount(product.price, product.discountPrice) : 0

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-gray-800">
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          <img src={product.images[0]} alt={product.name} onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />

          {/* Badges */}
          {product.badge && (
            <span className={`absolute top-3 left-3 text-xs font-body font-semibold px-2 py-1 tracking-wide
              ${product.badge === 'Sale' ? 'bg-red-500 text-white' :
                product.badge === 'New' ? 'bg-charcoal text-warmwhite dark:bg-warmwhite dark:text-charcoal' :
                product.badge === 'Best Seller' ? 'bg-gold text-white' :
                'bg-gray-500 text-white'}`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && <span className="absolute top-3 right-3 text-xs font-bold bg-red-500 text-white px-2 py-1">-{discount}%</span>}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
            <button onClick={handleWishlist}
              className={`p-2 rounded-full transition-all duration-200 ${isWishlisted ? 'bg-gold text-white' : 'bg-white text-charcoal hover:bg-gold hover:text-white'}`}>
              <Heart size={16} className={isWishlisted ? 'fill-white' : ''} />
            </button>
            {product.inStock && (
              <button onClick={handleAddToCart} className="p-2 rounded-full bg-white text-charcoal hover:bg-gold hover:text-white transition-all duration-200">
                <ShoppingBag size={16} />
              </button>
            )}
            {onQuickView && (
              <button onClick={(e) => { e.preventDefault(); onQuickView(product) }}
                className="p-2 rounded-full bg-white text-charcoal hover:bg-gold hover:text-white transition-all duration-200">
                <Eye size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
          <h3 className="font-body font-medium text-sm text-charcoal dark:text-warmwhite line-clamp-2 mb-2">{product.name}</h3>
          <StarRating rating={product.rating} size={12} showCount count={product.reviewCount} />
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body font-semibold text-charcoal dark:text-warmwhite">{formatPrice(product.discountPrice)}</span>
            {discount > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>
          {!product.inStock && <p className="text-xs text-red-500 mt-1 font-medium">Out of Stock</p>}
        </div>
      </Link>
    </motion.div>
  )
}
