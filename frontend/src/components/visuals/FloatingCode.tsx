'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

const CodeSymbol = ({ symbol, position, color }: any) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group ref={meshRef} position={position}>
        <Text
          color={color || "#6366f1"}
          fontSize={1.5}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="left"
          font="https://fonts.gstatic.com/s/robotomono/v12/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbK_.woff" // Monospace font
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      </group>
    </Float>
  );
};

export default function FloatingCode() {
  return (
    <>
      <CodeSymbol symbol="{" position={[-8, 4, -5]} color="#8b5cf6" />
      <CodeSymbol symbol="}" position={[8, -4, -5]} color="#6366f1" />
      <CodeSymbol symbol="< />" position={[-6, -3, -6]} color="#ec4899" />
      <CodeSymbol symbol="JS" position={[6, 3, -6]} color="#eab308" />
    </>
  );
}
