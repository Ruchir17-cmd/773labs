import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Link, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { PRODUCTS } from '../data/products.js'

/* ------------------------------------------------------------------ plan -- */

const HALL_HALF = 6.0
const HALL_HEIGHT = 6.6
const HALL_NEAR = 7.0
const HALL_FAR = -52
const HALL_MID = (HALL_NEAR + HALL_FAR) / 2
const HALL_LENGTH = HALL_NEAR - HALL_FAR
const GLASS_HALF = 1.3

const DOOR_Z = 5.88
const START_Z = 11.6
const END_Z = -44
const LOOK_Y = 2.98

const LEDGE_Y = 1.16
const DISPLAY_START_Z = 2.6
const DISPLAY_END_Z = -42
const GROUP_GAP = 2.8
const WALL_SCALE = 1.42

const CARD_ROW_X = 3.05
const CARD_W = 1.24
const CARD_H = 1.78
const CARD_START_Z = 4.4
const TABLE_TOP = 1.74
const TABLE_FROM_Z = 6.4
const TABLE_TO_Z = -45.5
const TABLE_W = 1.7

/* Cards alternate between the two tables, so spacing is derived from the run
   itself. A fixed step would silently push the last card off the end of the
   hall as soon as the catalog grows. */
const ROW_SLOTS = Math.ceil(PRODUCTS.length / 2)
const CARD_MARGIN = 0.9
const CARD_STEP = (CARD_START_Z - (TABLE_TO_Z + CARD_MARGIN)) / Math.max(1, ROW_SLOTS - 1)

const BAY_Z = [3.4, -6.4, -16.2, -26, -35.8, -44.6]
const BEAM_Z = Array.from({ length: 18 }, (_, i) => 5.4 - i * 3.35)
const PENDANT_Z = Array.from({ length: 10 }, (_, i) => 3.6 - i * 5.1)
const CHEVRON_Z = Array.from({ length: 9 }, (_, i) => 2 - i * 6.4)

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

/* Every product gets a slot on one of the two display tables. */
const SLOTS = PRODUCTS.map((product, index) => ({
  product,
  order: index + 1,
  side: index % 2 === 0 ? -1 : 1,
  z: CARD_START_Z - Math.floor(index / 2) * CARD_STEP,
}))

/* …and every category gets a floating header over the table where it starts. */
const HEADERS = SLOTS
  .filter((slot, index) => index === 0 || SLOTS[index - 1].product.category !== slot.product.category)
  .map((slot) => ({
    ...slot,
    count: PRODUCTS.filter((product) => product.category === slot.product.category).length,
  }))

function smoothstep(from, to, value) {
  const t = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1)
  return t * t * (3 - 2 * t)
}

/* ------------------------------------------------------------- spotlight -- */

/**
 * Bridges the 3D catalog to a real HTML card. Deliberately imperative: a single
 * hover must never re-render the whole scene.
 */
function useSpotlight() {
  const root = useRef(null)
  const index = useRef(null)
  const name = useRef(null)
  const meta = useRef(null)
  const price = useRef(null)
  const link = useRef(null)
  const hover = useRef({ active: false, target: new THREE.Vector3() })
  const navigate = useNavigate()

  const enter = useCallback((product, order, event) => {
    const element = root.current
    if (!element) return

    const anchor = new THREE.Vector3()
    event.object.getWorldPosition(anchor)
    hover.current.active = true
    hover.current.target.copy(anchor)

    if (index.current) index.current.textContent = String(order).padStart(2, '0')
    if (name.current) name.current.textContent = product.name
    if (meta.current) {
      meta.current.textContent = `${product.category} · ${product.material} · ${product.layerHeight}`
    }
    if (price.current) price.current.textContent = product.price
    if (link.current) link.current.setAttribute('href', `/product/${product.id}`)
    element.style.setProperty('--accent', SHELF_COLORS[product.category] || '#8be1d5')
    element.dataset.on = 'on'

    const source = event.nativeEvent || event
    const width = element.offsetWidth || 280
    const height = element.offsetHeight || 190
    const left = THREE.MathUtils.clamp((source.clientX || 0) + 38, 16, window.innerWidth - width - 16)
    const top = THREE.MathUtils.clamp((source.clientY || 0) - height * 0.5, 16, window.innerHeight - height - 16)
    element.style.transform = `translate3d(${left}px, ${top}px, 0)`
  }, [])

  const leave = useCallback(() => {
    if (root.current) root.current.dataset.on = 'off'
    hover.current.active = false
  }, [])

  return { hover, enter, leave, index, name, meta, price, link, navigate }
}

/* ----------------------------------------------------------------- scene -- */

function LabRoom({ progress, spotlight }) {
  const leftDoor = useRef()
  const rightDoor = useRef()
  const light = useRef()
  const follow = useRef()
  const cameraGoal = useMemo(() => new THREE.Vector3(), [])
  const lookGoal = useMemo(() => new THREE.Vector3(0, LOOK_Y, DOOR_Z), [])

  useFrame(({ camera }, delta) => {
    const amount = progress.current
    const open = smoothstep(0.02, 0.26, amount)
    const travel = smoothstep(0.26, 1, amount)
    const enter = smoothstep(0.26, 0.62, amount)
    const glide = Math.sin(travel * Math.PI)

    if (leftDoor.current && rightDoor.current) {
      leftDoor.current.position.x = THREE.MathUtils.damp(leftDoor.current.position.x, -1.7 - open * 2.5, 5, delta)
      rightDoor.current.position.x = THREE.MathUtils.damp(rightDoor.current.position.x, 1.7 + open * 2.5, 5, delta)
    }

    cameraGoal.set(glide * 0.18, LOOK_Y - 0.26 + enter * 0.26, THREE.MathUtils.lerp(START_Z, END_Z, travel))
    camera.position.lerp(cameraGoal, 1 - Math.exp(-delta * 2.4))
    lookGoal.set(0, LOOK_Y - 0.3 + enter * 0.2, THREE.MathUtils.lerp(DOOR_Z, HALL_FAR, enter))
    camera.lookAt(lookGoal)

    if (light.current) light.current.intensity = 1.1 + enter * 1.6

    /* One shared lamp that hops to whatever card you are pointing at. */
    if (follow.current) {
      follow.current.position.lerp(spotlight.hover.current.target, 1 - Math.exp(-delta * 12))
      follow.current.intensity = THREE.MathUtils.damp(
        follow.current.intensity,
        spotlight.hover.current.active ? 5.2 : 0,
        9,
        delta,
      )
    }
  })

  return (
    <>
      <color attach="background" args={['#0f1e24']} />
      <fog attach="fog" args={['#0f1e24', 18, 80]} />
      <ambientLight intensity={0.85} color="#e8d5c0" />
      <directionalLight position={[-4, 8, 6]} intensity={1.4} color="#f5e8d0" />
      <pointLight ref={light} position={[0, 5.4, -1.5]} intensity={1.2} distance={22} color="#d4c4a8" />
      <pointLight ref={follow} position={[0, TABLE_TOP + 0.8, 0]} intensity={0} distance={5} color="#ffe8c0" />
      <pointLight position={[-3, 3, -10]} intensity={10} distance={14} color="#e8a060" />
      <pointLight position={[3, 3, -20]} intensity={10} distance={14} color="#e8a060" />
      <pointLight position={[-3, 3, -30]} intensity={10} distance={14} color="#e8a060" />
      <pointLight position={[3, 3, -40]} intensity={10} distance={14} color="#e8a060" />
      <pointLight position={[0, 4, -44]} intensity={14} distance={16} color="#ffb060" />
      <pointLight position={[-2, 2.5, -42]} intensity={8} distance={10} color="#ffc080" />
      <pointLight position={[2, 2.5, -44]} intensity={8} distance={10} color="#ffc080" />

      <Hallway />
      <FestoonLights />
      <DustParticles />
      <HangingPlants />
      <WallArt />
      <ActivePrinter position={[-2.6, 1.1, -47.6]} scale={1.05} />
      <ActivePrinter position={[0.3, 1.1, -47.6]} scale={1.05} />
      <Showcase x={-1.15} z={-47.6} width={6.6} height={2.5} depth={1.5} base={1.1} />

      {/* The catalog, arranged along both walls of the hall. */}
      <WallDisplay side="left" groups={LEFT_GROUPS} scale={WALL_SCALE} spotlight={spotlight} />
      <WallDisplay side="right" groups={RIGHT_GROUPS} scale={WALL_SCALE - 0.12} spotlight={spotlight} />

      {/* Every design also stands on the tables as an upright, clickable card. */}
      <DisplayTables />
      <FloorCards spotlight={spotlight} />

      <Printer side="right" z={-43.5} />
      <Workbench side="left" z={-45} />
      <SpoolTower side="right" z={-46.4} />
      <OrderDesk />

      <group ref={leftDoor} position={[-1.7, 0, DOOR_Z]}>
        <DoorPanel side="left" />
      </group>
      <group ref={rightDoor} position={[1.7, 0, DOOR_Z]}>
        <DoorPanel side="right" />
      </group>
    </>
  )
}

/* ----------------------------------------------------------------- shell -- */

function Hallway() {
  const ceilingWidth = HALL_HALF - GLASS_HALF

  return (
    <group>
      {/* Deck */}
      <mesh position={[0, -0.15, HALL_MID]} receiveShadow>
        <boxGeometry args={[(HALL_HALF + 0.3) * 2, 0.3, HALL_LENGTH + 0.4]} />
        <meshStandardMaterial color="#79867f" roughness={0.8} metalness={0.08} />
      </mesh>
      {/* A soft sheen along the walking line keeps the long run from reading flat. */}
      <mesh position={[0, 0.004, HALL_MID]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, HALL_LENGTH - 2]} />
        <meshBasicMaterial color="#f0d8a8" transparent opacity={0.05} depthWrite={false} />
      </mesh>

      {/* Ceiling: two solid decks either side of a lit skylight slot. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (GLASS_HALF + ceilingWidth / 2), HALL_HEIGHT + 0.15, HALL_MID]}>
          <boxGeometry args={[ceilingWidth, 0.3, HALL_LENGTH + 0.4]} />
          <meshStandardMaterial color="#dbe5df" roughness={0.92} />
        </mesh>
      ))}
      <mesh position={[0, HALL_HEIGHT + 0.22, HALL_MID]}>
        <boxGeometry args={[GLASS_HALF * 2, 0.08, HALL_LENGTH + 0.4]} />
        <meshStandardMaterial color="#f0e8d8" emissive="#d4c090" emissiveIntensity={1.2} roughness={0.4} />
      </mesh>

      {/* The two long walls: painted block, service rail, glowing guide line. */}
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
            <meshStandardMaterial color="#c89050" emissive="#a07030" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[side * (HALL_HALF - 0.22), HALL_HEIGHT - 0.62, HALL_MID]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, HALL_LENGTH - 0.6, 8]} />
            <meshStandardMaterial color="#8a9a94" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Upper wall wash above the displays. */}
          <mesh position={[side * (HALL_HALF - 0.06), 3.5, HALL_MID]}>
            <boxGeometry args={[0.04, 0.06, HALL_LENGTH - 1.2]} />
            <meshStandardMaterial color="#c89050" emissive="#a07030" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Far end wall: the vanishing point of the whole hall. */}
      <mesh position={[0, HALL_HEIGHT / 2, HALL_FAR - 0.2]}>
        <boxGeometry args={[(HALL_HALF + 0.3) * 2, HALL_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#a9bab3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.9, HALL_FAR + 0.05]}>
        <boxGeometry args={[7.2, 3.6, 0.08]} />
        <meshStandardMaterial color="#152b2f" roughness={0.55} />
      </mesh>
      <mesh position={[0, 3.9, HALL_FAR + 0.11]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.72, 0.075, 10, 44]} />
        <meshStandardMaterial color="#8be1d5" emissive="#55c1b5" emissiveIntensity={1.1} metalness={0.4} roughness={0.3} />
      </mesh>
      <Text position={[0, 4.62, HALL_FAR + 0.13]} fontSize={0.7} color="#d9f6f0" anchorX="center" anchorY="middle" letterSpacing={0.18}>
        773 LABS
      </Text>
      <Text position={[0, 3.5, HALL_FAR + 0.13]} fontSize={0.17} color="#8fe0d5" anchorX="center" anchorY="middle" letterSpacing={0.22}>
        DESIGN LIBRARY · {PRODUCTS.length} PRINTED OBJECTS
      </Text>
      <mesh position={[0, 3.14, HALL_FAR + 0.1]}>
        <boxGeometry args={[6.6, 0.05, 0.04]} />
        <meshStandardMaterial color="#8be1d5" emissive="#55c1b5" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, 3.8, HALL_FAR + 2.2]} intensity={30} distance={14} color="#e8c890" />

      {/* Ceiling beams and task lighting repeat into the distance. */}
      {BEAM_Z.map((z, i) => (
        <group key={z}>
          <mesh position={[0, HALL_HEIGHT - 0.11, z]}>
            <boxGeometry args={[HALL_HALF * 2, 0.22, 0.24]} />
            <meshStandardMaterial color="#a6b7b0" roughness={0.72} metalness={0.2} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 2.1, HALL_HEIGHT - 0.3, z]}>
              <boxGeometry args={[1.5, 0.06, 0.16]} />
              <meshStandardMaterial color="#fff8e8" emissive="#e0c890" emissiveIntensity={1.85} />
            </mesh>
          ))}
          {i % 4 === 0 && (
            <pointLight position={[0, HALL_HEIGHT - 0.9, z]} intensity={16} distance={11} color="#e8d0a0" />
          )}
        </group>
      ))}

      {/* Pendant lamps wash the display ledges along both walls. */}
      {PENDANT_Z.map((z, i) => [-1, 1].map((side) => (
        <group key={`${z}-${side}`} position={[side * 4.5, 0, z]}>
          <mesh position={[0, 5.06, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.96, 6]} />
            <meshStandardMaterial color="#3d4c48" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.66, 0]}>
            <coneGeometry args={[0.36, 0.42, 14, 1, true]} />
            <meshStandardMaterial color="#637975" metalness={0.55} roughness={0.34} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 4.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.32, 14]} />
            <meshStandardMaterial color="#fff8e8" emissive="#e8d0a0" emissiveIntensity={1.5} side={THREE.DoubleSide} />
          </mesh>
          {i % 5 === 1 && <pointLight position={[0, 4.3, 0]} intensity={11} distance={7.5} color="#e8c890" />}
        </group>
      )))}

      {/* Structural bays: hanging piers, an arch beam and a shaft of skylight. */}
      {BAY_Z.map((z, i) => (
        <Bay key={z} z={z} index={i} />
      ))}

      {/* Floor guides lead the visitor deep into the workspace. */}
      {[-4.0, 4.0].map((x) => (
        <mesh key={x} position={[x, 0.014, HALL_MID]}>
          <boxGeometry args={[0.05, 0.02, HALL_LENGTH - 1]} />
          <meshStandardMaterial color="#c89050" emissive="#a07030" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {CHEVRON_Z.map((z) => (
        <group key={z} position={[0, 0.024, z]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.26, 0, 0]} rotation={[0, side * 0.62, 0]}>
              <boxGeometry args={[0.055, 0.02, 0.86]} />
              <meshStandardMaterial color="#c89050" emissive="#a07030" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Threshold marking and entry signage just inside the doors. */}
      <mesh position={[0, 0.02, DOOR_Z + 0.55]}>
        <boxGeometry args={[6.4, 0.035, 1.5]} />
        <meshStandardMaterial color="#c89050" emissive="#c89050" emissiveIntensity={0.45} />
      </mesh>
      <WallSign side="left" z={4.1} y={3.5} title="LAB 01" sub="PRINT STUDIO" width={3.1} height={1.25} titleSize={0.38} />
      <WallSign
        side="right"
        z={4.2}
        y={3.5}
        title="OPEN FLOOR"
        sub={`${PRODUCTS.length} DESIGNS ON DISPLAY`}
        width={2.4}
        height={1.05}
        titleSize={0.22}
      />
    </group>
  )
}

function DustParticles() {
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * HALL_HALF * 2
      pos[i * 3 + 1] = Math.random() * HALL_HEIGHT
      pos[i * 3 + 2] = HALL_NEAR - Math.random() * HALL_LENGTH
    }
    return pos
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a8ece0" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function HangingPlants() {
  const plants = useMemo(() => {
    const items = []
    for (let i = 0; i < 12; i++) {
      const side = i % 2 === 0 ? -1 : 1
      items.push({
        x: side * (4.1 + Math.random() * 0.9),
        z: 4 - i * 4.6,
        scale: 0.7 + Math.random() * 0.5,
      })
    }
    return items
  }, [])

  return (
    <group>
      {plants.map((plant, i) => (
        <group key={i} position={[plant.x, HALL_HEIGHT - 0.5, plant.z]} scale={plant.scale}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 4]} />
            <meshStandardMaterial color="#3d4c48" />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <coneGeometry args={[0.22, 0.5, 6]} />
            <meshStandardMaterial color="#4a7c5c" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <sphereGeometry args={[0.16, 6, 5]} />
            <meshStandardMaterial color="#5a9c6c" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WallArt() {
  const artPieces = useMemo(() => {
    const colors = Object.values(SHELF_COLORS)
    return Array.from({ length: 8 }, (_, i) => ({
      x: (i % 2 === 0 ? -1 : 1) * (HALL_HALF - 0.08),
      y: 4.7 + (i % 3) * 0.36,
      z: -i * 6.2,
      w: 0.8 + (i % 3) * 0.3,
      h: 0.6 + (i % 2) * 0.4,
      color: colors[i % colors.length],
    }))
  }, [])

  return (
    <group>
      {artPieces.map((art, i) => (
        <group key={i} position={[art.x, art.y, art.z]} rotation={[0, art.x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[art.w, art.h]} />
            <meshStandardMaterial color={art.color} roughness={0.6} metalness={0.1} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[art.w * 0.7, art.h * 0.6]} />
            <meshStandardMaterial color="#16292c" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ActivePrinter({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const printHead = useRef()
  const gantry = useRef()
  const printedObject = useRef()
  const led = useRef()
  const spool = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (printHead.current) printHead.current.position.x = Math.sin(t * 2.2) * 0.32
    if (gantry.current) gantry.current.position.y = 1.35 + ((t * 0.018) % 0.7)
    if (printedObject.current) {
      const p = (t * 0.04) % 1
      printedObject.current.scale.y = 0.08 + p * 0.92
    }
    if (led.current) led.current.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.5
    if (spool.current) spool.current.rotation.x = t * 0.4
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group position={[0, 0, 0.95]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[1.2, 0.3, 1.0]} />
          <meshStandardMaterial color="#2a3a35" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.8, 0.04, 0.7]} />
          <meshStandardMaterial color="#1a2a25" metalness={0.6} roughness={0.3} />
        </mesh>
        {[[-0.5, -0.4], [0.5, -0.4], [-0.5, 0.4], [0.5, 0.4]].map(([x, zz], i) => (
          <mesh key={i} position={[x, 1.0, zz]}>
            <boxGeometry args={[0.06, 1.7, 0.06]} />
            <meshStandardMaterial color="#3d4c48" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 1.85, 0]}>
          <boxGeometry args={[1.1, 0.06, 0.9]} />
          <meshStandardMaterial color="#3d4c48" metalness={0.7} roughness={0.3} />
        </mesh>
        <group ref={gantry} position={[0, 1.35, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.05, 0.05]} />
            <meshStandardMaterial color="#4a5c55" metalness={0.6} roughness={0.35} />
          </mesh>
          <group ref={printHead}>
            <mesh>
              <boxGeometry args={[0.12, 0.15, 0.12]} />
              <meshStandardMaterial color="#e7c58d" metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <coneGeometry args={[0.03, 0.06, 6]} />
              <meshStandardMaterial color="#c4a875" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        </group>
        <group ref={printedObject} position={[0, 0.34, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.18, 0.4, 8]} />
            <meshStandardMaterial color="#d0a451" roughness={0.5} />
          </mesh>
        </group>
        <group position={[0, 2.0, 0]}>
          <mesh ref={spool} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#d87963" roughness={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
            <meshStandardMaterial color="#3d4c48" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
        <mesh position={[0, 0.5, 0.51]}>
          <boxGeometry args={[0.4, 0.2, 0.02]} />
          <meshStandardMaterial color="#16292c" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0.52]}>
          <planeGeometry args={[0.35, 0.15]} />
          <meshStandardMaterial color="#70d5cc" emissive="#53c2b9" emissiveIntensity={0.6} />
        </mesh>
        <mesh ref={led} position={[0.45, 0.5, 0.51]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#78d3ad" emissive="#78d3ad" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 1.2, 0.3]} intensity={4} distance={4} color="#ffb060" />
      </group>
      <mesh position={[0, 0.15, 0.02]}>
        <boxGeometry args={[1.4, 0.25, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text position={[0, 0.15, 0.06]} fontSize={0.1} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.14}>
        PRINTING NOW
      </Text>
    </group>
  )
}

/* A glass vitrine over the printers — thin frame, faint panes, warm LED strip. */
function Showcase({ x, z, width, height, depth, base }) {
  const glow = useRef()
  const bulb = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (glow.current) glow.current.emissiveIntensity = 0.75 + Math.sin(t * 1.7) * 0.12
    if (bulb.current) bulb.current.rotation.y = t * 0.55
  })

  const mid = base + height / 2
  const half = width / 2
  const post = 0.05

  return (
    <group position={[x, 0, z]}>
      {/* Corner posts + top/bottom rails read as a frame without hiding anything. */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * half, mid, sz * (depth / 2)]}>
          <boxGeometry args={[post, height, post]} />
          <meshStandardMaterial color="#4a5c55" metalness={0.72} roughness={0.28} />
        </mesh>
      ))}
      {[base + 0.04, base + height - 0.04].map((y) => (
        <group key={y}>
          {[-1, 1].map((sz) => (
            <mesh key={sz} position={[0, y, sz * (depth / 2)]}>
              <boxGeometry args={[width, post, post]} />
              <meshStandardMaterial color="#4a5c55" metalness={0.72} roughness={0.28} />
            </mesh>
          ))}
          {[-1, 1].map((sx) => (
            <mesh key={sx} position={[sx * half, y, 0]}>
              <boxGeometry args={[post, post, depth]} />
              <meshStandardMaterial color="#4a5c55" metalness={0.72} roughness={0.28} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Faint panes: present but never in the way. Deliberately not using
          `transmission` — it forces an extra render pass every frame. */}
      {[-1, 1].map((sz) => (
        <mesh key={`pane-${sz}`} position={[0, mid, sz * (depth / 2)]}>
          <planeGeometry args={[width, height]} />
          <meshPhysicalMaterial
            color="#d6efe8"
            transparent
            opacity={0.09}
            roughness={0.06}
            metalness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Warm LED strip tucked under the top rail. */}
      <mesh position={[0, base + height - 0.09, depth / 2 - 0.06]}>
        <boxGeometry args={[width - 0.2, 0.035, 0.035]} />
        <meshStandardMaterial ref={glow} color="#ffcf9a" emissive="#ffb060" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <pointLight position={[0, base + height - 0.2, 0]} intensity={7} distance={5.5} color="#ffbb70" />

      {/* Slow-turning hologram puck on the roof of the case. */}
      <mesh ref={bulb} position={[0, base + height + 0.14, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 20]} />
        <meshStandardMaterial color="#16292c" emissive="#8fe0d5" emissiveIntensity={1.1} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

/* Warm festoon lighting strung under the ceiling beams. */
function FestoonLights() {
  const bulb = useRef()

  useFrame((state) => {
    if (bulb.current) bulb.current.emissiveIntensity = 1.15 + Math.sin(state.clock.elapsedTime * 0.9) * 0.22
  })

  const strands = [-1, 1]
  const from = 4.2
  const to = HALL_FAR + 4
  const count = 13

  return (
    <group>
      {strands.map((side) => (
        <group key={side} position={[side * 4.95, 0, 0]}>
          {/* Wire */}
          <mesh position={[0, 5.34, (from + to) / 2]}>
            <boxGeometry args={[0.022, 0.022, from - to]} />
            <meshStandardMaterial color="#2b3a37" roughness={0.8} />
          </mesh>
          {Array.from({ length: count }, (_, i) => {
            const z = from - (i * (from - to)) / (count - 1)
            /* Slight sag so the strand reads as hanging, not ruled. */
            const sag = Math.sin((i / (count - 1)) * Math.PI * 6) * 0.06
            return (
              <group key={i} position={[0, 5.2 + sag, z]}>
                <mesh position={[0, 0.06, 0]}>
                  <boxGeometry args={[0.016, 0.12, 0.016]} />
                  <meshStandardMaterial color="#2b3a37" roughness={0.8} />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.055, 10, 8]} />
                  {i === 0 ? (
                    <meshStandardMaterial ref={bulb} color="#ffe6bd" emissive="#ffb060" emissiveIntensity={1.2} toneMapped={false} />
                  ) : (
                    <meshStandardMaterial color="#ffe6bd" emissive="#ffb060" emissiveIntensity={1.2} toneMapped={false} />
                  )}
                </mesh>
              </group>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function Bay({ z, index }) {
  const pierBase = 3.5
  const pierHeight = HALL_HEIGHT - pierBase

  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (HALL_HALF - 0.32), pierBase + pierHeight / 2, 0]}>
          <boxGeometry args={[0.46, pierHeight, 0.5]} />
          <meshStandardMaterial color="#93a6a0" roughness={0.66} metalness={0.28} />
        </mesh>
      ))}
      <mesh position={[0, HALL_HEIGHT - 0.42, 0]}>
        <boxGeometry args={[HALL_HALF * 2, 0.52, 0.5]} />
        <meshStandardMaterial color="#8ea29c" roughness={0.64} metalness={0.3} />
      </mesh>
      <mesh position={[0, HALL_HEIGHT - 0.72, 0]}>
        <boxGeometry args={[HALL_HALF * 2 - 1.4, 0.06, 0.16]} />
        <meshStandardMaterial color="#8be1d5" emissive="#55c1b5" emissiveIntensity={1.1} />
      </mesh>
      <group position={[0, HALL_HEIGHT - 1.22, 0.12]}>
        <mesh>
          <boxGeometry args={[2.6, 0.56, 0.06]} />
          <meshStandardMaterial color="#1d3232" roughness={0.6} />
        </mesh>
        <Text position={[0, 0, 0.05]} fontSize={0.15} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.2}>
          {`BAY ${String(index + 1).padStart(2, '0')}`}
        </Text>
      </group>
      {/* Skylight shaft — pure atmosphere, no shadow cost. */}
      <mesh position={[0, HALL_HEIGHT - 1.9, 0]}>
        <coneGeometry args={[2.2, 3.2, 20, 1, true]} />
        <meshBasicMaterial
          color="#a8ece0"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function WallSign({ side, z, y, title, sub, width, height, titleSize }) {
  return (
    <group position={[side * (HALL_HALF - 0.07), y, z]} rotation={[0, side === 'left' ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text position={[0, height * 0.2, 0.06]} fontSize={titleSize} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.14}>
        {title}
      </Text>
      <Text position={[0, -height * 0.2, 0.06]} fontSize={titleSize * 0.36} color="#6fb7b0" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        {sub}
      </Text>
    </group>
  )
}

function Facade() {
  return (
    <group>
      {/* Ground outside so the approach never floats in the void. */}
      <mesh position={[0, -0.16, 9.2]} receiveShadow>
        <boxGeometry args={[18, 0.32, 6.4]} />
        <meshStandardMaterial color="#4c5754" roughness={0.92} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (HALL_HALF - 0.62), 2.8, DOOR_Z - 0.26]}>
          <boxGeometry args={[1.24, 5.6, 0.5]} />
          <meshStandardMaterial color="#bccbc4" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 5.44, DOOR_Z - 0.26]}>
        <boxGeometry args={[HALL_HALF * 2, 0.32, 0.5]} />
        <meshStandardMaterial color="#bccbc4" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.02, DOOR_Z + 0.9]}>
        <boxGeometry args={[8.2, 0.03, 1.9]} />
        <meshStandardMaterial color="#4f8f8a" emissive="#c89050" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function DoorFrame() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.7, 2.7, DOOR_Z - 0.26]}>
          <boxGeometry args={[0.3, 5.6, 0.55]} />
          <meshStandardMaterial color="#637975" metalness={0.58} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[0, 5.42, DOOR_Z - 0.26]}>
        <boxGeometry args={[7.7, 0.28, 0.55]} />
        <meshStandardMaterial color="#637975" metalness={0.58} roughness={0.32} />
      </mesh>
    </group>
  )
}

/* --------------------------------------------------------------- catalog -- */

function WallDisplay({ side, groups, scale, spotlight }) {
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
    let order = 0

    groups.forEach((group, index) => {
      const slots = group.map((product) => {
        order += 1
        const slot = { product, z: cursor, order }
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
      {/* Individual backlights behind each sample, so the shelf never goes murky. */}
      {layout.map((group) => group.slots.map((slot) => (
        <mesh key={`light-${slot.product.id}`} position={[toLocal(slot.z), LEDGE_Y + 0.62, 0.13]}>
          <planeGeometry args={[0.86, 0.86]} />
          <meshBasicMaterial
            color={SHELF_COLORS[group.name] || '#8be1d5'}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )))}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[toLocal(DISPLAY_START_Z + 0.7 - i * 2.2), LEDGE_Y - 0.26, 0.5]}>
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
              position={[mid, 3.06, 0.12]}
              fontSize={0.34}
              color="#4c7d78"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.12}
              maxWidth={length * 0.88}
              lineHeight={1.1}
              textAlign="center"
            >
              {group.name.toUpperCase()}
            </Text>
            <mesh position={[mid, 2.62, 0.12]}>
              <boxGeometry args={[length, 0.035, 0.03]} />
              <meshStandardMaterial color="#7fbfb6" emissive="#4fb0a8" emissiveIntensity={0.4} />
            </mesh>
            <Text position={[mid, 2.4, 0.12]} fontSize={0.12} color="#7ba39e" anchorX="center" anchorY="middle" letterSpacing={0.2}>
              {String(group.count).padStart(2, '0')} DESIGNS
            </Text>
            {group.slots.map((slot) => (
              <DisplayItem
                key={slot.product.id}
                product={slot.product}
                order={slot.order}
                x={toLocal(slot.z)}
                scale={scale}
                spotlight={spotlight}
              />
            ))}
          </group>
        )
      })}
    </group>
  )
}

function DisplayItem({ product, order, x, scale, spotlight }) {
  const material = MATERIALS[product.category] || MATERIALS['Home & Decor']
  const accent = SHELF_COLORS[product.category] || '#8be1d5'
  const [hovered, setHovered] = useState(false)
  const mix = useRef(0)
  const root = useRef()

  useFrame((_, delta) => {
    mix.current = THREE.MathUtils.damp(mix.current, hovered ? 1 : 0, 10, delta)
    if (!root.current) return
    root.current.position.z = 0.44 + mix.current * 0.26
    root.current.scale.setScalar(scale * (1 + mix.current * 0.14))
  })

  const enter = (event) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
    spotlight.enter(product, order, event)
  }

  return (
    <group ref={root} position={[x, LEDGE_Y + 0.07, 0.44]} scale={scale}>
      <Artifact icon={product.icon} material={material} />
      {/* Catalogue plinth, lit from the front. */}
      <mesh position={[0, 0.055, 0.02]}>
        <boxGeometry args={[0.66, 0.02, 0.42]} />
        <meshStandardMaterial color="#f4f7f2" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.075, -0.2]}>
        <boxGeometry args={[0.72, 0.06, 0.06]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={hovered ? 1.2 : 0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh
        position={[0, 0.42, 0.3]}
        onPointerOver={enter}
        onPointerOut={(event) => {
          event.stopPropagation()
          setHovered(false)
          document.body.style.cursor = ''
          spotlight.leave()
        }}
        onClick={(event) => {
          event.stopPropagation()
          spotlight.navigate(`/product/${product.id}`)
        }}
      >
        <planeGeometry args={[1.3, 1.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
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

/* -------------------------------------------------------- display tables -- */

function DisplayTables() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <DisplayTable key={side} side={side} />
      ))}
      {HEADERS.map((header) => (
        <CategoryHeader key={header.product.category} header={header} />
      ))}
    </group>
  )
}

function DisplayTable({ side }) {
  const x = side * CARD_ROW_X
  const length = TABLE_FROM_Z - TABLE_TO_Z
  const midZ = (TABLE_FROM_Z + TABLE_TO_Z) / 2
  const legs = Array.from({ length: 9 }, (_, i) => TABLE_FROM_Z - 0.9 - i * ((length - 1.8) / 8))

  return (
    <group>
      <mesh position={[x, TABLE_TOP - 0.04, midZ]}>
        <boxGeometry args={[TABLE_W, 0.08, length]} />
        <meshStandardMaterial color="#e2eae4" roughness={0.3} metalness={0.42} />
      </mesh>
      <mesh position={[x, TABLE_TOP - 0.16, midZ]}>
        <boxGeometry args={[TABLE_W - 0.1, 0.16, length - 0.1]} />
        <meshStandardMaterial color="#5d6f6a" roughness={0.6} metalness={0.24} />
      </mesh>
      <mesh position={[x, TABLE_TOP + 0.006, midZ]}>
        <boxGeometry args={[TABLE_W - 0.06, 0.012, length - 0.3]} />
        <meshStandardMaterial color="#8be1d5" emissive="#4fb0a8" emissiveIntensity={0.24} />
      </mesh>
      <mesh position={[x, 0.52, midZ]}>
        <boxGeometry args={[TABLE_W - 0.26, 0.06, length - 0.6]} />
        <meshStandardMaterial color="#8d9d97" roughness={0.7} metalness={0.16} />
      </mesh>
      {legs.map((z) => (
        <group key={z} position={[x, 0, z]}>
          {[-0.68, 0.68].map((offset) => (
            <mesh key={offset} position={[offset, (TABLE_TOP - 0.24) / 2, 0]}>
              <boxGeometry args={[0.08, TABLE_TOP - 0.24, 0.08]} />
              <meshStandardMaterial color="#4f615d" metalness={0.66} roughness={0.34} />
            </mesh>
          ))}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[1.44, 0.05, 0.06]} />
            <meshStandardMaterial color="#4f615d" metalness={0.66} roughness={0.34} />
          </mesh>
        </group>
      ))}
      <mesh position={[x, TABLE_TOP - 0.16, TABLE_TO_Z - 0.56]}>
        <boxGeometry args={[TABLE_W - 0.1, 0.24, 0.05]} />
        <meshStandardMaterial color="#223634" roughness={0.6} />
      </mesh>
      <Text
        position={[x, TABLE_TOP - 0.16, TABLE_TO_Z - 0.53]}
        fontSize={0.07}
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

function CategoryHeader({ header }) {
  const accent = SHELF_COLORS[header.product.category] || '#8be1d5'
  const rotation = [-0.1, -header.side * 0.24, 0]

  return (
    <group position={[header.side * CARD_ROW_X, TABLE_TOP + 2.05, header.z]} rotation={rotation}>
      <mesh>
        <boxGeometry args={[2.3, 0.62, 0.06]} />
        <meshStandardMaterial color="#16292c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.26, 0.02]}>
        <boxGeometry args={[2.3, 0.06, 0.07]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} />
      </mesh>
      <Text
        position={[0, 0.04, 0.05]}
        fontSize={0.15}
        maxWidth={2.1}
        lineHeight={1.1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#e8fbf7"
        letterSpacing={0.1}
      >
        {header.product.category.toUpperCase()}
      </Text>
      <Text position={[0, -0.17, 0.05]} fontSize={0.07} color="#8fb8b3" anchorX="center" anchorY="middle" letterSpacing={0.24}>
        {String(header.count).padStart(2, '0')} DESIGNS
      </Text>
      {/* Two thin stems tie the header back down to the table top. */}
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, -1.18, -0.01]}>
          <boxGeometry args={[0.035, 1.74, 0.035]} />
          <meshStandardMaterial color="#3f5350" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------- cards -- */

function FloorCards({ spotlight }) {
  return (
    <group>
      {/* Pools of accent light on the deck beneath each run of cards. */}
      {HEADERS.map((header) => {
        const rows = SLOTS.filter((slot) => slot.product.category === header.product.category)
        const from = Math.max(...rows.map((slot) => slot.z)) + CARD_STEP * 0.5
        const to = Math.min(...rows.map((slot) => slot.z)) - CARD_STEP * 0.5
        return (
          <mesh
            key={`pool-${header.product.category}`}
            position={[header.side * CARD_ROW_X, 0.018, (from + to) / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.5, from - to]} />
            <meshBasicMaterial
              color={SHELF_COLORS[header.product.category] || '#8be1d5'}
              transparent
              opacity={0.09}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )
      })}
      {SLOTS.map((slot) => (
        <FloorCard key={slot.product.id} slot={slot} spotlight={spotlight} />
      ))}
    </group>
  )
}

function FloorCard({ slot, spotlight }) {
  const { product, side, z, order } = slot
  const material = MATERIALS[product.category] || MATERIALS['Home & Decor']
  const accent = SHELF_COLORS[product.category] || '#8be1d5'
  const [hovered, setHovered] = useState(false)
  const lift = useRef(0)
  const root = useRef()
  const yaw = useRef(0)

  useFrame((_, delta) => {
    lift.current = THREE.MathUtils.damp(lift.current, hovered ? 1 : 0, 9, delta)
    yaw.current = THREE.MathUtils.damp(yaw.current, hovered ? 0.62 : 1, 9, delta)
    if (!root.current) return
    root.current.position.y = TABLE_TOP + lift.current * 0.18
    root.current.scale.setScalar(1 + lift.current * 0.07)
    root.current.rotation.set(-0.16 - lift.current * 0.04, -side * 0.22 * yaw.current, 0)
  })

  const enter = (event) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
    spotlight.enter(product, order, event)
  }

  const leave = (event) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = ''
    spotlight.leave()
  }

  return (
    <group ref={root} position={[side * CARD_ROW_X, TABLE_TOP, z]} rotation={[-0.16, -side * 0.22, 0]}>
      {/* Light bleed behind the card so it reads as a lit panel. */}
      <mesh position={[0, CARD_H / 2, -0.12]}>
        <planeGeometry args={[CARD_W + 0.6, CARD_H + 0.6]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={hovered ? 0.3 : 0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, CARD_H / 2, 0]}>
        <boxGeometry args={[CARD_W, CARD_H, 0.05]} />
        <meshStandardMaterial color="#16292c" roughness={0.42} metalness={0.5} />
      </mesh>
      <mesh position={[0, CARD_H / 2, 0.014]}>
        <boxGeometry args={[CARD_W - 0.09, CARD_H - 0.09, 0.055]} />
        <meshStandardMaterial
          color="#f4f0e4"
          roughness={0.66}
          emissive={accent}
          emissiveIntensity={hovered ? 0.4 : 0.07}
        />
      </mesh>

      {/* Header band: catalogue number, category tick. */}
      <mesh position={[0, CARD_H - 0.17, 0.032]}>
        <boxGeometry args={[CARD_W - 0.09, 0.2, 0.06]} />
        <meshStandardMaterial color={accent} roughness={0.42} metalness={0.1} emissive={accent} emissiveIntensity={hovered ? 0.6 : 0.14} />
      </mesh>
      <Text position={[0, CARD_H - 0.17, 0.07]} fontSize={0.085} color="#fdfaf3" anchorX="center" anchorY="middle" letterSpacing={0.14}>
        {String(order).padStart(2, '0')}
      </Text>

      {/* Sample window. */}
      <mesh position={[0, 0.82, 0.03]}>
        <boxGeometry args={[CARD_W - 0.24, 0.82, 0.058]} />
        <meshStandardMaterial color="#e7e9de" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.19, 0.034]}>
        <boxGeometry args={[CARD_W - 0.24, 0.03, 0.06]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <group position={[0, 0.86, 0.07]} scale={hovered ? 0.66 : 0.6}>
        <Artifact icon={product.icon} material={material} />
      </group>

      <mesh position={[0, 0.4, 0.032]}>
        <boxGeometry args={[CARD_W - 0.28, 0.014, 0.06]} />
        <meshStandardMaterial color="#9fb6b1" roughness={0.6} />
      </mesh>
      <Text
        position={[0, 0.24, 0.05]}
        fontSize={0.088}
        maxWidth={CARD_W - 0.22}
        lineHeight={1.14}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#1b3436"
      >
        {product.name}
      </Text>
      <Text position={[0, 0.06, 0.05]} fontSize={0.048} maxWidth={CARD_W - 0.22} textAlign="center" anchorX="center" anchorY="middle" color="#5f817d" letterSpacing={0.1}>
        {`${product.material.toUpperCase()} · ${product.layerHeight}`}
      </Text>

      {/* Generous invisible hit area — nothing else in the scene eats clicks. */}
      <mesh
        position={[0, CARD_H / 2, 0.2]}
        onPointerOver={enter}
        onPointerOut={leave}
        onClick={(event) => {
          event.stopPropagation()
          spotlight.navigate(`/product/${product.id}`)
        }}
      >
        <planeGeometry args={[CARD_W + 0.5, CARD_H + 0.5]} />
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
          FDM · {String(Math.abs(z)).slice(0, 2)}
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
            <meshStandardMaterial color="#9eafaa" roughness={0.3} metalness={0.5} />
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

/* The walk has to end somewhere: a lit order desk under the big sign. */
function OrderDesk() {
  return (
    <group position={[0, 0, -47.6]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[8.6, 1, 1.05]} />
        <meshStandardMaterial color="#3a4b47" roughness={0.62} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.05, 0.02]}>
        <boxGeometry args={[9.0, 0.1, 1.3]} />
        <meshStandardMaterial color="#dbe6e0" roughness={0.28} metalness={0.44} />
      </mesh>
      <mesh position={[0, 0.09, 0.54]}>
        <boxGeometry args={[8.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#c89050" emissive="#c89050" emissiveIntensity={0.9} />
      </mesh>
      <Text position={[0, 0.56, 0.53]} fontSize={0.16} color="#9be3d8" anchorX="center" anchorY="middle" letterSpacing={0.26}>
        START A PRINT
      </Text>

      {/* Samples lined up on the counter. */}
      {[2.6, 3.0, 3.4].map((x, i) => (
        <mesh key={x} position={[x, 1.24, 0]} rotation={[0, i * 0.5, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={Object.values(SHELF_COLORS)[i % Object.values(SHELF_COLORS).length]}
            roughness={0.42}
            metalness={0.12}
          />
        </mesh>
      ))}
      <mesh position={[4.05, 1.4, 0]} rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[1.0, 0.58, 0.06]} />
        <meshStandardMaterial color="#d8e6df" emissive="#ffb060" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* Stools. */}
      {[-2.1, -0.7, 0.7, 2.1].map((x) => (
        <group key={x} position={[x, 0, 1.5]}>
          <mesh position={[0, 0.66, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.11, 14]} />
            <meshStandardMaterial color="#df886f" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.33, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.62, 8]} />
            <meshStandardMaterial color="#607672" metalness={0.7} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.05, 12]} />
            <meshStandardMaterial color="#607672" metalness={0.7} roughness={0.32} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 2.4, 1.4]} intensity={16} distance={8} color="#ffb060" />
    </group>
  )
}

/* ----------------------------------------------------------------- doors -- */

function DoorPanel({ side }) {
  return (
    <group>
      <mesh position={[0, 2.66, 0]}>
        <boxGeometry args={[3.4, 5.24, 0.24]} />
        <meshStandardMaterial color="#cadbd7" roughness={0.4} metalness={0.28} />
      </mesh>
      <mesh position={[0, 2.66, 0.132]}>
        <boxGeometry args={[3.1, 4.95, 0.028]} />
        <meshStandardMaterial color="#a9ceca" roughness={0.3} metalness={0.12} />
      </mesh>
      <mesh position={[side === 'left' ? 1.3 : -1.3, 2.5, 0.21]}>
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
  const spotlight = useSpotlight()

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (!journey.current || !stage.current) return
      const rect = journey.current.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const value = reducedMotion.matches ? 1 : THREE.MathUtils.clamp(-rect.top / distance, 0, 1)
      progress.current = value
      stage.current.style.setProperty('--intro-opacity', String(Math.max(0, 1 - value / 0.2)))
      stage.current.style.setProperty('--arrival-opacity', String(THREE.MathUtils.clamp((value - 0.9) / 0.1, 0, 1)))
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
          camera={{ position: [0, LOOK_Y - 0.26, START_Z], fov: 49, near: 0.1, far: 130 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          aria-hidden="true"
        >
          <LabRoom progress={progress} spotlight={spotlight} />
          <Facade />
          <DoorFrame />
        </Canvas>

        <div className="lab-vignette" aria-hidden="true" />

        <div className="lab-intro">
          <div className="lab-kicker"><span /> 3D print lab · 773 Labs</div>
          <h1>Step inside.<br /><em>Ideas take shape here.</em></h1>
          <p>From the first layer to the finished piece, every great object starts with a little curiosity.</p>
          <div className="lab-scroll-prompt"><span className="scroll-wheel" /> Scroll to walk the hall</div>
        </div>

        <div className="lab-arrival">
          <span className="lab-live"><i /> YOU’RE IN THE LAB</span>
          <h2>A whole world,<br />built one layer at a time.</h2>
          <p>
            {PRODUCTS.length} designs across {CATEGORY_ORDER.length} collections, lit along the walls and
            standing on the tables. Hover a card for its spec, click to open it.
          </p>
          <div className="lab-arrival-foot">
            <span>{CATEGORY_ORDER.length} collections</span>
            <span>{PRODUCTS.length} designs</span>
            <span>6 bays</span>
          </div>
        </div>

        <div className="lab-corner-mark" aria-hidden="true">773 <span>·</span> PRINT STUDIO</div>
        <div className="lab-hint" aria-hidden="true">Hover a card · click to open its spec</div>

        {/* Hover read-out. Moved and filled imperatively so the scene never re-renders. */}
        <div className="lab-spotlight" ref={spotlight.root} aria-hidden="true" data-on="off">
          <div className="lab-spotlight-top">
            <span className="lab-spotlight-index" ref={spotlight.index}>01</span>
            <span className="lab-spotlight-open">VIEW SPEC →</span>
          </div>
          <strong ref={spotlight.name}>—</strong>
          <span className="lab-spotlight-meta" ref={spotlight.meta}>—</span>
          <div className="lab-spotlight-foot">
            <span className="lab-spotlight-price" ref={spotlight.price}>—</span>
            <a ref={spotlight.link} href="/" onClick={(event) => { event.preventDefault(); if (spotlight.link.current) spotlight.navigate(spotlight.link.current.getAttribute('href')) }}>Open</a>
          </div>
        </div>
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