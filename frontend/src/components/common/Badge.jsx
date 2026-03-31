import clsx from 'clsx'
import { CATEGORIES } from '@utils/constants'

/**
 * Category Badge component
 * Can be used as filter chip or display tag
 */
export default function Badge({ category, active = false, onClick, className }) {
  const cat = CATEGORIES.find((c) => c.id === category) || {
    label: category, icon: '📌', color: '#6366f1',
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        'category-badge select-none',
        active && 'bg-primary-500/30 border-primary-500/60 text-primary-300',
        !active && 'opacity-70 hover:opacity-100',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
      style={active ? { borderColor: cat.color + '60', color: cat.color } : {}}
    >
      <span>{cat.icon}</span>
      <span>{cat.label}</span>
    </button>
  )
}
