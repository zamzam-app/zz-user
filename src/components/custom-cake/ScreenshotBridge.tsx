import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export function ScreenshotBridge({
  onReady,
}: {
  onReady: (fn: () => string) => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    onReady(() => {
      // Just extract the buffer. gl.render here interrupts R3F's loop causing flickering.
      return gl.domElement.toDataURL('image/png');
    });
  }, [gl, onReady]);

  return null;
}
