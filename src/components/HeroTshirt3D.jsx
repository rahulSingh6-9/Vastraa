import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import modelUrl from '../assets/tshirt-mockup-fadeblack/source/Tshirt Mockup BrockCreative Final.glb?url'

function HeroTshirt3D() {
  const mountRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let renderer
    let animationFrame
    let resizeObserver
    let intersectionObserver
    let resizeHandler
    let contextLostHandler
    let pointerListeners = []
    let modelGroup
    let modelScene
    let disposed = false

    const showFallback = (error) => {
      console.error('Unable to render the VASTRAA 3D hero model.', error)
      if (!disposed) setStatus('fallback')
    }

    const initialize = () => {
      if (disposed) return

      try {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
        const width = Math.max(mount.clientWidth, 1)
        const height = Math.max(mount.clientHeight, 1)
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
        renderer.setSize(width, height, false)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.25
        renderer.setClearColor(0x000000, 0)
        renderer.domElement.className = 'hero__3d-canvas'
        mount.appendChild(renderer.domElement)

        scene.add(new THREE.HemisphereLight(0xe4e9f1, 0x151515, 2.1))

        const keyLight = new THREE.DirectionalLight(0xffffff, 3.1)
        keyLight.position.set(-3.5, 5, 5)
        scene.add(keyLight)

        const fillLight = new THREE.DirectionalLight(0xc9d7e8, 2.1)
        fillLight.position.set(4, 1.5, 3)
        scene.add(fillLight)

        const rimLight = new THREE.DirectionalLight(0xffe6cf, 3.4)
        rimLight.position.set(1, 3, -4)
        scene.add(rimLight)

        camera.position.set(0, 0, 6)
        camera.lookAt(0, 0, 0)

        let targetRotation = -0.12
        let currentRotation = targetRotation
        let activePointerId = null
        let dragStartX = 0
        let dragStartRotation = currentRotation
        let hasInteracted = false
        let resumeAt = 0
        let resumeStartedAt = 0
        let previousFrameTime = 0
        let reducedFrameTime = 0
        const dragSensitivity = 0.006
        const rotationDamping = 18

        const renderReducedMotionDrag = (now) => {
          animationFrame = 0
          if (disposed || !modelGroup) return

          const delta = reducedFrameTime
            ? Math.min((now - reducedFrameTime) / 1000, 0.05)
            : 1 / 60
          reducedFrameTime = now
          currentRotation +=
            (targetRotation - currentRotation) * (1 - Math.exp(-rotationDamping * delta))
          modelGroup.rotation.y = currentRotation
          renderer.render(scene, camera)

          if (activePointerId !== null || Math.abs(targetRotation - currentRotation) > 0.0005) {
            animationFrame = window.requestAnimationFrame(renderReducedMotionDrag)
          } else {
            reducedFrameTime = 0
          }
        }

        const scheduleReducedMotionDrag = () => {
          if (reducedMotion && !animationFrame) {
            animationFrame = window.requestAnimationFrame(renderReducedMotionDrag)
          }
        }

        const handlePointerDown = (event) => {
          if (activePointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) {
            return
          }

          activePointerId = event.pointerId
          dragStartX = event.clientX
          dragStartRotation = currentRotation
          targetRotation = currentRotation
          hasInteracted = true
          resumeAt = 0
          resumeStartedAt = 0
          renderer.domElement.setPointerCapture(event.pointerId)
        }

        const handlePointerMove = (event) => {
          if (event.pointerId !== activePointerId || !modelGroup) return

          targetRotation =
            dragStartRotation + (event.clientX - dragStartX) * dragSensitivity
          scheduleReducedMotionDrag()
        }

        const finishPointer = (event) => {
          if (event.pointerId !== activePointerId) return

          activePointerId = null
          resumeAt = performance.now() + 900
          resumeStartedAt = 0
          if (renderer.domElement.hasPointerCapture(event.pointerId)) {
            renderer.domElement.releasePointerCapture(event.pointerId)
          }
        }

        pointerListeners = [
          ['pointerdown', handlePointerDown],
          ['pointermove', handlePointerMove],
          ['pointerup', finishPointer],
          ['pointercancel', finishPointer],
          ['lostpointercapture', finishPointer],
        ]
        pointerListeners.forEach(([type, handler]) => {
          renderer.domElement.addEventListener(type, handler)
        })

        const resize = () => {
          const nextWidth = Math.max(mount.clientWidth, 1)
          const nextHeight = Math.max(mount.clientHeight, 1)
          camera.aspect = nextWidth / nextHeight
          camera.updateProjectionMatrix()
          renderer.setSize(nextWidth, nextHeight, false)
          if (modelGroup) {
            const bounds = new THREE.Box3().setFromObject(modelGroup)
            const size = bounds.getSize(new THREE.Vector3())
            const verticalFov = THREE.MathUtils.degToRad(camera.fov)
            const distance =
              (Math.max(size.y, size.x / camera.aspect) * 0.5 / Math.tan(verticalFov * 0.5)) * 1.7
            camera.position.z = Math.max(distance, 4)
            camera.updateProjectionMatrix()
          }
          renderer.render(scene, camera)
        }

        if ('ResizeObserver' in window) {
          resizeObserver = new ResizeObserver(resize)
          resizeObserver.observe(mount)
        } else {
          resizeHandler = resize
          window.addEventListener('resize', resizeHandler)
        }

        contextLostHandler = (event) => {
          event.preventDefault()
          window.cancelAnimationFrame(animationFrame)
          showFallback(new Error('WebGL context was lost.'))
        }
        renderer.domElement.addEventListener('webglcontextlost', contextLostHandler)

        new GLTFLoader().load(
          modelUrl,
          (gltf) => {
            if (disposed) {
              disposeModel(gltf.scene)
              return
            }

            modelScene = gltf.scene
            modelScene.updateMatrixWorld(true)
            const bounds = new THREE.Box3().setFromObject(modelScene)
            const center = bounds.getCenter(new THREE.Vector3())
            modelScene.position.sub(center)

            modelGroup = new THREE.Group()
            modelGroup.rotation.y = -0.12
            modelGroup.add(modelScene)
            scene.add(modelGroup)
            resize()
            setStatus('ready')

            if (reducedMotion) {
              renderer.render(scene, camera)
              return
            }

            const startTime = performance.now()
            previousFrameTime = startTime
            const render = (now) => {
              if (disposed) return
              const elapsed = (now - startTime) / 1000
              const delta = Math.min((now - previousFrameTime) / 1000, 0.05)
              previousFrameTime = now

              if (!hasInteracted) {
                currentRotation = -0.12 + elapsed * 0.3
                targetRotation = currentRotation
              } else if (activePointerId === null && resumeAt && now >= resumeAt) {
                if (!resumeStartedAt) resumeStartedAt = now
                const acceleration = Math.min((now - resumeStartedAt) / 700, 1)
                currentRotation += 0.3 * acceleration * delta
                targetRotation = currentRotation
              } else {
                const damping = 1 - Math.exp(-rotationDamping * delta)
                currentRotation += (targetRotation - currentRotation) * damping
              }

              modelGroup.rotation.y = currentRotation
              modelGroup.position.y = Math.sin(elapsed * 1.2) * 0.055
              renderer.render(scene, camera)
              animationFrame = window.requestAnimationFrame(render)
            }
            animationFrame = window.requestAnimationFrame(render)
          },
          undefined,
          showFallback,
        )
      } catch (error) {
        showFallback(error)
      }
    }

    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            intersectionObserver.disconnect()
            initialize()
          }
        },
        { rootMargin: '160px' },
      )
      intersectionObserver.observe(mount)
    } else {
      initialize()
    }

    return () => {
      disposed = true
      intersectionObserver?.disconnect()
      resizeObserver?.disconnect()
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      window.cancelAnimationFrame(animationFrame)
      if (modelScene) disposeModel(modelScene)
      if (renderer) {
        pointerListeners.forEach(([type, handler]) => {
          renderer.domElement.removeEventListener(type, handler)
        })
        if (contextLostHandler) {
          renderer.domElement.removeEventListener('webglcontextlost', contextLostHandler)
        }
        renderer.dispose()
        renderer.domElement.remove()
      }
    }
  }, [])

  return (
    <div
      className={`hero__3d${status === 'ready' ? ' is-ready' : ''}`}
      ref={mountRef}
      role="img"
      aria-label="Floating 3D VASTRAA fade-black T-shirt"
    >
      <div className="hero__tshirt-fallback" aria-hidden="true" />
    </div>
  )
}

function disposeModel(root) {
  const geometries = new Set()
  const materials = new Set()
  const textures = new Set()

  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry)
    if (!object.material) return

    const objectMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material]
    objectMaterials.forEach((material) => {
      materials.add(material)
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value)
      })
    })
  })

  geometries.forEach((geometry) => geometry.dispose())
  materials.forEach((material) => material.dispose())
  textures.forEach((texture) => texture.dispose())
}

export default HeroTshirt3D
