'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  MeshWobbleMaterial, 
  Stars,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed, distort }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={speed || 2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <Sphere args={[1, 100, 100]} scale={1}>
          <MeshDistortMaterial
            color={color || "#6366f1"}
            attach="material"
            distort={distort || 0.4}
            speed={2}
            roughness={0}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

const BackgroundObjects = () => {
  return (
    <>
      <FloatingShape 
        position={[-4, 2, -5]} 
        color="#8b5cf6" 
        distort={0.5} 
        speed={1.5}
      />
      <FloatingShape 
        position={[4, -2, -3]} 
        color="#4f46e5" 
        distort={0.3} 
        speed={2}
      />
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
    </>
  );
};

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
          <BackgroundObjects />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
