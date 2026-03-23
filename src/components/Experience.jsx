import { ContactShadows, Environment, Float, OrbitControls, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Character } from './models/Character';
import { AdvikaLabel, ServicePanels } from './ServicePanels';

// Slowly rotating wireframe geometry — represents data nodes / tech
function TechNode({ position, shape, color, scale }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        {shape === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
        {shape === 'octahedron'  && <octahedronGeometry  args={[1]}    />}
        {shape === 'torus'       && <torusGeometry        args={[1, 0.3, 8, 24]} />}
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
}

// Holographic ring that slowly spins under Advika
function HoloRing() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, -0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.1, 0.015, 8, 96]} />
      <meshStandardMaterial
        color="#1a56db"
        emissive="#1a56db"
        emissiveIntensity={3}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

export const Experience = ({ client }) => {
  return (
    <>
      {/* Deep space dark background */}
      <color attach="background" args={['#04091a']} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ffffff" castShadow />
      {/* Metayb blue fill from left */}
      <pointLight position={[-4, 3, 1]} intensity={4} color="#1a56db" />
      {/* Lighter blue accent from right */}
      <pointLight position={[4, 2, 1]} intensity={3} color="#3b82f6" />
      {/* Warm key light on face */}
      <pointLight position={[0, 2, 3]} intensity={2} color="#ffffff" />

      {/* Star field */}
      <Stars radius={60} depth={40} count={4000} factor={3} saturation={0} fade speed={0.5} />

      {/* City reflections on the avatar */}
      <Environment preset="city" />

      {/* Camera orbit — right-click drag (desktop) / two-finger (mobile) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.9}
        mouseButtons={{ LEFT: -1, MIDDLE: -1, RIGHT: THREE.MOUSE.ROTATE }}
        touches={{ ONE: -1, TWO: THREE.TOUCH.ROTATE }}
        target={[0, 0.2, 0]}
      />

      {/* Floating tech nodes — Metayb brand blues */}
      <TechNode position={[-4.5, 2.5, -3]} shape="icosahedron" color="#1a56db" scale={0.45} />
      <TechNode position={[ 4.0, 1.5, -2]} shape="octahedron"  color="#3b82f6" scale={0.50} />
      <TechNode position={[-3.5, 0.5, -4]} shape="torus"       color="#1a56db" scale={0.30} />
      <TechNode position={[ 3.5, 3.2, -4]} shape="icosahedron" color="#60a5fa" scale={0.38} />
      <TechNode position={[ 0.0, 3.8, -5]} shape="octahedron"  color="#1a56db" scale={0.42} />
      <TechNode position={[-5.0, 1.2, -2]} shape="torus"       color="#3b82f6" scale={0.28} />
      <TechNode position={[ 5.0, 0.8, -3]} shape="icosahedron" color="#60a5fa" scale={0.35} />

      {/* Service panels */}
      <ServicePanels />

      {/* Holographic ring at Advika's feet */}
      <HoloRing />

      {/* Advika */}
      <Suspense>
        <Character client={client} position={[0, -1, 0]} />
        <AdvikaLabel />
      </Suspense>

      <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={4} blur={2} far={3} />
    </>
  );
};
