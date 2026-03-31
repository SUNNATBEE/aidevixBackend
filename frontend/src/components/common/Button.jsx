import clsx from 'clsx'

/**
 * Reusable Button component with variants
 * Variants: primary | secondary | outline | ghost | danger
 */
export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  icon,
  iconRight,
  className,
  onClick,
  type = 'button',
  ...rest
}) {
  const base = 'btn gap-2 font-semibold transition-all duration-200'

  const variants = {
    primary:   'btn-primary shadow-glow-sm hover:shadow-glow-md',
    secondary: 'btn-secondary',
    outline:   'btn-outline btn-primary',
    ghost:     'btn-ghost',
    danger:    'btn-error',
  }

  const sizes = {
    sm:  'btn-sm text-xs',
    md:  'btn-md text-sm',
    lg:  'btn-lg text-base',
    xl:  'btn-wide btn-lg text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading && <span className="loading loading-spinner loading-xs" />}
      {!loading && icon && <span className="text-lg">{icon}</span>}
      {children}
      {iconRight && <span className="text-lg">{iconRight}</span>}
    </button>
  )
}
