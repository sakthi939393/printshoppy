'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';

function TShirtMesh({ designTexture }: { designTexture: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 2.5, 0.1]} />
      <meshStandardMaterial
        color="#e2e8f0"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function DesignOverlay({ dataUrl }: { dataUrl: string }) {
  const [texture] = useState(() => {
    const t = new THREE.TextureLoader().load(dataUrl);
    return t;
  });

  return (
    <mesh position={[0, 0.1, 0.06]}>
      <planeGeometry args={[1.4, 1.4]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
    </mesh>
  );
}

export default function ProductMockup() {
  const [designDataUrl] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 3, 0]} intensity={0.5} color="#3b82f6" />

          <TShirtMesh designTexture={designDataUrl} />
          {designDataUrl && <DesignOverlay dataUrl={designDataUrl} />}

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI * 3 / 4}
          />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          🔄 Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}
