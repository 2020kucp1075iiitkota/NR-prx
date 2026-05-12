'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import * as THREE from 'three'

const FONT = '/fonts/droid_serif_bold.typeface.json'

/* ── Faceted gold diamond ── */
function Diamond() {
  return (
    <group>
      {/* Crown – wide at girdle, narrow at table */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.32, 0.85, 0.38, 8, 1]} />
        <meshStandardMaterial color="#D4A843" metalness={0.0} roughness={0.82} flatShading />
      </mesh>
      {/* Pavilion – tapers to a point */}
      <mesh position={[0, -0.36, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.85, 0.72, 8, 1]} />
        <meshStandardMaterial color="#B8862A" metalness={0.0} roughness={0.82} flatShading />
      </mesh>
    </group>
  )
}

/* ── Animated scene ── */
function Scene() {
  const group = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.55) * 0.10
  })

  return (
    <group ref={group}>
      {/* N — shifted left to create gap */}
      <Text3D
        font={FONT}
        position={[-1.52, -0.80, 0]}
        size={1.7}
        height={0.24}
        bevelEnabled
        bevelSize={0.028}
        bevelThickness={0.034}
        curveSegments={6}
      >
        N
        <meshStandardMaterial color="#ffffff" metalness={0.0} roughness={1.0} />
      </Text3D>

      {/* R — shifted right to create gap */}
      <Text3D
        font={FONT}
        position={[0.28, -0.80, 0]}
        size={1.7}
        height={0.24}
        bevelEnabled
        bevelSize={0.028}
        bevelThickness={0.034}
        curveSegments={6}
      >
        R
        <meshStandardMaterial color="#ffffff" metalness={0.0} roughness={1.0} />
      </Text3D>

      {/* Diamond – centred in the gap between N and R */}
      <group position={[0.14, 1.10, 0.1]} scale={[0.92, 0.76, 0.76]}>
        <Diamond />
      </group>
    </group>
  )
}

/* ── Canvas export ── */
export default function NRLogo3D({
  width = 140,
  height = 105,
}: {
  width?: number | string
  height?: number | string
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0.3, 7.0], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        {/* Soft wrap lighting for matte finish — no hard specular */}
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[4, 6, 4]}   intensity={1.4} color="#ffffff" />
        <directionalLight position={[-4, 2, 2]}  intensity={0.6} color="#fff8ee" />
        <directionalLight position={[0, -3, 4]}  intensity={0.3} color="#ddeeff" />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
