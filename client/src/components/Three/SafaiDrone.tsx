import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SafaiDrone: React.FC<{ manualOffset?: number }> = ({ manualOffset = 0 }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Smooth floating animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth bobbing and rotation
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.5 + 2;
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.05;
    meshRef.current.rotation.x = Math.cos(time * 0.8) * 0.05;
  });

  return (
    <group ref={meshRef}>
      {/* Sleek Glass Body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.2, 1.4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8} 
          metalness={0.9} 
          roughness={0.1}
          emissive="#3B82F6"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Structural Carbon Arms */}
      <group>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.05, 0.1]} />
          <meshStandardMaterial color="#111111" metalness={1} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.2, 0.05, 0.1]} />
          <meshStandardMaterial color="#111111" metalness={1} />
        </mesh>
      </group>

      {/* High-Speed Rotors */}
      {[[-1.1, 0.1, -1.1], [1.1, 0.1, -1.1], [-1.1, 0.1, 1.1], [1.1, 0.1, 1.1]].map((pos, i) => (
        <group key={i} position={pos as any}>
          {/* Rotor Housing */}
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Spinning Blur Effect */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.01, 32]} />
            <meshStandardMaterial 
              color="#3B82F6" 
              transparent 
              opacity={0.1} 
              emissive="#3B82F6"
              emissiveIntensity={2}
            />
          </mesh>
          <RotorBlade />
        </group>
      ))}

      {/* Front Optical Sensor (Blue Eye) */}
      <mesh position={[0, -0.05, 0.7]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#000" emissive="#3B82F6" emissiveIntensity={5} />
      </mesh>

      {/* Underglow */}
      <pointLight position={[0, -0.5, 0]} intensity={5} color="#3B82F6" />
    </group>
  );
};

const RotorBlade: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y += 0.8;
  });
  return (
    <mesh ref={ref} position={[0, 0.06, 0]}>
      <boxGeometry args={[1.1, 0.01, 0.05]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
};

export default SafaiDrone;
