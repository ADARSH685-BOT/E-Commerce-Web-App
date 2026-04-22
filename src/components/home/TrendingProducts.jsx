import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../product/ProductCard'
import QuickViewModal from '../product/QuickViewModal'
import products from '../../data/products.json'

const tabs = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports']

export default function TrendingProducts() {
  const [activeTab, setActiveTab] = useState('All')
  const [quickView, setQuickView] = useState(null)

  const filtered = activeTab === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeTab.toLowerCase()).slice(0, 8)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">What's Hot</p>
        <h2 className="section-title">Trending Now</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-body font-medium tracking-wide transition-all duration-200 border
              ${activeTab === tab ? 'bg-charcoal dark:bg-warmwhite text-warmwhite dark:text-charcoal border-charcoal dark:border-warmwhite' : 'border-gray-300 dark:border-gray-600 text-charcoal dark:text-warmwhite hover:border-gold hover:text-gold'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}>
            <ProductCard product={p} onQuickView={setQuickView} />
          </motion.div>
        ))}
      </div>
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  )
}
