import { Link } from 'react-router-dom'
import { Mail, Share2, MessageCircle, Globe, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-warmwhite mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">LUX<span className="text-gold">ÉRA</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Premium shopping experience. Curated collections from the world's finest brands.</p>
            <div className="flex gap-4">
              {[Share2, MessageCircle, Globe, Rss].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-gold transition-colors"><Icon size={18} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest mb-4 text-gold">Shop</h4>
            <ul className="space-y-2">
              {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map(c => (
                <li key={c}><Link to={`/products?category=${c.toLowerCase().split(' ')[0]}`} className="text-gray-400 hover:text-warmwhite text-sm transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest mb-4 text-gold">Account</h4>
            <ul className="space-y-2">
              {[['My Profile', '/profile'], ['Orders', '/profile?tab=orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([l, to]) => (
                <li key={l}><Link to={to} className="text-gray-400 hover:text-warmwhite text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest mb-4 text-gold">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get exclusive offers and new arrivals straight to your inbox.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 bg-gray-800 text-warmwhite px-4 py-2 text-sm outline-none border border-gray-700 focus:border-gold" />
              <button className="bg-gold text-white px-4 py-2 hover:bg-gold-dark transition-colors"><Mail size={16} /></button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 LUXÉRA. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
