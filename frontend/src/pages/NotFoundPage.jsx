import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ROUTES } from '@utils/constants'

export default function NotFoundPage() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
    )
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div ref={ref} className="text-center">
        <div className="text-[120px] font-black gradient-text font-display leading-none mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Sahifa topilmadi</h1>
        <p className="text-zinc-400 mb-8">Siz izlagan sahifa mavjud emas yoki ko'chirilgan.</p>
        <div className="flex gap-4 justify-center">
          <Link to={ROUTES.HOME}    className="btn btn-primary">Bosh sahifa</Link>
          <Link to={ROUTES.COURSES} className="btn btn-outline btn-primary">Kurslar</Link>
        </div>
      </div>
    </div>
  )
}
