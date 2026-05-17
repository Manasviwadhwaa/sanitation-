import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';

interface NodeProps {
  position: [number, number, number];
  status: 'GREEN' | 'AMBER' | 'RED';
  label: string;
}

const InfrastructureNode: React.FC<NodeProps> = ({ position, status, label }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = status === 'GREEN' ? '#10b981' : status === 'AMBER' ? '#f59e0b' : '#ef4444';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <MeshDistortMaterial 
            color="#ffffff" 
            speed={2} 
            distort={0.2} 
            radius={1}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
        
        {/* Internal Pulsing Core */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={2} 
          />
        </mesh>

        {/* Floating Label */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="black"
          font="https://fonts.gstatic.com/s/robotomonocondensed/v9/L0x8DF02iFML4hGCyOCzSRN5X5TfX0v_Z5Xv.woff"
          anchorX="center"
          anchorY="middle"
        >
          {label.toUpperCase()}
        </Text>

        {/* Ambient Glow */}
        <pointLight intensity={2} color={color} />
      </group>
    </Float>
  );
};

export default InfrastructureNode;
