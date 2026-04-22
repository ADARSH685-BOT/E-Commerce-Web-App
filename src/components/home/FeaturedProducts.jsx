import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../product/ProductCard'
import QuickViewModal from '../product/QuickViewModal'
import products from '../../data/products.json'

export default function FeaturedProducts() {
  const [quickView, setQuickView] = useState(null)
  const featured = products.filter(p => p.badge === 'Best Seller').slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="text-center mb-12">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">Curated For You</p>
        <h2 className="section-title">Best Sellers</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {featured.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
            <ProductCard product={p} onQuickView={setQuickView} />
          </motion.div>
        ))}
      </div>
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  )
}
