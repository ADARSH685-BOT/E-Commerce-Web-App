import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1, title: 'New Season', subtitle: 'Arrivals 2024', description: 'Discover the latest in luxury fashion and premium electronics.',
    cta: 'Shop Now', link: '/products', bg: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80', accent: 'Fashion'
  },
  {
    id: 2, title: 'Premium', subtitle: 'Electronics', description: 'Cutting-edge technology meets elegant design.',
    cta: 'Explore Tech', link: '/products?category=electronics', bg: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80', accent: 'Electronics'
  },
  {
    id: 3, title: 'Home', subtitle: 'Redefined', description: 'Transform your living space with our curated home collection.',
    cta: 'Shop Home', link: '/products?category=home', bg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80', accent: 'Home'
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => { setDirection(1); setCurrent(c => (c + 1) % slides.length) }, 5000)
    return () => clearInterval(timer)
  }, [])

  const go = (idx) => { setDirection(idx > current ? 1 : -1); setCurrent(idx) }
  const prev = () => { setDirection(-1); setCurrent(c => (c - 1 + slides.length) % slides.length) }
  const next = () => { setDirection(1); setCurrent(c => (c + 1) % slides.length) }

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div key={current} custom={direction}
          initial={{ x: direction * 100 + '%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -100 + '%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={slides[current].bg} alt={slides[current].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
                <p className="font-body text-gold text-sm uppercase tracking-[0.3em] mb-4">{slides[current].accent} Collection</p>
                <h1 className="font-display text-6xl md:text-8xl font-bold text-white leading-none mb-2">
                  {slides[current].title}
                </h1>
                <h2 className="font-display text-4xl md:text-6xl font-light text-white/80 mb-6">{slides[current].subtitle}</h2>
                <p className="font-body text-white/70 text-lg max-w-md mb-8">{slides[current].description}</p>
                <Link to={slides[current].link} className="inline-block bg-gold text-white px-8 py-4 font-body font-medium tracking-widest uppercase text-sm hover:bg-gold-dark transition-all duration-300 hover:px-10">
                  {slides[current].cta}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 transition-all">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 transition-all">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`transition-all duration-300 ${i === current ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/50 hover:bg-white/80'} rounded-full`} />
        ))}
      </div>
    </div>
  )
}
