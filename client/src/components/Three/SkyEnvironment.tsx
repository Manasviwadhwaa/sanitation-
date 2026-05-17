import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, Sparkles, ContactShadows } from '@react-three/drei';

const SkyEnvironment: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Soft Background Sky */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#fcf8fa" 
          side={THREE.BackSide} 
          metalness={0} 
          roughness={1}
        />
      </mesh>

      {/* Floating Sparkles for "Data Particles" */}
      <Sparkles 
        count={200} 
        scale={20} 
        size={2} 
        speed={0.2} 
        color="#3B82F6" 
        opacity={0.2} 
      />

      {/* Subtle Ground Shadows */}
      <ContactShadows 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />

      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, 10, 5]} intensity={0.5} color="#3B82F6" />
    </group>
  );
};

export default SkyEnvironment;
