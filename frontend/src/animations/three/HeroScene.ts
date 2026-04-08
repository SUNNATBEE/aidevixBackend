// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/three/HeroScene.js
// ============================================================
//
// VAZIFA: Bosh sahifa (Hero) uchun Three.js 3D sahna yaratish
//
// SINFNING TUZILISHI (class HeroScene):
//   new HeroScene(canvasElement) → yaratadi
//   scene.start()                → animatsiyani boshlaydi
//   scene.destroy()              → tozalaydi (component unmount bo'lganda)
//
// SAHNA ELEMENTLARI:
//
//  1. RENDERER (WebGLRenderer):
//     - alpha: true (shaffof fon)
//     - antialias: true
//     - setPixelRatio(Math.min(window.devicePixelRatio, 2))
//
//  2. KAMERA (PerspectiveCamera):
//     - fov: 75, near: 0.1, far: 100
//     - position.set(0, 0, 4)
//
//  3. YORUG'LIK:
//     - AmbientLight (0x6366f1, intensity: 0.5)
//     - PointLight 1 → (3, 3, 2) — primary rang
//     - PointLight 2 → (-3, -2, 1) — accent rang
//
//  4. ASOSIY GEOMETRIYA:
//     - IcosahedronGeometry(1.2, 1) — wireframe (neon ko'k)
//     - SphereGeometry(0.6) — shaffof ichki sfera
//     - 4 ta kichik suzuvchi orb (SphereGeometry(0.15))
//
//  5. ZARRALAR (BufferGeometry):
//     - count: 200 ta nuqta
//     - Tasodifiy pozitsiyalar (-5 dan +5 gacha)
//     - PointsMaterial: color primary, size: 0.03
//
//  6. RESIZE OBSERVER:
//     - Canvas o'lchami o'zgarganda kamera va renderer yangilanadi
//
// ANIMATSIYA SIKLI (start() metodida):
//   - mainMesh: rotation.x += 0.2*t, rotation.y += 0.3*t
//   - innerSphere: rotation.y -= 0.15*t
//   - Orblar: y = originalY + Math.sin(t + i*1.5) * 0.3 (suzish)
//   - Particles: rotation.y += 0.02*t
//
// HOMEPAGE'DA ISHLATISH:
//   import { HeroScene } from '@animations/three/HeroScene'
//   import { useEffect, useRef } from 'react'
//
//   const canvasRef = useRef(null)
//   useEffect(() => {
//     const scene = new HeroScene(canvasRef.current)
//     scene.start()
//     return () => scene.destroy()
//   }, [])
//
//   // JSX:
//   <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
//
// KERAKLI IMPORTLAR:
//   import * as THREE from 'three'
// ============================================================

export class HeroScene {
  // TODO: QUDRAT bu klassni to'liq yozadi
  constructor(canvas) {}
  start() {}
  destroy() {}
}
