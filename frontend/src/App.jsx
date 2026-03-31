import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import AppRouter from './router/AppRouter'
import { checkAuthStatus } from './store/slices/authSlice'
import LoadingScreen from '@components/loading/LoadingScreen'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(checkAuthStatus())

    // Cursor: glow trail + dot + ring
    const trail = document.createElement('div')
    trail.className = 'cursor-trail'
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    document.body.appendChild(trail)
    document.body.appendChild(ring)
    document.body.appendChild(dot)

    let mouseX = 0, mouseY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top  = `${mouseY}px`
      ring.style.left = `${mouseX}px`
      ring.style.top  = `${mouseY}px`
      trail.style.left = `${mouseX}px`
      trail.style.top  = `${mouseY}px`
    }

    const onDown = () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(0.5)'
      ring.style.width  = '50px'
      ring.style.height = '50px'
      ring.style.borderColor = 'rgba(99,102,241,0.9)'
    }
    const onUp = () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(1)'
      ring.style.width  = '36px'
      ring.style.height = '36px'
      ring.style.borderColor = 'rgba(99,102,241,0.5)'
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.body.removeChild(trail)
      document.body.removeChild(dot)
      document.body.removeChild(ring)
    }
  }, [dispatch])

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <AppRouter />
    </>
  )
}

export default App
