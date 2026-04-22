import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warmwhite dark:bg-charcoal px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
        <motion.h1 initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 100 }}
          className="font-display text-[10rem] font-bold text-gold leading-none">404</motion.h1>
        <h2 className="font-display text-3xl font-bold text-charcoal dark:text-warmwhite mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-10 leading-relaxed">The page you're looking for seems to have wandered off. Let's get you back on track.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2 px-8 py-4">
            <Home size={18} /> Go Home
          </Link>
          <Link to="/products" className="btn-outline flex items-center justify-center gap-2 px-8 py-4">
            <ShoppingBag size={18} /> Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
