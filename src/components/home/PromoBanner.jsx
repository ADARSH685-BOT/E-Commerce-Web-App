import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden h-64 group">
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" alt="Tech Sale"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-charcoal/60 flex flex-col justify-end p-8">
            <p className="text-gold text-xs uppercase tracking-widest mb-2">Up to 30% Off</p>
            <h3 className="font-display text-3xl font-bold text-white mb-4">Tech Essentials</h3>
            <Link to="/products?category=electronics" className="inline-block text-white border border-white px-6 py-2 text-sm hover:bg-white hover:text-charcoal transition-all duration-300 w-fit">
              Shop Electronics
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden h-64 group">
          <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80" alt="Beauty Sale"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-charcoal/50 flex flex-col justify-end p-8">
            <p className="text-gold text-xs uppercase tracking-widest mb-2">New Arrivals</p>
            <h3 className="font-display text-3xl font-bold text-white mb-4">Beauty & Glow</h3>
            <Link to="/products?category=beauty" className="inline-block text-white border border-white px-6 py-2 text-sm hover:bg-white hover:text-charcoal transition-all duration-300 w-fit">
              Shop Beauty
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
