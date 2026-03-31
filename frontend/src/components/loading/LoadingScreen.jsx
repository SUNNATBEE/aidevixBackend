import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial, Trail, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, memo, useMemo } from 'react'
import * as THREE from 'three'

// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/components/loading/LoadingScreen.jsx
// ============================================================

// Aylanuvchi halqa (ring) shakli
const Ring = memo(({ radius, color, speed, tilt }) => {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed
      ref.current.rotation.x += delta * speed * 0.3
    }
  })
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
    }
    return pts
  }, [radius])

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </line>
    </group>
  )
})

// Markaziy distort sfera
const CoreSphere = memo(() => {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.4
      ref.current.rotation.x = state.clock.elapsedTime * 0.2
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.1, 64, 64]} />
      <MeshDistortMaterial
        color="#4f46e5"
        emissive="#6366f1"
        emissiveIntensity={0.4}
        distort={0.5}
        speed={3}
        roughness={0}
        metalness={0.8}
      />
    </mesh>
  )
})

// Orbitda aylanuvchi kichik sferalar
const OrbitDot = memo(({ radius, speed, offset, color }) => {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.z = Math.sin(t) * radius
      ref.current.position.y = Math.sin(t * 0.5) * 0.5
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  )
})

// Suzuvchi geometrik shakllar
const FloatingShapes = memo(() => (
  <>
    <Float speed={1.4} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh position={[-3.5, 1.5, -3]}>
        <octahedronGeometry args={[0.7]} />
        <meshStandardMaterial color="#818cf8" wireframe />
      </mesh>
    </Float>
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2}>
      <mesh position={[3.5, -1, -4]}>
        <icosahedronGeometry args={[0.6]} />
        <meshStandardMaterial color="#a78bfa" wireframe />
      </mesh>
    </Float>
    <Float speed={1.1} rotationIntensity={1.5} floatIntensity={1}>
      <mesh position={[2, 2.5, -5]}>
        <tetrahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#c4b5fd" wireframe />
      </mesh>
    </Float>
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.8}>
      <mesh position={[-2.5, -2, -3]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#6366f1" wireframe />
      </mesh>
    </Float>
  </>
))

// Kamera yengil harakatlanadi
const Scene = memo(() => {
  const groupRef = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3
    }
  })

  return (
    <>
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0} fade speed={0.8} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#6366f1" intensity={3} />
      <pointLight position={[-5, -5, -5]} color="#8b5cf6" intensity={2} />
      <pointLight position={[0, 0, 3]} color="#c4b5fd" intensity={1} />

      <group ref={groupRef}>
        <CoreSphere />
        <Ring radius={2}   color="#6366f1" speed={0.6}  tilt={0.3} />
        <Ring radius={2.8} color="#8b5cf6" speed={-0.4} tilt={1.1} />
        <Ring radius={3.5} color="#a78bfa" speed={0.3}  tilt={0.7} />
        <OrbitDot radius={2}   speed={1.2} offset={0}    color="#818cf8" />
        <OrbitDot radius={2}   speed={1.2} offset={2.1}  color="#c4b5fd" />
        <OrbitDot radius={2.8} speed={0.8} offset={1.05} color="#6366f1" />
        <OrbitDot radius={3.5} speed={0.5} offset={3.14} color="#a78bfa" />
      </group>

      <FloatingShapes />
    </>
  )
})

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let current = 0
    const timer = setInterval(() => {
      // Tezlik: boshida tez, oxirida sekin (realistic feel)
      const remaining = 100 - current
      const step = Math.random() * (remaining * 0.08) + 0.5
      current = Math.min(current + step, 100)
      setProgress(current)

      if (current >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          setDone(true)
          setTimeout(() => onComplete?.(), 700)
        }, 600)
      }
    }, 80)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: 'blur(12px)',
          }}
          transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] bg-[#030712] flex items-center justify-center overflow-hidden"
        >
          {/* Three.js Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 70 }}
              gl={{ antialias: true, alpha: false }}
              dpr={[1, 1.5]}
            >
              <Scene />
            </Canvas>
          </div>

          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,7,18,0.7) 100%)' }}
          />

          {/* UI overlay */}
          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none select-none">
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}
                >
                  Ai
                </span>
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)' }}
                >
                  devix
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-white/30 text-xs uppercase tracking-[0.4em] mt-3 font-light"
              >
                Premium Learning Platform
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-64 md:w-80"
            >
              <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)',
                    backgroundSize: '200% 100%',
                    boxShadow: '0 0 12px rgba(99,102,241,0.8)',
                  }}
                  animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-white/25 text-[10px] uppercase tracking-[0.25em]">Loading</span>
                <span className="text-indigo-400 text-xs font-mono">{Math.round(progress)}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(LoadingScreen)
