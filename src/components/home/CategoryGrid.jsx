import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, Shirt, Home, Sparkles, Dumbbell } from 'lucide-react'
import categories from '../../data/categories.json'

const iconMap = { Cpu, Shirt, Home, Sparkles, Dumbbell }

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">Browse By</p>
        <h2 className="section-title">Shop Categories</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat, i) => {
          const Icon = iconMap[cat.icon] || Cpu
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <Link to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden block aspect-square bg-gray-100 dark:bg-gray-800">
                <img src={cat.banner} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Icon size={28} className="mb-2 group-hover:text-gold transition-colors" />
                  <p className="font-display font-semibold text-sm tracking-wide">{cat.name}</p>
                  <p className="text-xs text-white/70 mt-1">{cat.productCount} items</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
