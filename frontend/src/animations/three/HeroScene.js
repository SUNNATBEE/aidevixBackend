import * as THREE from 'three'

// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/three/HeroScene.js
// ============================================================

export class HeroScene {
  constructor(canvas) {
    if (!canvas) return
    this.canvas = canvas
    this.scene = new THREE.Scene()
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.set(0, 0, 4)

    // Mouse parallax tracking
    this.mouseX = 0
    this.mouseY = 0
    this.targetMouseX = 0
    this.targetMouseY = 0

    this.initLights()
    this.initMeshes()
    this.initParticles()
    this.initEvents()
    
    this.clock = new THREE.Clock()
    this.isDestroyed = false
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.5)
    this.scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x6366f1, 1.5)
    pointLight1.position.set(3, 3, 2)
    this.scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1)
    pointLight2.position.set(-3, -2, 1)
    this.scene.add(pointLight2)
  }

  initMeshes() {
    // Main Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.2, 1)
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    this.mainMesh = new THREE.Mesh(icoGeometry, icoMaterial)
    this.scene.add(this.mainMesh)

    // Inner Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32)
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.6,
      roughness: 0,
      metalness: 0.5,
    })
    this.innerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    this.scene.add(this.innerSphere)

    // Floating Orbs
    this.orbs = []
    const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16)
    const orbMaterial = new THREE.MeshStandardMaterial({ color: 0x4f46e5 })

    for (let i = 0; i < 4; i++) {
      const orb = new THREE.Mesh(orbGeometry, orbMaterial)
      const angle = (i / 4) * Math.PI * 2
      orb.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0)
      orb.userData = { 
        angle, 
        distance: 2, 
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2
      }
      this.orbs.push(orb)
      this.scene.add(orb)
    }
  }

  initParticles() {
    const count = 200
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  initEvents() {
    this.handleResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    this.handleMouseMove = (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousemove', this.handleMouseMove)
  }

  start() {
    const animate = () => {
      if (this.isDestroyed) return
      requestAnimationFrame(animate)

      const t = this.clock.getElapsedTime()

      // Mouse smoothing
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05

      // Main Mesh Animations
      this.mainMesh.rotation.x = t * 0.2 + this.mouseY * 0.2
      this.mainMesh.rotation.y = t * 0.3 + this.mouseX * 0.2
      this.mainMesh.position.y = Math.sin(t) * 0.1

      // Inner Sphere
      this.innerSphere.rotation.y = -t * 0.15
      this.innerSphere.position.y = Math.cos(t * 1.2) * 0.05

      // Orbs Animation
      this.orbs.forEach((orb, i) => {
        const data = orb.userData
        const angle = data.angle + t * data.speed
        orb.position.x = Math.cos(angle) * data.distance + this.mouseX * 0.5
        orb.position.y = Math.sin(angle) * data.distance + Math.sin(t * 1.5 + data.offset) * 0.3 + this.mouseY * 0.5
        orb.position.z = Math.sin(angle) * 0.5
      })

      // Particles
      this.particles.rotation.y = t * 0.02
      this.particles.position.x = this.mouseX * 0.1
      this.particles.position.y = -this.mouseY * 0.1

      // Camera parallax
      this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05
      this.camera.position.y += (-this.mouseY * 0.5 - this.camera.position.y) * 0.05
      this.camera.lookAt(0, 0, 0)

      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  destroy() {
    this.isDestroyed = true
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousemove', this.handleMouseMove)
    
    // Dispose resources
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    
    this.renderer.dispose()
  }
}
