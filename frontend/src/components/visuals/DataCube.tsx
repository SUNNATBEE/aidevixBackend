'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, Stars, Environment, Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const WireframeCube = ({ position, color, speed, distort }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={position}>
      <meshStandardMaterial
        color={color || "#6366f1"}
        wireframe
        emissive={color || "#6366f1"}
        emissiveIntensity={0.5}
      />
    </Box>
  );
};

export default function DataCube() {
  return (
    <div className="w-16 h-16 pointer-events-none opacity-80">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
          <WireframeCube position={[0, 0, 0]} color="#8b5cf6" />
        </Suspense>
      </Canvas>
    </div>
  );
}
