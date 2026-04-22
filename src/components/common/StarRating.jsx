import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 14, showCount, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-gold fill-gold' : 'text-gray-300 dark:text-gray-600'} />
      ))}
      {showCount && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </div>
  )
}
