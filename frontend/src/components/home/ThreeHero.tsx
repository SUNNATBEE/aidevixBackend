'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, OrbitControls, Environment, PerspectiveCamera, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed, distort, radius }: any) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = Math.cos(time / 4) * speed;
      mesh.current.rotation.y = Math.sin(time / 2) * speed;
      mesh.current.position.y = position[1] + Math.sin(time / 2) * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[radius, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={speed * 2}
          distort={distort}
          radius={radius}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const BackgroundParticles = ({ count = 200 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        p[i * 3] = (Math.random() - 0.5) * 40;
        p[i * 3 + 1] = (Math.random() - 0.5) * 40;
        p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#4f46e5" transparent opacity={0.4} />
    </points>
  );
};

const Scene = ({ isDark }: { isDark: boolean }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      <BackgroundParticles count={150} />

      <group position={[0, 0, -5]}>
        <FloatingShape 
          position={[-4, 2, 0]} 
          color={isDark ? "#6366f1" : "#4f46e5"} 
          speed={1.5} 
          distort={0.4} 
          radius={1.5} 
        />
        <FloatingShape 
          position={[5, -1, -2]} 
          color={isDark ? "#a855f7" : "#8b5cf6"} 
          speed={1} 
          distort={0.3} 
          radius={1.2} 
        />
        <FloatingShape 
          position={[-2, -3, -4]} 
          color={isDark ? "#06b6d4" : "#0891b2"} 
          speed={2} 
          distort={0.5} 
          radius={0.8} 
        />
      </group>

      <Environment preset="city" />
    </>
  );
};

export default function ThreeHero({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas dpr={[1, 2]} gl={{ powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
