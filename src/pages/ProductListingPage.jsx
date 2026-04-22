import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react'
import ProductCard from '../components/product/ProductCard'
import QuickViewModal from '../components/product/QuickViewModal'
import SkeletonCard from '../components/common/SkeletonCard'
import products from '../data/products.json'

const BRANDS = [...new Set(products.map(p => p.brand))]
const CATEGORIES = ['electronics', 'fashion', 'home', 'beauty', 'sports']

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'default'
  const minPrice = Number(searchParams.get('minPrice') || 0)
  const maxPrice = Number(searchParams.get('maxPrice') || 3000)
  const brands = searchParams.get('brands') ? searchParams.get('brands').split(',') : []
  const minRating = Number(searchParams.get('rating') || 0)
  const inStockOnly = searchParams.get('inStock') === 'true'

  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect\n    setLoading(true); const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [category, sort])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    setSearchParams(p); setPage(1)
  }

  const toggleBrand = (brand) => {
    const current = brands.includes(brand) ? brands.filter(b => b !== brand) : [...brands, brand]
    setParam('brands', current.join(','))
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (category) list = list.filter(p => p.category === category)
    if (brands.length) list = list.filter(p => brands.includes(p.brand))
    list = list.filter(p => p.discountPrice >= minPrice && p.discountPrice <= maxPrice)
    if (minRating) list = list.filter(p => p.rating >= minRating)
    if (inStockOnly) list = list.filter(p => p.inStock)
    if (sort === 'price-asc') list.sort((a, b) => a.discountPrice - b.discountPrice)
    else if (sort === 'price-desc') list.sort((a, b) => b.discountPrice - a.discountPrice)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0))
    return list
  }, [category, brands.join(), minPrice, maxPrice, minRating, inStockOnly, sort])

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore = paginated.length < filtered.length

// eslint-disable-next-line react-hooks/static-components\n  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-body font-semibold text-sm uppercase tracking-widest mb-3 text-charcoal dark:text-warmwhite">Category</h3>
        {CATEGORIES.map(c => (
          <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="category" checked={category === c} onChange={() => setParam('category', c === category ? '' : c)}
              className="accent-gold" />
            <span className="text-sm capitalize text-charcoal dark:text-warmwhite">{c}</span>
          </label>
        ))}
        {category && <button onClick={() => setParam('category', '')} className="text-xs text-gold mt-1 hover:underline">Clear</button>}
      </div>

      <div>
        <h3 className="font-body font-semibold text-sm uppercase tracking-widest mb-3 text-charcoal dark:text-warmwhite">Price Range</h3>
        <div className="space-y-2">
          <input type="range" min={0} max={3000} step={50} value={maxPrice}
            onChange={e => setParam('maxPrice', e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span><span>${maxPrice}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-body font-semibold text-sm uppercase tracking-widest mb-3 text-charcoal dark:text-warmwhite">Brand</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {BRANDS.map(b => (
            <label key={b} className="flex items-center gap-2 py-0.5 cursor-pointer">
              <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} className="accent-gold" />
              <span className="text-sm text-charcoal dark:text-warmwhite">{b}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-body font-semibold text-sm uppercase tracking-widest mb-3 text-charcoal dark:text-warmwhite">Min Rating</h3>
        {[4, 3, 2].map(r => (
          <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="rating" checked={minRating === r} onChange={() => setParam('rating', minRating === r ? '' : r)}
              className="accent-gold" />
            <span className="text-sm text-charcoal dark:text-warmwhite">{r}+ Stars</span>
          </label>
        ))}
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={e => setParam('inStock', e.target.checked ? 'true' : '')} className="accent-gold" />
          <span className="text-sm font-medium text-charcoal dark:text-warmwhite">In Stock Only</span>
        </label>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite capitalize">
              {category || 'All Products'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setFilterOpen(!filterOpen)} className="lg:hidden flex items-center gap-2 btn-outline text-sm px-4 py-2">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select value={sort} onChange={e => setParam('sort', e.target.value)}
              className="input-field py-2 text-sm w-auto pr-8 cursor-pointer">
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <div className="flex border border-gray-300 dark:border-gray-600">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-charcoal dark:bg-warmwhite text-warmwhite dark:text-charcoal' : 'text-gray-500 hover:text-charcoal dark:hover:text-warmwhite'}`}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-charcoal dark:bg-warmwhite text-warmwhite dark:text-charcoal' : 'text-gray-500 hover:text-charcoal dark:hover:text-warmwhite'}`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setFilterOpen(false)}>
                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  className="absolute left-0 top-0 bottom-0 w-72 bg-warmwhite dark:bg-gray-900 p-6 overflow-y-auto"
                  onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-xl font-bold text-charcoal dark:text-warmwhite">Filters</h2>
                    <button onClick={() => setFilterOpen(false)}><X size={20} className="text-charcoal dark:text-warmwhite" /></button>
                  </div>
                  <FilterSidebar />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-gray-400 mb-4">No products found</p>
                <button onClick={() => setSearchParams({})} className="btn-outline text-sm">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                  {paginated.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                      <ProductCard product={p} onQuickView={setQuickView} />
                    </motion.div>
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-12">
                    <button onClick={() => setPage(p => p + 1)} className="btn-outline px-10">Load More</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </motion.div>
  )
}
