import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { AnimatePresence } from 'framer-motion'

import AppRouter from './router/AppRouter'
import { checkAuthStatus } from './store/slices/authSlice'
import LoadingScreen from './components/loading/LoadingScreen'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function App() {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // On mount: check if user is already logged in (token in localStorage)
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <AppRouter />
    </>
  )
}

export default App
