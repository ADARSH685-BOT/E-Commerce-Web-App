import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import ProductCard from '../components/product/ProductCard'
import products from '../data/products.json'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search size={20} className="text-gold" />
            <h1 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite">
              {query ? `Results for "${query}"` : 'Search Products'}
            </h1>
          </div>
          {query && <p className="text-gray-500 text-sm">{results.length} product{results.length !== 1 ? 's' : ''} found</p>}
        </div>

        {!query ? (
          <div className="text-center py-20">
            <Search size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Use the search bar above to find products</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-gray-400 mb-4">No results found</p>
            <p className="text-gray-500">Try different keywords or browse our categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
