import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Link, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { PRODUCTS } from '../data/products.js'

const DISPLAY_START_Z = 2.6
const DISPLAY_END_Z = -31.4
const GROUP_GAP = 0.95
const LEDGE_Y = 1.16
const BEAM_Z = Array.from({ length: 12 }, (_, i) => 5.2 - i * 3.45)
const CHEVRON_Z = [2, -4.6, -11.2, -17.8, -24.4, -31]
const PENDANT_Z = [3.4, -0.8, -5, -9.2, -13.4, -17.6, -21.8, -26, -30.2]
const CARD_ROW_X = 1.66
const CARD_START_Z = 4.4
const CARD_STEP = 1
const TABLE_TOP = 1.72
const TABLE_FROM_Z = 5
const TABLE_TO_Z = -29.2

const CATEGORY_ORDER = [
  'Miniatures & Collectibles',
  'Home & Decor',
  'Mechanical Parts & Brackets',
  'Custom Enclosures & Mounts',
  'Cosplay & Props',
  'Drone & RC Parts',
  'Architecture Models',
  'Assistive Aids',
  'Characters',
  'Weapons',
]

const groupByCategory = (names) => names.map((name) => PRODUCTS.filter((product) => product.category === name))
const LEFT_GROUPS = groupByCategory(CATEGORY_ORDER.slice(0, 4))
const RIGHT_GROUPS = groupByCategory(CATEGORY_ORDER.slice(4))

const SHELF_COLORS = {
  'Mechanical Parts & Brackets': '#4f9188',
  'Miniatures & Collectibles': '#d0a451',
  'Cosplay & Props': '#d87963',
  'Drone & RC Parts': '#6399b0',
  'Home & Decor': '#c98270',
  'Architecture Models': '#a28f6d',
  'Assistive Aids': '#7ca27c',
  'Custom Enclosures & Mounts': '#579b98',
  Characters: '#b9798b',
  Weapons: '#7f89b1',
}

const MATERIALS = Object.fromEntries(
  Object.entries(SHELF_COLORS).map(([name, color]) => [
    name,
    new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.12 }),
  ]),
)

const DOOR_Z = 5.88
const HALL_HALF = 3.95
const HALL_HEIGHT = 5.6
const HALL_NEAR = 6.6
const HALL_FAR = -34
const HALL_MID = (HALL_NEAR + HALL_FAR) / 2
const HALL_LENGTH = HALL_NEAR - HALL_FAR
const START_Z = 11.6
const END_Z = -7.6

function smoothstep(from, to, value) {
  const t = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1)
  return t * t * (3 - 2 * t)
}

function LabRoom({ progress }) {
  const leftDoor = useRef()
  const rightDoor = useRef()
  const light = useRef()
  const cameraGoal = useMemo(() => new THREE.Vector3(), [])
  const lookGoal = useMemo(() => new THREE.Vector3(0, 2.62, DOOR_Z), [])

  useFrame(({ camera }, delta) => {
    const amount = progress.current
    const open = smoothstep(0.02, 0.26, amount)
    const travel = smoothstep(0.26, 1, amount)
    const enter = smoothstep(0.26, 0.62, amount)
    const glide = Math.sin(travel * Math.PI)

    if (leftDoor.current && rightDoor.current) {
      leftDoor.current.position.x = THREE.MathUtils.damp(leftDoor.current.position.x, -1.28 - open * 2.85, 5, delta)
      rightDoor.current.position.x = THREE.MathUtils.damp(rightDoor.current.position.x, 1.28 + open * 2.85, 5, delta)
    }

    cameraGoal.set(
      glide * 0.16,
      2.75 - enter * 0.13,
      THREE.MathUtils.lerp(START_Z, END_Z, travel),
    )
    camera.position.lerp(cameraGoal, 1 - Math.exp(-delta * 2.4))
    lookGoal.set(0, THREE.MathUtils.lerp(2.62, 2.72, enter), THREE.MathUtils.lerp(DOOR_Z, HALL_FAR, enter))
    camera.lookAt(lookGoal)

    if (light.current) light.current.intensity = 1.1 + enter * 1.35
  })

  return (
    <>
      <color attach="background" args={['#18272d']} />
      <fog attach="fog" args={['#18272d', 11, 42]} />
      <ambientLight intensity={1.2} color="#e9f4ef" />
      <directionalLight position={[-4, 8, 6]} intensity={1.9} color="#f1fbf8" />
      <pointLight ref={light} position={[0, 5.1, -1.5]} intensity={1.1} distance={16} color="#c7f3ea" />

      <Hallway />
      <Facade />
      <DoorFrame />

      {/* The catalog, arranged along both walls of the hall. */}
      <WallDisplay side="left" groups={LEFT_GROUPS} scale={1.24} />
      <WallDisplay side="right" groups={RIGHT_GROUPS} scale={1.16} />

      {/* Every design also stands on the tables as an upright, clickable card. */}
      <FloorCards />

      <Printer side="right" z={4.2} />
      <Workbench side="left" z={-32.5} />
      <SpoolTower side="right" z={-32.5} />

      <group ref={leftDoor} position={[-1.28, 0, DOOR_Z]}>
        <DoorPanel side="left" />
      </group>
      <group ref={rightDoor} position={[1.28, 0, DOOR_Z]}>
        <DoorPanel side="right" />
      </group>
    </>
  )
}

/* ---------------------------------------------------------------- shell -- */

function Hallway() {
  return (
    <group>
      {/* Deck, ceiling and the two long walls of the lab. */}
      <mesh position={[0, -0.15, HALL_MID]} receiveShadow>
        <boxGeometry args={[(HALL_HALF + 0.3) * 2, 0.3, HALL_LENGTH + 0.4]} />
        <meshStandardMaterial color="#79867f" roughness={0.8} metalness={0.08} />
      </mesh>
      <mesh position={[0, HALL_HEIGHT + 0.15, HALL_MID]}>
        <boxGeometry args={[(HALL_HALF + 0.3) * 2, 0.3, HALL_LENGTH + 0.4]} />
        <meshStandardMaterial color="#dbe5df" roughness={0.92} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * (HALL_HALF + 0.15), HALL_HEIGHT / 2, HALL_MID]}>
            <boxGeometry args={[0.3, HALL_HEIGHT, HALL_LENGTH]} />
            <meshStandardMaterial color="#c2d1ca" roughness={0.87} />
          </mesh>
          <mesh position={[side * (HALL_HALF - 0.03), 0.58, HALL_MID]}>
            <boxGeometry args={[0.06, 1.16, HALL_LENGTH - 0.2]} />
            <meshStandardMaterial color="#6f807b" roughness={0.7} metalness={0.14} />
          </mesh>
          <mesh position={[side * (HALL_HALF - 0.05), 1.24, HALL_MID]}>
            <boxGeometry args={[0.05, 0.055, HALL_LENGTH - 0.2]} />
            <meshStandardMaterial color="#64bdb6" emissive="#4fb0a8" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[side * (HALL_HALF - 0.22), HALL_HEIGHT - 0.62, HALL_MID]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, HALL_LENGTH - 0.6, 8]} />
            <meshStandardMaterial color="#8a9a94" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Far end wall: the vanishing point of the whole hall. */}
      <mesh position={[0, HALL_HEIGHT / 2, HALL_FAR - 0.2]}>
        <boxGeometry args={[(HALL_HALF + 0.3) * 2, HALL_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#a9bab3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.55, HALL_FAR + 0.03]}>
        <boxGeometry args={[6.6, 2.1, 0.06]} />
        <meshStandardMaterial color="#1d2f2f" roughness={0.62} />
      </mesh>
      <Text position={[0, 3.92, HALL_FAR + 0.09]} fontSize={0.86} color="#8fe0d5" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        773 LABS
      </Text>
      <Text position={[0, 3.02, HALL_FAR + 0.09]} fontSize={0.19} color="#cfe9e2" anchorX="center" anchorY="middle" letterSpacing={0.22}>
        DESIGN LIBRARY  ·  {PRODUCTS.length} PRINTED OBJECTS
      </Text>
      <mesh position={[0, 2.35, HALL_FAR + 0.06]}>
        <boxGeometry args={[6.2, 0.05, 0.04]} />
        <meshStandardMaterial color="#8be1d5" emissive="#55c1b5" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, 3.4, HALL_FAR + 1.6]} intensity={26} distance={12} color="#9fe0d6" />

      {/* Ceiling beams and task lighting repeat into the distance. */}
      {BEAM_Z.map((z, i) => (
        <group key={z}>
          <mesh position={[0, HALL_HEIGHT - 0.11, z]}>
            <boxGeometry args={[HALL_HALF * 2, 0.22, 0.24]} />
            <meshStandardMaterial color="#a6b7b0" roughness={0.72} metalness={0.2} />
          </mesh>
          <mesh position={[0, HALL_HEIGHT - 0.3, z]}>
            <boxGeometry args={[2.1, 0.06, 0.16]} />
            <meshStandardMaterial color="#f6fffd" emissive="#c3ece5" emissiveIntensity={1.85} />
          </mesh>
          {i % 3 === 0 && (
            <pointLight position={[0, HALL_HEIGHT - 0.8, z]} intensity={15} distance={9.5} color="#d5f5ef" />
          )}
        </group>
      ))}

      {/* Pendant lamps wash the display ledges along both walls. */}
      {PENDANT_Z.map((z, i) => [-1, 1].map((side) => (
        <group key={`${z}-${side}`} position={[side * 2.62, 0, z]}>
          <mesh position={[0, 4.62, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.96, 6]} />
            <meshStandardMaterial color="#3d4c48" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.24, 0]}>
            <coneGeometry args={[0.34, 0.4, 14, 1, true]} />
            <meshStandardMaterial color="#637975" metalness={0.55} roughness={0.34} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 4.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 14]} />
            <meshStandardMaterial color="#f4fffc" emissive="#c9f0e8" emissiveIntensity={1.5} side={THREE.DoubleSide} />
          </mesh>
          {i % 4 === 1 && <pointLight position={[0, 3.95, 0]} intensity={9} distance={6.5} color="#cdeee7" />}
        </group>
      )))}

      {/* Floor guides lead the visitor deep into the workspace. */}
      {[-2.62, 2.62].map((x) => (
        <mesh key={x} position={[x, 0.014, HALL_MID]}>
          <boxGeometry args={[0.05, 0.02, HALL_LENGTH - 1]} />
          <meshStandardMaterial color="#64bdb6" emissive="#4fb0a8" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {CHEVRON_Z.map((z) => (
        <group key={z} position={[0, 0.024, z]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.24, 0, 0]} rotation={[0, side * 0.62, 0]}>
              <boxGeometry args={[0.05, 0.02, 0.8]} />
              <meshStandardMaterial color="#64bdb6" emissive="#4fb0a8" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Threshold marking and entry signage just inside the doors. */}
      <mesh position={[0, 0.02, DOOR_Z + 0.55]}>
        <boxGeometry args={[5.5, 0.035, 1.5]} />
        <meshStandardMaterial color="#53bab4" emissive="#53bab4" emissiveIntensity={0.45} />
      </mesh>
      <group position={[-(HALL_HALF - 0.07), 3.4, 4.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[3.1, 1.25, 0.05]} />
          <meshStandardMaterial color="#223634" roughness={0.6} />
        </mesh>
        <Text position={[0, 0.26, 0.06]} fontSize={0.38} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.14}>
          LAB 01
        </Text>
        <Text position={[0, -0.24, 0.06]} fontSize={0.14} color="#6fb7b0" anchorX="center" anchorY="middle" letterSpacing={0.18}>
          PRINT STUDIO
        </Text>
      </group>
      <group position={[HALL_HALF - 0.07, 3.4, 4.2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[2.4, 1.05, 0.05]} />
          <meshStandardMaterial color="#223634" roughness={0.6} />
        </mesh>
        <Text position={[0, 0.18, 0.06]} fontSize={0.22} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.16}>
          OPEN FLOOR
        </Text>
        <Text position={[0, -0.22, 0.06]} fontSize={0.13} color="#6fb7b0" anchorX="center" anchorY="middle" letterSpacing={0.16}>
          {PRODUCTS.length} DESIGNS ON DISPLAY
        </Text>
      </group>
    </group>
  )
}

function Facade() {
  return (
    <group>
      {/* Ground outside so the approach never floats in the void. */}
      <mesh position={[0, -0.16, 9.2]} receiveShadow>
        <boxGeometry args={[16, 0.32, 6.4]} />
        <meshStandardMaterial color="#4c5754" roughness={0.92} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.52, 2.8, DOOR_Z - 0.26]}>
          <boxGeometry args={[1.24, 5.6, 0.5]} />
          <meshStandardMaterial color="#bccbc4" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 5.44, DOOR_Z - 0.26]}>
        <boxGeometry args={[8.28, 0.32, 0.5]} />
        <meshStandardMaterial color="#bccbc4" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.02, DOOR_Z + 0.9]}>
        <boxGeometry args={[5.6, 0.03, 1.9]} />
        <meshStandardMaterial color="#4f8f8a" emissive="#4f8f8a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function DoorFrame() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 2.78, 2.7, DOOR_Z - 0.26]}>
          <boxGeometry args={[0.26, 5.6, 0.55]} />
          <meshStandardMaterial color="#637975" metalness={0.58} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[0, 5.42, DOOR_Z - 0.26]}>
        <boxGeometry args={[5.8, 0.28, 0.55]} />
        <meshStandardMaterial color="#637975" metalness={0.58} roughness={0.32} />
      </mesh>
    </group>
  )
}

/* --------------------------------------------------------------- catalog -- */

function WallDisplay({ side, groups, scale }) {
  const rotation = side === 'left' ? Math.PI / 2 : -Math.PI / 2
  const x = side === 'left' ? -HALL_HALF : HALL_HALF
  const toLocal = (worldZ) => (side === 'left' ? -worldZ : worldZ)
  const span = DISPLAY_START_Z - DISPLAY_END_Z
  const midLocal = toLocal((DISPLAY_START_Z + DISPLAY_END_Z) / 2)

  const layout = useMemo(() => {
    const total = groups.reduce((sum, group) => sum + group.length, 0)
    const gapTotal = GROUP_GAP * Math.max(0, groups.length - 1)
    const step = (span - gapTotal) / Math.max(1, total - 1)
    const laid = []
    let cursor = DISPLAY_START_Z

    groups.forEach((group, index) => {
      const slots = group.map((product) => {
        const slot = { product, z: cursor }
        cursor -= step
        return slot
      })
      laid.push({
        name: group[0].category,
        count: group.length,
        slots,
        from: slots[0].z,
        to: slots[slots.length - 1].z,
      })
      if (index < groups.length - 1) cursor -= GROUP_GAP
    })

    return laid
  }, [groups, span])

  return (
    <group position={[x, 0, 0]} rotation={[0, rotation, 0]}>
      <mesh position={[midLocal, LEDGE_Y, 0.48]} receiveShadow>
        <boxGeometry args={[span + 0.8, 0.14, 0.94]} />
        <meshStandardMaterial color="#dbe4de" roughness={0.34} metalness={0.4} />
      </mesh>
      <mesh position={[midLocal, LEDGE_Y + 0.34, 0.05]}>
        <boxGeometry args={[span + 0.8, 0.54, 0.06]} />
        <meshStandardMaterial color="#b3c4bd" roughness={0.8} />
      </mesh>
      <mesh position={[midLocal, LEDGE_Y - 0.1, 0.92]}>
        <boxGeometry args={[span + 0.8, 0.05, 0.06]} />
        <meshStandardMaterial color="#8be1d5" emissive="#55c1b5" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[midLocal, LEDGE_Y + 0.63, 0.09]}>
        <boxGeometry args={[span + 0.8, 0.03, 0.04]} />
        <meshStandardMaterial color="#8be1d5" emissive="#55c1b5" emissiveIntensity={0.6} />
      </mesh>
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[toLocal(DISPLAY_START_Z + 0.7 - i * 2.3), LEDGE_Y - 0.26, 0.5]}>
          <boxGeometry args={[0.1, 0.34, 0.84]} />
          <meshStandardMaterial color="#5d6f6a" metalness={0.5} roughness={0.44} />
        </mesh>
      ))}

      {layout.map((group) => {
        const mid = toLocal((group.from + group.to) / 2)
        const length = group.from - group.to

        return (
          <group key={group.name}>
            <Text
              position={[mid, 2.74, 0.12]}
              fontSize={0.32}
              color="#5f8d87"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.12}
              maxWidth={length * 0.88}
              lineHeight={1.1}
              textAlign="center"
            >
              {group.name.toUpperCase()}
            </Text>
            <mesh position={[mid, 2.34, 0.12]}>
              <boxGeometry args={[length, 0.035, 0.03]} />
              <meshStandardMaterial color="#7fbfb6" emissive="#4fb0a8" emissiveIntensity={0.4} />
            </mesh>
            <Text position={[mid, 2.13, 0.12]} fontSize={0.11} color="#7ba39e" anchorX="center" anchorY="middle" letterSpacing={0.2}>
              {String(group.count).padStart(2, '0')} DESIGNS
            </Text>
            {group.slots.map((slot) => (
              <DisplayItem key={slot.product.id} product={slot.product} x={toLocal(slot.z)} scale={scale} />
            ))}
          </group>
        )
      })}
    </group>
  )
}

function DisplayItem({ product, x, scale }) {
  const material = MATERIALS[product.category] || MATERIALS['Home & Decor']

  return (
    <group position={[x, LEDGE_Y + 0.07, 0.46]} scale={scale}>
      <Artifact icon={product.icon} material={material} />
      <group position={[0, 0.06, 0.5]} rotation={[-0.62, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.68, 0.02, 0.2]} />
          <meshStandardMaterial color="#eef4ef" roughness={0.52} />
        </mesh>
        <Text
          position={[0, 0.014, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.05}
          maxWidth={0.62}
          lineHeight={1.14}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#2c4749"
        >
          {product.name}
        </Text>
      </group>
    </group>
  )
}

function Artifact({ icon, material }) {
  const trim = MATERIALS['Architecture Models']

  if (icon === 'vase') {
    const points = [
      new THREE.Vector2(0.06, 0), new THREE.Vector2(0.22, 0.06), new THREE.Vector2(0.31, 0.3),
      new THREE.Vector2(0.25, 0.55), new THREE.Vector2(0.12, 0.7), new THREE.Vector2(0.13, 0.86),
      new THREE.Vector2(0.2, 0.88),
    ]
    return <mesh position={[0, 0.15, 0]} castShadow><latheGeometry args={[points, 12]} /><primitive object={material} attach="material" /></mesh>
  }

  if (icon === 'drone') {
    return (
      <group position={[0, 0.28, 0]}>
        <mesh material={material}><boxGeometry args={[0.54, 0.1, 0.32]} /></mesh>
        {[[-0.38, 0, -0.34], [0.38, 0, -0.34], [-0.38, 0, 0.34], [0.38, 0, 0.34]].map(([px, py, pz], i) => (
          <group key={i} position={[px, py, pz]}>
            <mesh material={trim}><boxGeometry args={[0.48, 0.06, 0.07]} /></mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} material={material}><torusGeometry args={[0.15, 0.025, 6, 12]} /></mesh>
          </group>
        ))}
      </group>
    )
  }

  if (icon === 'building') {
    return (
      <group position={[0, 0.3, 0]}>
        <mesh material={material}><boxGeometry args={[0.54, 0.55, 0.4]} /></mesh>
        <mesh position={[-0.23, 0.34, 0]} material={trim}><boxGeometry args={[0.14, 0.32, 0.42]} /></mesh>
        <mesh position={[0.18, 0.22, 0]} material={trim}><boxGeometry args={[0.16, 0.22, 0.44]} /></mesh>
      </group>
    )
  }

  if (icon === 'bracket' || icon === 'gear') {
    return (
      <group position={[0, 0.25, 0]} rotation={[0.15, 0.18, -0.12]}>
        <mesh material={material}><boxGeometry args={[0.56, 0.14, 0.38]} /></mesh>
        <mesh position={[-0.2, 0.22, 0]} material={material}><boxGeometry args={[0.14, 0.44, 0.38]} /></mesh>
        {icon === 'gear' && <mesh position={[0.22, 0.2, 0.21]} material={trim}><torusGeometry args={[0.18, 0.055, 7, 12]} /></mesh>}
      </group>
    )
  }

  if (icon === 'helmet') {
    return (
      <group position={[0, 0.28, 0]}>
        <mesh scale={[0.42, 0.46, 0.35]} material={material}><icosahedronGeometry args={[0.72, 1]} /></mesh>
        <mesh position={[0, -0.13, 0.24]} material={trim}><boxGeometry args={[0.42, 0.1, 0.12]} /></mesh>
      </group>
    )
  }

  if (icon === 'grip') {
    return (
      <group position={[0, 0.3, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={material}><torusGeometry args={[0.23, 0.12, 8, 16]} /></mesh>
        <mesh position={[0.27, 0, 0]} rotation={[0, 0, -0.4]} material={trim}><cylinderGeometry args={[0.09, 0.13, 0.42, 8]} /></mesh>
      </group>
    )
  }

  if (icon === 'mini') {
    return (
      <group position={[0, 0.29, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.25, 0.33, 0.2]} material={material}><icosahedronGeometry args={[0.7, 1]} /></mesh>
        <mesh position={[0, 0.22, 0]} scale={[0.2, 0.22, 0.18]} material={trim}><sphereGeometry args={[0.65, 10, 8]} /></mesh>
        <mesh position={[0, -0.37, 0]} material={trim}><cylinderGeometry args={[0.22, 0.27, 0.1, 8]} /></mesh>
      </group>
    )
  }

  return (
    <group position={[0, 0.28, 0]}>
      <mesh material={material}><dodecahedronGeometry args={[0.38, 0]} /></mesh>
      <mesh position={[0.24, 0.12, 0]} material={trim}><sphereGeometry args={[0.11, 8, 8]} /></mesh>
    </group>
  )
}

function FloorCards() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <DisplayTable key={side} side={side} />
      ))}
      {PRODUCTS.map((product, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const z = CARD_START_Z - Math.floor(i / 2) * CARD_STEP
        return <FloorCard key={product.id} product={product} side={side} z={z} order={i + 1} />
      })}
    </group>
  )
}

function DisplayTable({ side }) {
  const x = side * CARD_ROW_X
  const length = TABLE_FROM_Z - TABLE_TO_Z
  const midZ = (TABLE_FROM_Z + TABLE_TO_Z) / 2
  const legs = Array.from({ length: 7 }, (_, i) => TABLE_FROM_Z - 0.9 - i * ((length - 1.8) / 6))

  return (
    <group>
      <mesh position={[x, TABLE_TOP - 0.04, midZ]}>
        <boxGeometry args={[1.02, 0.08, length]} />
        <meshStandardMaterial color="#e2eae4" roughness={0.3} metalness={0.42} />
      </mesh>
      <mesh position={[x, TABLE_TOP - 0.16, midZ]}>
        <boxGeometry args={[0.92, 0.16, length - 0.1]} />
        <meshStandardMaterial color="#5d6f6a" roughness={0.6} metalness={0.24} />
      </mesh>
      <mesh position={[x, TABLE_TOP + 0.006, midZ]}>
        <boxGeometry args={[0.9, 0.012, length - 0.3]} />
        <meshStandardMaterial color="#8be1d5" emissive="#4fb0a8" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[x, 0.52, midZ]}>
        <boxGeometry args={[0.82, 0.06, length - 0.6]} />
        <meshStandardMaterial color="#8d9d97" roughness={0.7} metalness={0.16} />
      </mesh>
      {legs.map((z) => (
        <group key={z} position={[x, 0, z]}>
          {[-0.4, 0.4].map((offset) => (
            <mesh key={offset} position={[offset, (TABLE_TOP - 0.24) / 2, 0]}>
              <boxGeometry args={[0.08, TABLE_TOP - 0.24, 0.08]} />
              <meshStandardMaterial color="#4f615d" metalness={0.66} roughness={0.34} />
            </mesh>
          ))}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.86, 0.05, 0.06]} />
            <meshStandardMaterial color="#4f615d" metalness={0.66} roughness={0.34} />
          </mesh>
        </group>
      ))}
      <mesh position={[x, TABLE_TOP - 0.16, TABLE_TO_Z - 0.56]}>
        <boxGeometry args={[0.94, 0.22, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text
        position={[x, TABLE_TOP - 0.16, TABLE_TO_Z - 0.53]}
        fontSize={0.058}
        color="#9be3d8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        TAP A CARD TO INSPECT
      </Text>
    </group>
  )
}

function FloorCard({ product, side, z, order }) {
  const material = MATERIALS[product.category] || MATERIALS['Home & Decor']
  const accent = SHELF_COLORS[product.category] || SHELF_COLORS['Home & Decor']
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const lift = useRef(0)
  const root = useRef()

  useFrame((_, delta) => {
    lift.current = THREE.MathUtils.damp(lift.current, hovered ? 1 : 0, 9, delta)
    if (!root.current) return
    root.current.position.y = TABLE_TOP + lift.current * 0.13
    root.current.position.z = z - lift.current * 0.05
  })

  useEffect(() => () => {
    document.body.style.cursor = ''
  }, [])

  const open = () => navigate(`/product/${product.id}`)

  return (
    <group ref={root} position={[side * CARD_ROW_X, TABLE_TOP, z]} rotation={[-0.13, -side * 0.2, 0]}>
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[0.78, 1.16, 0.022]} />
        <meshStandardMaterial color="#2c4144" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.58, 0.018]}>
        <boxGeometry args={[0.72, 1.1, 0.024]} />
        <meshStandardMaterial
          color="#f1ede2"
          roughness={0.72}
          emissive="#7fbfb6"
          emissiveIntensity={hovered ? 0.55 : 0}
        />
      </mesh>
      <mesh position={[0, 1.03, 0.032]}>
        <boxGeometry args={[0.72, 0.14, 0.026]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.42}
          metalness={0.1}
          emissive={accent}
          emissiveIntensity={hovered ? 0.65 : 0.12}
        />
      </mesh>
      <Text position={[0, 1.03, 0.05]} fontSize={0.062} color="#f7f4ec" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        {String(order).padStart(2, '0')}
      </Text>
      <group position={[0, 0.52, 0.05]} scale={hovered ? 0.54 : 0.5}>
        <Artifact icon={product.icon} material={material} />
      </group>
      <Text
        position={[0, 0.28, 0.05]}
        fontSize={0.058}
        maxWidth={0.6}
        lineHeight={1.16}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#223b3d"
      >
        {product.name}
      </Text>
      <Text position={[0, 0.1, 0.05]} fontSize={0.036} color="#6d8f8b" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        {product.category.toUpperCase()}
      </Text>

      <mesh
        position={[0, 0.58, 0.075]}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
        onClick={(event) => {
          event.stopPropagation()
          open()
        }}
      >
        <planeGeometry args={[0.86, 1.24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* --------------------------------------------------------------- machines -- */

function againstWall(side, z) {
  return {
    position: [side === 'left' ? -HALL_HALF + 0.05 : HALL_HALF - 0.05, 0, z],
    rotation: [0, side === 'left' ? Math.PI / 2 : -Math.PI / 2, 0],
  }
}

function Printer({ side, z }) {
  const placement = againstWall(side, z)
  return (
    <group position={placement.position} rotation={placement.rotation}>
      <group position={[0, 0.08, 0.95]}>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.9, 2.55, 1.7]} />
          <meshStandardMaterial color="#34423c" metalness={0.48} roughness={0.4} wireframe />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[1.48, 0.12, 1.32]} />
          <meshStandardMaterial color="#5bafaa" metalness={0.24} roughness={0.42} />
        </mesh>
        <mesh position={[0.1, 0.72, -0.08]}>
          <cylinderGeometry args={[0.28, 0.32, 0.54, 6]} />
          <meshStandardMaterial color="#e7c58d" roughness={0.56} />
        </mesh>
        <mesh position={[0.1, 1.06, -0.08]}>
          <coneGeometry args={[0.28, 0.22, 6]} />
          <meshStandardMaterial color="#e7c58d" roughness={0.56} />
        </mesh>
        <mesh position={[0, 2.48, 0.82]}>
          <boxGeometry args={[0.56, 0.28, 0.18]} />
          <meshStandardMaterial color="#70d5cc" emissive="#53c2b9" emissiveIntensity={0.48} />
        </mesh>
        <Text position={[0, 2.48, 0.93]} fontSize={0.075} color="#173536" anchorX="center" anchorY="middle" letterSpacing={0.08}>
          FDM · {String(z).replace('-', '0')}
        </Text>
      </group>
      <mesh position={[0, 1.5, 0.02]}>
        <boxGeometry args={[2.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text position={[0, 1.5, 0.06]} fontSize={0.13} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        PRINT BAY
      </Text>
    </group>
  )
}

function Workbench({ side, z }) {
  const placement = againstWall(side, z)
  return (
    <group position={placement.position} rotation={placement.rotation}>
      <group position={[0, 0, 0.95]}>
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[2.45, 0.16, 1.5]} />
          <meshStandardMaterial color="#d6e0da" roughness={0.38} metalness={0.36} />
        </mesh>
        {[-0.98, 0.98].map((px) => [-0.55, 0.55].map((pz) => (
          <mesh key={`${px}-${pz}`} position={[px, 0.54, pz]}>
            <boxGeometry args={[0.12, 1.08, 0.12]} />
            <meshStandardMaterial color="#607672" metalness={0.7} roughness={0.32} />
          </mesh>
        )))}
        <mesh position={[-0.52, 1.55, 0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 0.24, 24]} />
          <meshStandardMaterial color="#df886f" roughness={0.55} />
        </mesh>
        <mesh position={[0.2, 1.5, 0.05]}>
          <boxGeometry args={[0.55, 0.56, 0.48]} />
          <meshStandardMaterial color="#f0f3e9" roughness={0.48} />
        </mesh>
        <mesh position={[0.72, 1.45, 0.28]}>
          <cylinderGeometry args={[0.2, 0.2, 0.48, 12]} />
          <meshStandardMaterial color="#70bdb0" roughness={0.38} />
        </mesh>
        <mesh position={[0, 1.86, -0.5]}>
          <boxGeometry args={[2.3, 0.06, 0.1]} />
          <meshStandardMaterial color="#64bdb6" emissive="#4fb0a8" emissiveIntensity={0.5} />
        </mesh>
      </group>
      <mesh position={[0, 1.12, 0.02]}>
        <boxGeometry args={[2.9, 0.32, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text position={[0, 1.12, 0.06]} fontSize={0.11} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        MATERIAL STATION
      </Text>
    </group>
  )
}

function SpoolTower({ side, z }) {
  const placement = againstWall(side, z)
  return (
    <group position={placement.position} rotation={placement.rotation}>
      <group position={[0, 0, 0.8]}>
        {[-1.1, 1.1].map((px) => (
          <mesh key={px} position={[px, 1.1, 0]}>
            <boxGeometry args={[0.1, 2.2, 0.7]} />
            <meshStandardMaterial color="#607672" metalness={0.66} roughness={0.34} />
          </mesh>
        ))}
        {[0.5, 1.15, 1.8].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[2.3, 0.08, 0.7]} />
            <meshStandardMaterial color="#9eafaa" metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
        {[
          [0.5, -0.6, '#d0a451'], [0.5, 0.6, '#6399b0'], [1.15, -0.6, '#d87963'],
          [1.15, 0.6, '#7ca27c'], [1.8, -0.6, '#b9798b'], [1.8, 0.6, '#7f89b1'],
        ].map(([y, px, color], i) => (
          <mesh key={i} position={[px, y + 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.2, 14]} />
            <meshStandardMaterial color={color} roughness={0.42} metalness={0.1} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 2.42, 0.02]}>
        <boxGeometry args={[2.4, 0.34, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text position={[0, 2.42, 0.06]} fontSize={0.11} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        FILAMENT STOCK
      </Text>
    </group>
  )
}

/* ----------------------------------------------------------------- doors -- */

function DoorPanel({ side }) {
  return (
    <group>
      <mesh position={[0, 2.66, 0]}>
        <boxGeometry args={[2.54, 5.24, 0.24]} />
        <meshStandardMaterial color="#cadbd7" roughness={0.4} metalness={0.28} />
      </mesh>
      <mesh position={[0, 2.66, 0.132]}>
        <boxGeometry args={[2.28, 4.95, 0.028]} />
        <meshStandardMaterial color="#a9ceca" roughness={0.3} metalness={0.12} />
      </mesh>
      <mesh position={[side === 'left' ? 0.92 : -0.92, 2.5, 0.21]}>
        <boxGeometry args={[0.07, 0.62, 0.08]} />
        <meshStandardMaterial color="#49aaa6" emissive="#237a78" emissiveIntensity={0.15} metalness={0.7} roughness={0.22} />
      </mesh>
      <Text position={[0, 3.1, 0.17]} fontSize={0.22} color="#284746" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        773 LABS
      </Text>
      <Text position={[0, 2.72, 0.17]} fontSize={0.1} color="#3c6f6d" anchorX="center" anchorY="middle" letterSpacing={0.2}>
        LAB 01  ·  PRINT STUDIO
      </Text>
    </group>
  )
}

/* ------------------------------------------------------------------ page -- */

export default function LabExperience() {
  const journey = useRef(null)
  const stage = useRef(null)
  const progress = useRef(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (!journey.current || !stage.current) return
      const rect = journey.current.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const value = reducedMotion.matches ? 1 : THREE.MathUtils.clamp(-rect.top / distance, 0, 1)
      progress.current = value
      stage.current.style.setProperty('--intro-opacity', String(Math.max(0, 1 - value / 0.2)))
      stage.current.style.setProperty('--arrival-opacity', String(THREE.MathUtils.clamp((value - 0.86) / 0.12, 0, 1)))
      stage.current.classList.toggle('is-open', value > 0.6)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    reducedMotion.addEventListener?.('change', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      reducedMotion.removeEventListener?.('change', update)
    }
  }, [])

  return (
    <section className="lab-journey" ref={journey} aria-label="Enter the 773 Labs print studio">
      <div className="lab-stage" ref={stage}>
        <Canvas
          className="lab-canvas"
          dpr={[1, 1.4]}
          camera={{ position: [0, 2.75, START_Z], fov: 49, near: 0.1, far: 80 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          aria-hidden="true"
        >
          <LabRoom progress={progress} />
        </Canvas>
        <div className="lab-vignette" aria-hidden="true" />
        <div className="lab-intro">
          <div className="lab-kicker"><span /> 3D print lab · 773 Labs</div>
          <h1>Step inside.<br /><em>Ideas take shape here.</em></h1>
          <p>From the first layer to the finished piece, every great object starts with a little curiosity.</p>
          <div className="lab-scroll-prompt"><span className="scroll-wheel" /> Scroll to open the lab</div>
        </div>
        <div className="lab-arrival">
          <span className="lab-live"><i /> YOU’RE IN THE LAB</span>
          <h2>A whole world,<br />built one layer at a time.</h2>
          <p>Explore {PRODUCTS.length} designs across miniatures, props, useful parts, home objects, and more.</p>
        </div>
        <div className="lab-corner-mark" aria-hidden="true">773 <span>·</span> PRINT STUDIO</div>
        <div className="lab-hint" aria-hidden="true">Hover a card · click to open its spec</div>
      </div>

      <nav className="lab-index" aria-label="Product index">
        <h2>Design library</h2>
        <ul>
          {PRODUCTS.map((product) => (
            <li key={product.id}>
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
