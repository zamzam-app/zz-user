import { TorusKnot, Sphere } from '@react-three/drei';

export type SugarRoseProps = {
  position: [number, number, number];
  scale?: number;
};

export const SugarRose = ({ position, scale = 1 }: SugarRoseProps) => (
  <group position={position} scale={scale}>
    <TorusKnot args={[0.1, 0.05, 128, 16, 2, 3]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color='#ffacc5' roughness={0.7} />
    </TorusKnot>
    <Sphere
      args={[0.12, 16, 16]}
      scale={[1.2, 0.5, 1.2]}
      position={[0, -0.05, 0]}
    >
      <meshStandardMaterial color='#ff92b1' roughness={0.8} />
    </Sphere>
  </group>
);
