import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingBag, Heart, Search, Sun, Moon, Menu, X, User, LogOut, Package } from 'lucide-react'
import { logout } from '../../store/authSlice'
import products from '../../data/products.json'
import toast from 'react-hot-toast'

function debounce(fn, delay) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay) }
}

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(s => s.auth)
  const currentUser = auth?.currentUser
  const isAuthenticated = auth?.isAuthenticated
  const cartCount = useSelector(s => s.cart?.items?.reduce((a, i) => a + i.quantity, 0) || 0)
  const wishlistCount = useSelector(s => s.wishlist?.items?.length || 0)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const handleSearch = debounce((q) => {
    if (!q.trim()) { setSuggestions([]); return }
    setSuggestions(products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 5))
  }, 200)

  useEffect(() => { handleSearch(searchQuery) }, [searchQuery])

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]); setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false); setSuggestions([])
    }
  }

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s', backgroundColor: scrolled ? 'rgba(250,250,248,0.97)' : 'transparent', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none' }}
      className="dark:bg-charcoal/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-charcoal dark:text-warmwhite tracking-tight">
            LUX<span style={{ color: '#c9a84c' }}>ÉRA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {[['Home', '/'], ['Shop', '/products'], ['Electronics', '/products?category=electronics'], ['Fashion', '/products?category=fashion'], ['Beauty', '/products?category=beauty']].map(([label, to]) => (
              <Link key={label} to={to} className="text-sm font-medium text-charcoal dark:text-warmwhite hover:text-gold transition-colors tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-charcoal dark:text-warmwhite hover:text-gold transition-colors">
                <Search size={20} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 z-50">
                  <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-gray-200">
                    <Search size={14} className="ml-3 text-gray-400 flex-shrink-0" />
                    <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search products..." className="flex-1 px-3 py-3 bg-transparent text-sm outline-none text-charcoal" />
                  </form>
                  {suggestions.length > 0 && suggestions.map(p => (
                    <button key={p.id} onClick={() => { navigate(`/product/${p.id}`); setSearchOpen(false); setSearchQuery(''); setSuggestions([]) }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button onClick={() => setDarkMode(d => !d)} className="p-2 text-charcoal dark:text-warmwhite hover:text-gold transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-charcoal dark:text-warmwhite hover:text-gold transition-colors">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#c9a84c', fontSize: '10px' }}>{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-charcoal dark:text-warmwhite hover:text-gold transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#c9a84c', fontSize: '10px' }}>{cartCount}</span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center"
                  style={{ backgroundColor: '#c9a84c' }}>
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 py-2 z-50">
                    <p className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100">{currentUser?.email}</p>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-charcoal">
                      <User size={14} /> Profile
                    </Link>
                    <Link to="/profile?tab=orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-charcoal">
                      <Package size={14} /> Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-500">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-sm px-4 py-2 font-medium text-white transition-colors" style={{ backgroundColor: '#1a1a1a' }}>
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-charcoal dark:text-warmwhite">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-charcoal border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
          {[['Home', '/'], ['Shop', '/products'], ['Electronics', '/products?category=electronics'], ['Fashion', '/products?category=fashion']].map(([label, to]) => (
            <Link key={label} to={to} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-charcoal dark:text-warmwhite uppercase tracking-wide">
              {label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center text-sm py-2 text-white" style={{ backgroundColor: '#1a1a1a' }}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
