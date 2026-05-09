import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SafaiDrone: React.FC<{ manualOffset?: number }> = ({ manualOffset = 0 }) => {
  const meshRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(10, 8, -30),
    new THREE.Vector3(-15, 4, -60),
    new THREE.Vector3(8, -2, -90),
    new THREE.Vector3(0, 5, -120),
    new THREE.Vector3(-8, 3, -150),
  ]), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Use manualOffset (scrolled %) to follow path
    const t = Math.max(0, Math.min(manualOffset, 1));
    const position = curve.getPointAt(t);
    const lookAt = curve.getPointAt(Math.min(t + 0.05, 0.999));

    // Idle Bobbing
    const time = state.clock.getElapsedTime();
    const bobbing = Math.sin(time * 2) * 0.15;
    
    meshRef.current.position.set(position.x, position.y + bobbing, position.z);

    // Banking & Rotation
    const targetMatrix = new THREE.Matrix4().lookAt(meshRef.current.position, lookAt, new THREE.Vector3(0, 1, 0));
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(targetMatrix);
    meshRef.current.quaternion.slerp(targetQuaternion, 0.1);

    const xMovement = (lookAt.x - position.x) * 0.5;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -xMovement, 0.05);

    // Smooth Camera Following
    const cameraOffset = new THREE.Vector3(0, 2.5, 8);
    cameraOffset.applyQuaternion(meshRef.current.quaternion);
    
    const targetCameraPos = meshRef.current.position.clone().add(cameraOffset);
    state.camera.position.lerp(targetCameraPos, 0.08);
    state.camera.lookAt(meshRef.current.position.clone().add(new THREE.Vector3(0, 0, -2)));
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.2, 1]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
      
      <group>
        <mesh><boxGeometry args={[1.8, 0.05, 0.15]} /><meshStandardMaterial color="#050816" /></mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[1.8, 0.05, 0.15]} /><meshStandardMaterial color="#050816" /></mesh>
      </group>

      {[[-0.9, 0.15, -0.45], [0.9, 0.15, -0.45], [-0.9, 0.15, 0.45], [0.9, 0.15, 0.45]].map((pos, i) => (
        <group key={i} position={pos as any}>
          <mesh><cylinderGeometry args={[0.4, 0.4, 0.02, 16]} /><meshStandardMaterial color="#22D3EE" transparent opacity={0.2} /></mesh>
          <RotorBlade />
        </group>
      ))}

      <mesh position={[0, -0.15, 0.4]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#3B82F6" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={10} color="#3B82F6" />
    </group>
  );
};

const RotorBlade: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 20; });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.7, 0.01, 0.05]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
};

export default SafaiDrone;
