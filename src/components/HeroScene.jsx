import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'

const ACCENT = '#4FA8FF'
const HEAT = '#C98A4B'

function PrintAssembly() {
  const tilt = useRef()
  const spinner = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const { size } = useThree()

  const offsetX = size.aspect > 1.05 ? Math.min(size.aspect * 1.35, 2.4) : 0

  useFrame((state, delta) => {
    spinner.current.rotation.y += delta * 0.45
    spinner.current.rotation.z += delta * 0.12
    ring1.current.rotation.z += delta * 0.3
    ring2.current.rotation.z -= delta * 0.22
    const targetX = state.pointer.y * -0.25
    const targetY = state.pointer.x * 0.35
    tilt.current.rotation.x += (targetX - tilt.current.rotation.x) * 0.06
    tilt.current.rotation.y += (targetY - tilt.current.rotation.y) * 0.06
  })

  return (
    <group ref={tilt} position={[offsetX, 0, 0]}>
      <Float speed={1.6} rotationIntensity={0} floatIntensity={0.9}>
        <group ref={spinner}>
          <mesh>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial
              color="#14171C"
              emissive={ACCENT}
              emissiveIntensity={0.18}
              metalness={0.65}
              roughness={0.3}
              flatShading
            />
          </mesh>
          <mesh scale={1.42}>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.28} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.34, 0]} />
            <meshStandardMaterial
              color={HEAT}
              emissive={HEAT}
              emissiveIntensity={0.7}
              metalness={0.4}
              roughness={0.25}
            />
          </mesh>
        </group>

        <mesh ref={ring1} rotation={[Math.PI / 2.4, 0.4, 0]}>
          <torusGeometry args={[2.05, 0.02, 12, 90]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
        </mesh>
        <mesh ref={ring2} rotation={[Math.PI / 1.7, -0.5, 0.6]}>
          <torusGeometry args={[2.45, 0.012, 10, 90]} />
          <meshBasicMaterial color={HEAT} transparent opacity={0.4} />
        </mesh>
      </Float>
    </group>
  )
}

function PrintDust({ count = 260 }) {
  const points = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    const pos = points.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + delta * 0.12
      if (y > 4) y = -4
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    points.current.rotation.y = state.pointer.x * 0.04
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={ACCENT} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function HeroScene() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.55} />
        <pointLight position={[5, 4, 5]} intensity={40} color={ACCENT} />
        <pointLight position={[-5, -3, 3]} intensity={18} color={HEAT} />
        <PrintAssembly />
        <PrintDust />
        <fog attach="fog" args={['#0B0D10', 9, 16]} />
      </Canvas>
    </div>
  )
}
