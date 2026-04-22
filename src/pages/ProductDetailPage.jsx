import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Zap, ChevronLeft, ChevronRight, Star, ZoomIn } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { toggleWishlist } from '../store/wishlistSlice'

const formatPrice = (p) => `$${Number(p).toFixed(2)}`
const getDiscount = (price, disc) => Math.round(((price - disc) / price) * 100)
const getReviews = (productId) => {
  const stored = JSON.parse(localStorage.getItem('reviews') || '{}')
  return stored[productId] || []
}
const saveReview = (productId, review) => {
  const stored = JSON.parse(localStorage.getItem('reviews') || '{}')
  if (!stored[productId]) stored[productId] = []
  stored[productId].unshift(review)
  localStorage.setItem('reviews', JSON.stringify(stored))
}
import StarRating from '../components/common/StarRating'
import ProductCard from '../components/product/ProductCard'
import products from '../data/products.json'
import staticReviews from '../data/reviews.json'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const currentUser = useSelector(s => s.auth?.currentUser)
  const wishlistItems = useSelector(s => s.wishlist?.items || [])
  const product = products.find(p => p.id === Number(id))
  const [imgIdx, setImgIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [zoomed, setZoomed] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect\n      setSelectedSize(product.sizes?.[0] || '')
      // eslint-disable-next-line react-hooks/set-state-in-effect\n      setSelectedColor(product.colors?.[0] || '')
      setImgIdx(0)
      const stored = getReviews(product.id)
      const base = staticReviews.filter(r => r.productId === product.id)
      setReviews([...stored, ...base])
    }
  }, [id])

  if (!product) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-2xl text-gray-400 mb-4">Product not found</p>
        <Link to="/products" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  )

  const isWishlisted = wishlistItems.some(i => i.id === product.id)
  const discount = product.discountPrice < product.price ? getDiscount(product.price, product.discountPrice) : 0
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty, size: selectedSize, color: selectedColor }))
    toast.success(`${product.name} added to cart`)
  }

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: qty, size: selectedSize, color: selectedColor }))
    window.location.href = '/checkout'
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!currentUser) { toast.error('Please login to write a review'); return }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return }
    const review = { id: Date.now(), productId: product.id, name: currentUser.name, rating: reviewForm.rating, comment: reviewForm.comment, date: new Date().toISOString().split('T')[0] }
    saveReview(product.id, review)
    setReviews(prev => [review, ...prev])
    setReviewForm({ rating: 5, comment: '' })
    toast.success('Review submitted!')
  }

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : product.rating

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-gold">Home</Link> /
          <Link to="/products" className="hover:text-gold">Shop</Link> /
          <Link to={`/products?category=${product.category}`} className="hover:text-gold capitalize">{product.category}</Link> /
          <span className="text-charcoal dark:text-warmwhite">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800 cursor-zoom-in" onClick={() => setZoomed(!zoomed)}>
              <motion.img src={product.images[imgIdx]} alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`} />
              <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full"><ZoomIn size={16} /></button>
              {product.images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + product.images.length) % product.images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white"><ChevronLeft size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % product.images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white"><ChevronRight size={18} /></button>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-gold' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.badge && (
              <span className={`inline-block text-xs font-semibold px-3 py-1 ${product.badge === 'Sale' ? 'bg-red-500 text-white' : product.badge === 'New' ? 'bg-charcoal text-warmwhite' : 'bg-gold text-white'}`}>
                {product.badge}
              </span>
            )}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal dark:text-warmwhite">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <StarRating rating={avgRating} showCount count={reviews.length || product.reviewCount} />
              <span className="text-sm text-gray-500">({reviews.length || product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-4xl font-bold text-charcoal dark:text-warmwhite">{formatPrice(product.discountPrice)}</span>
              {discount > 0 && <>
                <span className="text-gray-400 line-through text-lg">{formatPrice(product.price)}</span>
                <span className="bg-red-500 text-white text-sm px-2 py-1 font-bold">-{discount}%</span>
              </>}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-charcoal dark:text-warmwhite">Color: <span className="font-normal normal-case">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 text-sm border transition-all ${selectedColor === c ? 'border-gold bg-gold text-white' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-charcoal dark:text-warmwhite">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-sm border transition-all ${selectedSize === s ? 'border-gold bg-gold text-white' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal dark:text-warmwhite text-lg">-</button>
                <span className="px-6 py-3 font-medium text-charcoal dark:text-warmwhite">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal dark:text-warmwhite text-lg">+</button>
              </div>
              <button onClick={() => { dispatch(toggleWishlist(product)); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                className={`p-3 border transition-all ${isWishlisted ? 'border-gold bg-gold text-white' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold'}`}>
                <Heart size={20} className={isWishlisted ? 'fill-white' : ''} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddToCart} disabled={!product.inStock}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50">
                <ShoppingBag size={18} /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {product.inStock && (
                <button onClick={handleBuyNow} className="flex-1 btn-gold flex items-center justify-center gap-2 py-4">
                  <Zap size={18} /> Buy Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 dark:border-gray-700 gap-8">
            {['description', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium uppercase tracking-widest transition-colors capitalize ${activeTab === tab ? 'border-b-2 border-gold text-gold' : 'text-gray-500 hover:text-charcoal dark:hover:text-warmwhite'}`}>
                {tab} {tab === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' ? (
              <div className="max-w-2xl">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">{product.description}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Brand</p>
                    <p className="font-medium text-charcoal dark:text-warmwhite">{product.brand}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Category</p>
                    <p className="font-medium text-charcoal dark:text-warmwhite capitalize">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Availability</p>
                    <p className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Rating</p>
                    <p className="font-medium text-charcoal dark:text-warmwhite">{avgRating} / 5</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Rating summary */}
                <div className="flex items-center gap-8 p-6 bg-gray-50 dark:bg-gray-800 max-w-md">
                  <div className="text-center">
                    <p className="font-display text-5xl font-bold text-charcoal dark:text-warmwhite">{avgRating}</p>
                    <StarRating rating={Number(avgRating)} />
                    <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map(r => {
                      const count = reviews.filter(rv => rv.rating === r).length
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={r} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-gray-500">{r}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gold h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-4 text-gray-500">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Write review */}
                <form onSubmit={handleReviewSubmit} className="max-w-lg space-y-4 p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-warmwhite">Write a Review</h3>
                  <div>
                    <p className="text-sm mb-2 text-charcoal dark:text-warmwhite">Your Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                          <Star size={24} className={s <= reviewForm.rating ? 'text-gold fill-gold' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience..." rows={4} className="input-field resize-none" />
                  <button type="submit" className="btn-primary text-sm px-6 py-2">Submit Review</button>
                </form>

                {/* Reviews list */}
                <div className="space-y-6 max-w-2xl">
                  {reviews.map(r => (
                    <div key={r.id} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold">
                            {r.name.charAt(0)}
                          </div>
                          <span className="font-medium text-sm text-charcoal dark:text-warmwhite">{r.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size={12} />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
