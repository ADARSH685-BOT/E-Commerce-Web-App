import { motion } from 'framer-motion'
import HeroSlider from '../components/home/HeroSlider'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedProducts from '../components/home/FeaturedProducts'
import TrendingProducts from '../components/home/TrendingProducts'
import PromoBanner from '../components/home/PromoBanner'
import Newsletter from '../components/home/Newsletter'
import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react'

const perks = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
]

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <HeroSlider />

      {/* Perks bar */}
      <div className="bg-warmwhite dark:bg-charcoal border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={22} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-body font-semibold text-sm text-charcoal dark:text-warmwhite">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <TrendingProducts />
      <Newsletter />
    </motion.div>
  )
}
