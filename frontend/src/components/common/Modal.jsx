import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { IoClose } from 'react-icons/io5'
import clsx from 'clsx'

/**
 * Animated Modal component using GSAP
 * Props:
 *   isOpen    {boolean}
 *   onClose   {function}
 *   title     {string}
 *   size      {sm|md|lg|xl|full}
 *   children  {ReactNode}
 */
export default function Modal({ isOpen, onClose, title, size = 'md', children, className }) {
  const sizes = {
    sm:   'max-w-sm',
    md:   'max-w-md',
    lg:   'max-w-lg',
    xl:   'max-w-2xl',
    full: 'max-w-5xl',
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo('#modal-content',
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1,   y: 0,  duration: 0.3, ease: 'back.out(1.4)' },
      )
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div
        id="modal-content"
        className={clsx(
          'w-full glass-card p-6 relative',
          sizes[size],
          className,
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <IoClose className="text-xl" />
            </button>
          </div>
        )}

        {/* Close button (no title) */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle"
          >
            <IoClose className="text-xl" />
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body,
  )
}
