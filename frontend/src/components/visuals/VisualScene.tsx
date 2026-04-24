'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  TorusKnot, 
  ContactShadows,
  Stars,
  PerspectiveCamera,
  Preload
} from '@react-three/drei';
import * as THREE from 'three';
import FloatingCode from './FloatingCode';

const TechObject = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Optimize material by memoizing or using simpler params
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <TorusKnot 
        ref={meshRef} 
        args={[1, 0.3, 128, 32]} 
        scale={2.2}
      >
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </TorusKnot>
    </Float>
  );
};

export default function VisualScene() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ 
          antialias: false, // Set to false for performance, DREI will handle sharp edges if needed
          powerPreference: "high-performance",
          alpha: true 
        }}
        dpr={[1, 1.5]} // Lower DPR for mobile and performance
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
          
          <TechObject />

          <FloatingCode />

          <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
