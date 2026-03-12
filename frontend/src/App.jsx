import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import AppRouter from './router/AppRouter'
import { checkAuthStatus } from './store/slices/authSlice'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // On mount: check if user is already logged in (token in localStorage)
    dispatch(checkAuthStatus())
  }, [dispatch])

  return <AppRouter />
}

export default App
