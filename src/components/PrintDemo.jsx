import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const ACCENT = '#4FA8FF'
const HEAT = '#C98A4B'

const PROFILE = [
  [0.0, 0.92],
  [0.18, 0.98],
  [0.45, 0.72],
  [0.85, 0.56],
  [1.25, 0.78],
  [1.62, 1.02],
  [1.9, 0.82],
  [2.1, 0.52],
  [2.25, 0.58],
]
const TOTAL_H = 2.25
const LAYERS = 240

function radiusAt(y) {
  if (y <= PROFILE[0][0]) return PROFILE[0][1]
  for (let i = 1; i < PROFILE.length; i++) {
    const [y1, r1] = PROFILE[i]
    const [y0, r0] = PROFILE[i - 1]
    if (y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0)
  }
  return PROFILE[PROFILE.length - 1][1]
}

function useVaseGeometry() {
  return useMemo(() => {
    const points = PROFILE.map(([y, r]) => new THREE.Vector2(r, y))
    return new THREE.LatheGeometry(points, 64)
  }, [])
}

const CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)

function PrintJob({ counterRef }) {
  const solidRef = useRef()
  const ghostRef = useRef()
  const nozzleRef = useRef()
  const filamentRef = useRef()
  const clockRef = useRef(0)
  const geometry = useVaseGeometry()

  useFrame((state, delta) => {
    clockRef.current += delta
    const t = clockRef.current
    const cycle = TOTAL_H / 0.22
    const loopTime = cycle + 2.2
    const phase = t % loopTime
    const h = phase < cycle ? Math.min(phase * 0.22, TOTAL_H) : TOTAL_H

    CLIP_PLANE.constant = h
    solidRef.current.material.clippingPlanes = [CLIP_PLANE]

    const wobbleX = Math.sin(t * 9) * radiusAt(Math.min(h, TOTAL_H)) * 0.9
    const wobbleZ = Math.cos(t * 7) * radiusAt(Math.min(h, TOTAL_H)) * 0.9
    const nozzleY = Math.min(h, TOTAL_H) + 0.16
    nozzleRef.current.position.set(wobbleX, nozzleY, wobbleZ)

    const visible = phase < cycle && h < TOTAL_H
    filamentRef.current.visible = visible
    if (visible) {
      filamentRef.current.position.set(
        wobbleX,
        nozzleY - 0.07,
        wobbleZ
      )
      filamentRef.current.scale.y = 0.09
    }

    if (counterRef.current) {
      const layer = Math.floor((h / TOTAL_H) * LAYERS)
      counterRef.current.textContent = `LAYER ${String(layer).padStart(3, '0')} / ${LAYERS}`
      counterRef.current.dataset.state = phase >= loopTime - 2.2 ? 'done' : 'printing'
    }
  })

  return (
    <>
      <mesh ref={solidRef} geometry={geometry}>
        <meshStandardMaterial
          color="#1B1F25"
          emissive={ACCENT}
          emissiveIntensity={0.14}
          metalness={0.55}
          roughness={0.35}
          flatShading
          side={THREE.DoubleSide}
          clippingPlanes={[CLIP_PLANE]}
        />
      </mesh>
      <mesh ref={ghostRef} geometry={geometry}>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.07} depthWrite={false} />
      </mesh>

      <group ref={nozzleRef}>
        <mesh>
          <coneGeometry args={[0.09, 0.22, 20]} />
          <meshStandardMaterial color="#262B31" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.13, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color={HEAT} emissive={HEAT} emissiveIntensity={2.2} />
        </mesh>
        <pointLight position={[0, -0.2, 0]} intensity={2.4} distance={0.9} color={HEAT} />
      </group>

      <mesh ref={filamentRef}>
        <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
        <meshBasicMaterial color={HEAT} transparent opacity={0.85} />
      </mesh>
    </>
  )
}

function BuildPlate() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[1.7, 48]} />
        <meshStandardMaterial color="#10131A" metalness={0.3} roughness={0.7} />
      </mesh>
      <gridHelper args={[7, 28, '#262B31', '#1B2027']} position={[0, -0.02, 0]} />
    </>
  )
}

export default function PrintDemo() {
  const counterRef = useRef(null)
  return (
    <div className="print-demo">
      <div className="print-demo-bar">
        <span className="pd-label">Live print simulation</span>
        <span className="pd-layers" ref={counterRef}>LAYER 000 / {LAYERS}</span>
      </div>
      <div className="print-demo-canvas">
        <Canvas
          camera={{ position: [3.4, 2.4, 4.4], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, localClippingEnabled: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 3]} intensity={1.1} color={ACCENT} />
          <PrintJob counterRef={counterRef} />
          <BuildPlate />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.7}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 1, 0]}
          />
          <fog attach="fog" args={['#0B0D10', 9, 17]} />
        </Canvas>
      </div>
      <p className="print-demo-caption">
        Drag to orbit. Every design in the catalog starts exactly like this — one layer at a time.
      </p>
    </div>
  )
}
