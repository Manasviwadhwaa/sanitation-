import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import FlightPath from './FlightPath';
import SafaiDrone from './SafaiDrone';
import SkyEnvironment from './SkyEnvironment';
import DataParticles, { DataStreams } from './DataParticles';

interface SceneCanvasProps {
  facilities: any[];
}

const SceneCanvas: React.FC<SceneCanvasProps> = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Normalize scroll to 0.0 - 1.0 for the whole page
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = winScroll / height;
      setScrollY(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }} // Ensure 3D doesn't block DOM clicks
    >
      <Suspense fallback={null}>
        <group>
          <SkyEnvironment />
          <FlightPath />
          {/* We'll pass the manual scroll offset to the drone */}
          <SafaiDrone manualOffset={scrollY} />
          <DataParticles />
          <DataStreams />
        </group>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
};

export default SceneCanvas;
