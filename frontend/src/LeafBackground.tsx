import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function Leaf({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x += 0.001;
    ref.current.position.y -= 0.002; // sanftes Fallen
    if (ref.current.position.y < -3) ref.current.position.y = 3; // reset oben
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.3, 0.4]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function LeafBackground() {
  const leaves = Array.from({ length: 20 }).map((_, i) => ({
    position: [
      (Math.random() - 0.5) * 8,
      Math.random() * 6 - 2,
      (Math.random() - 0.5) * 6,
    ] as [number, number, number],
    color: ["#d57a66", "#e6a57e", "#a3a380", "#b85c38"][i % 4],
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
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        {leaves.map((leaf, i) => (
          <Leaf key={i} {...leaf} />
        ))}
      </Float>
    </Canvas>
  );
}
