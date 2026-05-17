import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, MeshDistortMaterial } from '@react-three/drei';

const FlightPath: React.FC = () => {
  const lineRef = useRef<THREE.Group>(null);

  // Generate a complex, glowing orbital path
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * 15 + Math.sin(angle * 2) * 5,
        Math.sin(angle * 3) * 4 + 5,
        Math.sin(angle) * 15 + Math.cos(angle * 2) * 5
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    return geo;
  }, [curve]);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={lineRef}>
      {/* Primary Glowing Trail */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#3B82F6" linewidth={2} transparent opacity={0.3} />
      </line>

      {/* Floating Data Nodes on the path */}
      {[0, 0.2, 0.4, 0.6, 0.8].map((t, i) => {
        const pos = curve.getPointAt(t);
        return (
          <Float key={i} position={pos.toArray() as any} speed={4} rotationIntensity={2} floatIntensity={2}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#3B82F6" 
                emissive="#3B82F6" 
                emissiveIntensity={4} 
              />
            </mesh>
            <pointLight intensity={2} color="#3B82F6" />
          </Float>
        );
      })}

      {/* Atmospheric Neural Grid */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          wireframe 
          transparent 
          opacity={0.05} 
          metalness={1} 
          roughness={0}
        />
      </mesh>
    </group>
  );
};

export default FlightPath;
