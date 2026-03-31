import clsx from 'clsx'

/**
 * Loader / Spinner component
 * Props:
 *   fullScreen {boolean} - center in viewport
 *   size       {sm|md|lg} - spinner size
 *   text       {string}   - optional text below spinner
 */
export default function Loader({ fullScreen = false, size = 'md', text }) {
  const sizes = { sm: 'loading-sm', md: 'loading-md', lg: 'loading-lg' }

  const inner = (
    <div className="flex flex-col items-center gap-3">
      <span className={clsx('loading loading-spinner text-primary', sizes[size])} />
      {text && <p className="text-sm text-zinc-400 animate-pulse">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-base/80 backdrop-blur-sm">
        {inner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {inner}
    </div>
  )
}
