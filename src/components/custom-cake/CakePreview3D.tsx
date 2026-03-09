import { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
  Stage,
  Center,
  Sphere,
  Text,
  Extrude,
  OrbitControls,
} from '@react-three/drei';
import { ScreenshotBridge } from './ScreenshotBridge';
import { SugarRose } from './SugarRose';
import { Layer } from './types';

interface CakePreview3DProps {
  layers: Layer[];
  selectedShape: string;
  selectedDecorationIds: string[];
  textTopper: string;
  onCaptureReady: (fn: () => string) => void;
}

export const CakePreview3D = ({
  layers,
  selectedShape,
  selectedDecorationIds,
  textTopper,
  onCaptureReady,
}: CakePreview3DProps) => {
  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.4);
    s.bezierCurveTo(0.1, -0.45, 0.8, -0.1, 0.8, 0.4);
    s.bezierCurveTo(0.8, 0.9, 0.1, 1, 0, 0.5);
    s.bezierCurveTo(-0.1, 1, -0.8, 0.9, -0.8, 0.4);
    s.bezierCurveTo(-0.8, -0.1, -0.1, -0.45, 0, -0.4);
    return s;
  }, []);

  return (
    <section className='bg-white p-6 rounded-3xl shadow-xl border border-gray-100'>
      <h2 className='text-xl font-bold text-[#5D4037] mb-6'>5. Your Cake</h2>
      <div className='h-125 w-full bg-[#fdfbf9] rounded-2xl overflow-hidden relative border border-orange-50'>
        <Canvas
          shadows
          camera={{ position: [8, 8, 8], fov: 35 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ScreenshotBridge onReady={onCaptureReady} />
          <color attach='background' args={['#fdfbf9']} />
          <Stage environment='city' intensity={0.5}>
            <group position={[0, -1, 0]}>
              {layers.map((layer, index) => {
                const tierHeight = 0.5;
                const yPos = index * tierHeight;
                const scale = 1 - index * 0.12;
                const isTopLayer = index === layers.length - 1;

                return (
                  <group key={layer.id} position={[0, yPos, 0]}>
                    <mesh castShadow receiveShadow>
                      {selectedShape === 'round' && (
                        <cylinderGeometry
                          args={[2.5 * scale, 2.5 * scale, tierHeight, 64]}
                        />
                      )}
                      {selectedShape === 'square' && (
                        <boxGeometry
                          args={[4 * scale, tierHeight, 4 * scale]}
                        />
                      )}
                      {selectedShape === 'heart' && (
                        <Center top>
                          <Extrude
                            args={[
                              heartShape,
                              {
                                depth: tierHeight,
                                bevelEnabled: true,
                                bevelThickness: 0.05,
                                bevelSize: 0.02,
                              },
                            ]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            scale={2.5 * scale}
                          >
                            <meshStandardMaterial
                              color={layer.color}
                              roughness={0.4}
                            />
                          </Extrude>
                        </Center>
                      )}
                      <meshStandardMaterial
                        color={layer.color}
                        roughness={0.5}
                      />
                    </mesh>

                    {isTopLayer && (
                      <group position={[0, tierHeight / 2 + 0.01, 0]}>
                        {selectedDecorationIds.includes('roses') && (
                          <>
                            <SugarRose position={[0, 0.1, 0]} scale={1.8} />
                            <SugarRose
                              position={[0.4, 0.05, 0.3]}
                              scale={1.2}
                            />
                            <SugarRose
                              position={[-0.4, 0.05, -0.3]}
                              scale={1.2}
                            />
                          </>
                        )}
                        <Text
                          fontSize={0.3 * scale}
                          color='#f472b6'
                          rotation={[-Math.PI / 2, 0, 0]}
                          textAlign='center'
                          maxWidth={4 * scale}
                        >
                          {textTopper}
                        </Text>
                      </group>
                    )}

                    {selectedDecorationIds.includes('pearls') &&
                      Array.from({ length: 16 }).map((_, i) => (
                        <Sphere
                          key={i}
                          args={[0.06]}
                          position={[
                            Math.cos((i / 16) * Math.PI * 2) * (2.5 * scale),
                            tierHeight / 2,
                            Math.sin((i / 16) * Math.PI * 2) * (2.5 * scale),
                          ]}
                        >
                          <meshStandardMaterial
                            color='white'
                            metalness={0.9}
                            roughness={0.1}
                          />
                        </Sphere>
                      ))}
                  </group>
                );
              })}
            </group>
          </Stage>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </section>
  );
};
