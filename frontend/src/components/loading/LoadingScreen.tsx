import React, { useState, useEffect, useRef } from 'react';
import SiteLogoMark from '@components/common/SiteLogoMark';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// --- 3D Geometric Floating Shapes ---
const FloatingShapes = () => {
  const cubeRef = useRef();
  const sphereRef = useRef();
  const torusRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (cubeRef.current) {
      cubeRef.current.rotation.x = time * 0.5;
      cubeRef.current.rotation.y = time * 0.3;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(time) * 0.5;
    }
    if (torusRef.current) {
      torusRef.current.rotation.z = time * 0.4;
      torusRef.current.rotation.x = time * 0.2;
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={cubeRef} position={[-2.5, 1, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <mesh ref={sphereRef} position={[2.5, -1, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
        <mesh ref={torusRef} position={[0, 0, -2]}>
          <torusGeometry args={[0.8, 0.3, 16, 100]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>
    </>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const counterRef = useRef(null);
  const progressObj = { value: 0 };

  useEffect(() => {
    // GSAP Progress Animation
    gsap.to(progressObj, {
      value: 100,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      },
      onComplete: () => {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    });
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 3D Cosmic Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />
          
          <FloatingShapes />
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        </Canvas>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center gap-5"
        >
          <SiteLogoMark size={72} className="shadow-[0_20px_50px_rgba(139,92,246,0.35)] ring-purple-500/30" />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse">
            Aidevix
          </h1>
        </motion.div>

        {/* GSAP Powered Counter */}
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">
            {progress}%
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${progress}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-slate-500 text-sm font-medium tracking-widest uppercase italic"
          >
            Ma'lumotlar yuklanmoqda...
          </motion.p>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center opacity-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white"></div>
          <div className="px-6 text-[10px] text-white tracking-[0.5em] uppercase">Future of Learning</div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white"></div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
