import * as THREE from 'three'

/**
 * HeroScene — Three.js animated 3D background for Hero section
 *
 * Creates:
 * - Floating glowing orbs (primary + accent colors)
 * - Rotating wireframe icosahedron (main centerpiece)
 * - Particle field (code dots)
 * - Subtle grid floor
 *
 * Usage:
 *   const scene = new HeroScene(canvasElement)
 *   scene.start()
 *   // on cleanup:
 *   scene.destroy()
 */
export class HeroScene {
  constructor(canvas) {
    this.canvas  = canvas
    this.width   = canvas.offsetWidth
    this.height  = canvas.offsetHeight
    this.animId  = null

    this._initRenderer()
    this._initScene()
    this._initCamera()
    this._initLights()
    this._initGeometry()
    this._initParticles()
    this._handleResize()
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas:     this.canvas,
      alpha:      true,
      antialias:  true,
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
  }

  _initScene() {
    this.scene = new THREE.Scene()
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100)
    this.camera.position.set(0, 0, 4)
  }

  _initLights() {
    const ambient = new THREE.AmbientLight(0x6366f1, 0.5)
    this.scene.add(ambient)

    const point1 = new THREE.PointLight(0x6366f1, 3, 10)
    point1.position.set(3, 3, 2)
    this.scene.add(point1)

    const point2 = new THREE.PointLight(0x8b5cf6, 2, 8)
    point2.position.set(-3, -2, 1)
    this.scene.add(point2)
  }

  _initGeometry() {
    // Main wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.2, 1)
    const mat = new THREE.MeshStandardMaterial({
      color:      0x6366f1,
      wireframe:  true,
      emissive:   0x6366f1,
      emissiveIntensity: 0.2,
    })
    this.mainMesh = new THREE.Mesh(geo, mat)
    this.scene.add(this.mainMesh)

    // Inner sphere
    const innerGeo = new THREE.SphereGeometry(0.6, 32, 32)
    const innerMat = new THREE.MeshStandardMaterial({
      color:      0x4f46e5,
      transparent: true,
      opacity:    0.3,
      roughness:  0.1,
      metalness:  0.9,
    })
    this.innerSphere = new THREE.Mesh(innerGeo, innerMat)
    this.scene.add(this.innerSphere)

    // Floating orbs
    this.orbs = []
    const orbPositions = [
      [-2.5, 1.5, -1], [2.5, -1, -1], [-1.5, -2, 0.5], [2, 2.5, -0.5],
    ]
    orbPositions.forEach(([x, y, z]) => {
      const orbGeo = new THREE.SphereGeometry(0.15, 16, 16)
      const orbMat = new THREE.MeshStandardMaterial({
        color:     0x8b5cf6,
        emissive:  0x8b5cf6,
        emissiveIntensity: 1,
      })
      const orb = new THREE.Mesh(orbGeo, orbMat)
      orb.position.set(x, y, z)
      orb._originalY = y
      this.scene.add(orb)
      this.orbs.push(orb)
    })
  }

  _initParticles() {
    const count = 200
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      color: 0x6366f1,
      size:  0.03,
      transparent: true,
      opacity: 0.6,
    })

    this.particles = new THREE.Points(geo, mat)
    this.scene.add(this.particles)
  }

  _handleResize() {
    this._resizeObserver = new ResizeObserver(() => {
      this.width  = this.canvas.offsetWidth
      this.height = this.canvas.offsetHeight
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.width, this.height)
    })
    this._resizeObserver.observe(this.canvas)
  }

  start() {
    const clock = new THREE.Clock()

    const animate = () => {
      this.animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Rotate main mesh
      this.mainMesh.rotation.x = t * 0.2
      this.mainMesh.rotation.y = t * 0.3
      this.innerSphere.rotation.y = -t * 0.15

      // Float orbs
      this.orbs.forEach((orb, i) => {
        orb.position.y = orb._originalY + Math.sin(t + i * 1.5) * 0.3
      })

      // Rotate particles
      this.particles.rotation.y = t * 0.02

      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  destroy() {
    cancelAnimationFrame(this.animId)
    this._resizeObserver?.disconnect()
    this.renderer.dispose()
  }
}
