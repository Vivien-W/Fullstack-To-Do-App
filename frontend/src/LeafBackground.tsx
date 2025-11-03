import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef } from "react";
import * as THREE from "three";

function Leaf({ position, rotation, scale, texture }: any) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();

    //  Parameter für Bewegung
    const fallSpeed = 0.003; // schnelleres Fallen
    const windAmplitude = 0.8; // horizontale Amplitude
    const windFrequency = 1.5; // wie oft sich das Blatt hin- und herbewegt
    const spinSpeed = 0.02; // Drehung im Uhrzeigersinn

    //  1. Vertikaler Fall
    ref.current.position.y -= fallSpeed;

    //  2. Leichtes Hin- und Herwehen
    ref.current.position.x =
      ref.current.userData.startX +
      Math.sin(t * windFrequency + ref.current.userData.offset) *
        windAmplitude *
        0.02;

    //  3. Rotation um eigene Achse (Uhrzeigersinn)
    ref.current.rotation.z += spinSpeed;

    //  4. Reset, wenn unten
    if (ref.current.position.y < -3.5) {
      ref.current.position.y = 3 + Math.random() * 2;
      ref.current.position.x = (Math.random() - 0.5) * 10;
      ref.current.userData.startX = ref.current.position.x;
      ref.current.userData.offset = Math.random() * Math.PI * 2;
    }
  });

  //  Anfangswerte speichern
  const meshRef = useRef<THREE.Mesh>(null!);
  if (meshRef.current) {
    meshRef.current.userData.startX = position[0];
    meshRef.current.userData.offset = Math.random() * Math.PI * 2;
  }

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.4, 0.6]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        alphaTest={0.3}
      />
    </mesh>
  );
}

export default function LeafBackground() {
  // 🍃 Lade CC0-Blatttexturen
  const textures = useLoader(TextureLoader, [
    "/textures/leaf1.png",
    "/textures/leaf2.png",
    "/textures/leaf3.png",
  ]);

  // 🌿 Erzeuge Blätter mit Startposition
  const leaves = Array.from({ length: 35 }).map(() => ({
    position: [
      (Math.random() - 0.5) * 10,
      Math.random() * 6 - 2,
      (Math.random() - 0.5) * 6,
    ],
    rotation: [0, 0, Math.random() * Math.PI * 2],
    scale: 0.6 + Math.random() * 0.5,
    texture: textures[Math.floor(Math.random() * textures.length)],
  }));

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        background:
          "linear-gradient(to bottom right, var(--color-bg), var(--color-card))",
      }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 5]} intensity={0.8} color="#f6d6a8" />
      {leaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}
    </Canvas>
  );
}
