import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

const FlightPath: React.FC = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 5, -20),
      new THREE.Vector3(-10, 2, -40),
      new THREE.Vector3(5, -5, -60),
      new THREE.Vector3(0, 0, -80),
      new THREE.Vector3(-5, 5, -100),
    ]);
  }, []);

  const points = useMemo(() => curve.getPoints(100), [curve]);

  return (
    <group>
      <Line
        points={points}
        color="#3B82F6"
        lineWidth={1}
        transparent
        opacity={0.2}
      />
      {/* Add some "nodes" along the path for visual interest */}
      {points.filter((_, i) => i % 20 === 0).map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

export default FlightPath;
