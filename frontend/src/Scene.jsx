import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei'

function CircuitVisual({ color, position, size, label }) {
  const mesh = useRef()
  useFrame((state, delta) => (mesh.current.rotation.y += delta * 0.2))
  
  return (
    <group position={position}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[size, 1]} />
        <meshStandardMaterial color={color} wireframe opacity={0.6} transparent />
      </mesh>
      <Sphere args={[size * 0.2]} position={[0,0,0]}>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Text position={[0, -size - 0.5, 0]} color="#161616" fontSize={0.3}>
        {label}
      </Text>
    </group>
  )
}

function Connection() {
  return (
    <Line
      points={[[-3, 0, 0], [3, 0, 0]]}
      color="#007d79"
      lineWidth={2}
      dashed
    />
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <CircuitVisual color="#0f62fe" position={[-3, 0, 0]} size={1.2} label="Reference Circuit" />
      <CircuitVisual color="#0f62fe" position={[3, 0, 0]} size={1.2} label="Candidate Circuit" />
      
      <Connection />
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
