export const formatPrice = (price) => `$${Number(price).toFixed(2)}`

export const getDiscount = (price, discountPrice) =>
  Math.round(((price - discountPrice) / price) * 100)

export const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]')
export const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users))

export const getOrders = (email) => {
  const all = JSON.parse(localStorage.getItem('orders') || '{}')
  return all[email] || []
}
export const saveOrder = (email, order) => {
  const all = JSON.parse(localStorage.getItem('orders') || '{}')
  if (!all[email]) all[email] = []
  all[email].unshift(order)
  localStorage.setItem('orders', JSON.stringify(all))
}

export const getReviews = (productId) => {
  const stored = JSON.parse(localStorage.getItem('reviews') || '{}')
  return stored[productId] || []
}
export const saveReview = (productId, review) => {
  const stored = JSON.parse(localStorage.getItem('reviews') || '{}')
  if (!stored[productId]) stored[productId] = []
  stored[productId].unshift(review)
  localStorage.setItem('reviews', JSON.stringify(stored))
}

export const COUPONS = { SAVE10: 10, SAVE20: 20, LUXE15: 15 }

export const generateOrderId = () =>
  'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()

export const debounce = (fn, delay) => {
  let timer
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
}
