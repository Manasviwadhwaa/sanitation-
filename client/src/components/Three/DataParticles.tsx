import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DataParticles: React.FC = () => {
  const count = 2000;
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 100;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#3B82F6"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const DataStreams: React.FC = () => {
  const count = 20;
  const lines = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      points: [
        new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 100),
        new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 100),
      ],
      speed: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  const refs = useRef<THREE.Group>(null);

  useFrame(() => {
    if (refs.current) {
      refs.current.children.forEach((child, i) => {
        if (lines[i]) {
          child.position.z += lines[i].speed;
          if (child.position.z > 20) child.position.z = -80;
        }
      });
    }
  });

  return (
    <group ref={refs}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line.points[0].x, line.points[0].y, line.points[0].z,
                line.points[1].x, line.points[1].y, line.points[1].z
              ])}
              itemSize={3}
              args={[new Float32Array(6), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#22D3EE" transparent opacity={0.2} />
        </line>
      ))}
    </group>
  );
};

export default DataParticles;
