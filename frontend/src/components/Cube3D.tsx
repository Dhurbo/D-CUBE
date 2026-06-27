import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Quaternion, Vector3, type Group } from 'three'

import type { FaceName } from '../types/cubeTypes'
import { parseMove, type ParsedMove } from '../utils/moveParser'

const FACE_COLORS = {
  U: '#FFFFFF',
  R: '#DC2626',
  F: '#16A34A',
  D: '#FACC15',
  L: '#F97316',
  B: '#2563EB',
  inner: '#111827',
}

const POSITIONS = [-1, 0, 1] as const
const CUBIE_SPACING = 1.04
const MOVE_DURATION_SECONDS = 0.35

type Axis = 'x' | 'y' | 'z'
type GridPosition = [number, number, number]

interface CubieState {
  id: string
  position: GridPosition
  orientation: Quaternion
  homePosition: GridPosition
}

interface Cube3DProps {
  currentMove?: string
}

interface ActiveAnimation {
  move: ParsedMove
  elapsed: number
}

function createInitialCubies(): CubieState[] {
  return POSITIONS.flatMap((x) =>
    POSITIONS.flatMap((y) =>
      POSITIONS.map((z) => ({
        id: `${x}-${y}-${z}`,
        position: [x, y, z],
        homePosition: [x, y, z],
        orientation: new Quaternion(),
      })),
    ),
  )
}

function getMoveAxis(face: FaceName): Axis {
  if (face === 'R' || face === 'L') return 'x'
  if (face === 'U' || face === 'D') return 'y'
  return 'z'
}

function getLayerValue(face: FaceName): number {
  return face === 'R' || face === 'U' || face === 'F' ? 1 : -1
}

function isInMoveLayer(cubie: CubieState, face: FaceName): boolean {
  const axis = getMoveAxis(face)
  const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
  return cubie.position[axisIndex] === getLayerValue(face)
}

function getMoveAngle(move: ParsedMove): number {
  // Clockwise is defined while looking directly at the face being turned.
  const clockwiseAngle = ['U', 'R', 'F'].includes(move.face) ? -Math.PI / 2 : Math.PI / 2
  return clockwiseAngle * move.turns
}

function getAxisVector(axis: Axis): Vector3 {
  return axis === 'x' ? new Vector3(1, 0, 0) : axis === 'y' ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1)
}

function setGroupRotation(group: Group, axis: Axis, angle: number) {
  group.rotation.set(0, 0, 0)
  group.rotation[axis] = angle
}

function rotateLayer(cubies: CubieState[], move: ParsedMove): CubieState[] {
  const axis = getMoveAxis(move.face)
  const rotation = new Quaternion().setFromAxisAngle(getAxisVector(axis), getMoveAngle(move))

  return cubies.map((cubie) => {
    if (!isInMoveLayer(cubie, move.face)) {
      return cubie
    }

    const rotatedPosition = new Vector3(...cubie.position).applyQuaternion(rotation)
    const position: GridPosition = [
      Math.round(rotatedPosition.x),
      Math.round(rotatedPosition.y),
      Math.round(rotatedPosition.z),
    ]

    return {
      ...cubie,
      position,
      orientation: rotation.clone().multiply(cubie.orientation),
    }
  })
}

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3)
}

interface CubieProps {
  cubie: CubieState
}

function Cubie({ cubie }: CubieProps) {
  const [x, y, z] = cubie.homePosition
  // BoxGeometry material order: right, left, top, bottom, front, back.
  const materialColors = [
    x === 1 ? FACE_COLORS.R : FACE_COLORS.inner,
    x === -1 ? FACE_COLORS.L : FACE_COLORS.inner,
    y === 1 ? FACE_COLORS.U : FACE_COLORS.inner,
    y === -1 ? FACE_COLORS.D : FACE_COLORS.inner,
    z === 1 ? FACE_COLORS.F : FACE_COLORS.inner,
    z === -1 ? FACE_COLORS.B : FACE_COLORS.inner,
  ]

  return (
    <mesh
      position={cubie.position.map((value) => value * CUBIE_SPACING) as [number, number, number]}
      quaternion={cubie.orientation}
    >
      <boxGeometry args={[1, 1, 1]} />
      {materialColors.map((color, index) => (
        <meshStandardMaterial key={index} color={color} metalness={0.05} roughness={0.5} />
      ))}
    </mesh>
  )
}

function RubiksCube({ currentMove }: Cube3DProps) {
  const [cubies, setCubies] = useState<CubieState[]>(createInitialCubies)
  const [activeMove, setActiveMove] = useState<ParsedMove | null>(null)
  const layerRef = useRef<Group>(null)
  const animationRef = useRef<ActiveAnimation | null>(null)

  useEffect(() => {
    const parsedMove = parseMove(currentMove)
    if (!parsedMove || animationRef.current) {
      return
    }

    animationRef.current = { move: parsedMove, elapsed: 0 }
    setActiveMove(parsedMove)
  }, [currentMove])

  useFrame((_, delta) => {
    const animation = animationRef.current
    const layer = layerRef.current
    if (!animation || !layer) {
      return
    }

    animation.elapsed += delta
    const progress = Math.min(animation.elapsed / MOVE_DURATION_SECONDS, 1)
    setGroupRotation(layer, getMoveAxis(animation.move.face), getMoveAngle(animation.move) * easeOutCubic(progress))

    if (progress === 1) {
      setGroupRotation(layer, getMoveAxis(animation.move.face), 0)
      setCubies((currentCubies) => rotateLayer(currentCubies, animation.move))
      animationRef.current = null
      setActiveMove(null)
    }
  })

  const inactiveCubies = activeMove
    ? cubies.filter((cubie) => !isInMoveLayer(cubie, activeMove.face))
    : cubies
  const activeCubies = activeMove ? cubies.filter((cubie) => isInMoveLayer(cubie, activeMove.face)) : []

  // TODO: Connect this persistent visual cubie state to the editable CubeState model for exact solver-state synchronization.
  return (
    <group>
      {inactiveCubies.map((cubie) => (
        <Cubie key={cubie.id} cubie={cubie} />
      ))}
      <group ref={layerRef}>
        {activeCubies.map((cubie) => (
          <Cubie key={cubie.id} cubie={cubie} />
        ))}
      </group>
    </group>
  )
}

function Cube3D({ currentMove }: Cube3DProps) {
  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <Canvas camera={{ position: [5, 4, 6], fov: 42 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 6, 4]} intensity={2.5} />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} />
        <RubiksCube currentMove={currentMove} />
        <OrbitControls enablePan={false} minDistance={5} maxDistance={10} />
      </Canvas>
    </div>
  )
}

export default Cube3D
