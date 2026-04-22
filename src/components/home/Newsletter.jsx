import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Subscribed! Welcome to LUXÉRA.')
    setEmail('')
  }

  return (
    <section className="bg-charcoal dark:bg-gray-950 py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Stay In The Loop</p>
          <h2 className="font-display text-4xl font-bold text-warmwhite mb-4">Join the Inner Circle</h2>
          <p className="text-gray-400 mb-8">Get exclusive access to new arrivals, private sales, and style inspiration.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address"
              className="flex-1 bg-gray-800 text-warmwhite px-5 py-4 text-sm outline-none border border-gray-700 focus:border-gold placeholder-gray-500" />
            <button type="submit" className="bg-gold text-white px-8 py-4 font-body font-medium text-sm uppercase tracking-widest hover:bg-gold-dark transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-gray-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  )
}
