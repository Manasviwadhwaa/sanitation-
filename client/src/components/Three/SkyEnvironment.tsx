import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Gradient, LayerMaterial } from 'lamina';

const SkyEnvironment: React.FC = () => {
  const cloudsRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  const cloudParticles = useMemo(() => {
    // ... cloud generation logic
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 50,
          -Math.random() * 200,
        ],
        scale: Math.random() * 5 + 2,
      });
    }
    return particles;
  }, []);

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud) => {
        cloud.position.z += 0.05;
        if (cloud.position.z > 20) cloud.position.z = -180;
      });
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.mouse.x * Math.PI) / 20, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (state.mouse.y * Math.PI) / 20, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background Gradient */}
      <mesh scale={200}>
        <sphereGeometry args={[1, 64, 64]} />
        <LayerMaterial side={THREE.BackSide}>
          <Gradient 
            colorA="#020617" 
            colorB="#0F172A" 
            start={-1} 
            end={1} 
            axes="y" 
          />
        </LayerMaterial>
      </mesh>

      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#030712', 30, 150]} />

      {/* Clouds */}
      <group ref={cloudsRef}>
        {cloudParticles.map((particle, i) => (
          <mesh 
            key={i} 
            position={particle.position as any} 
            scale={particle.scale}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial 
              color="#3B82F6" 
              transparent 
              opacity={0.03} 
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <ambientLight intensity={0.1} />
      <hemisphereLight args={['#3B82F6', '#030712', 0.6]} />
    </group>
  );
};

export default SkyEnvironment;
