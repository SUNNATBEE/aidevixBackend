import clsx from 'clsx'
import { forwardRef } from 'react'

/**
 * Reusable Input component
 * Supports: text, email, password, search
 */
const Input = forwardRef(({
  label,
  error,
  icon,
  iconRight,
  className,
  wrapperClass,
  ...props
}, ref) => {
  return (
    <div className={clsx('form-control w-full', wrapperClass)}>
      {label && (
        <label className="label">
          <span className="label-text text-zinc-300 font-medium">{label}</span>
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg z-10">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'input input-bordered w-full bg-dark-card border-dark-border',
            'focus:border-primary-500 focus:outline-none transition-colors',
            'placeholder:text-zinc-600',
            icon      && 'pl-10',
            iconRight && 'pr-10',
            error     && 'input-error',
            className,
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg z-10">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
