'use client';

/**
 * R3F Canvas scene with lights, camera, performance monitoring,
 * and loading progress overlay.
 *
 * Default export -- consumed via dynamic import in RobotCanvas.tsx.
 */

import {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {
  PresentationControls,
  AdaptiveDpr,
  PerformanceMonitor,
  useProgress,
} from '@react-three/drei';
import {RobotModel} from './RobotModel';
import {useRobotStore} from '@/stores/useRobotStore';

/** DOM-based loading overlay with real progress percentage. */
function LoadingOverlay() {
  const {progress, active} = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-base">
      <div className="text-center">
        <div className="font-display text-lg text-accent">
          Loading 3D Model...
        </div>
        <div className="mt-3 h-1 w-48 overflow-hidden rounded bg-surface-overlay">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{width: `${progress}%`}}
          />
        </div>
        <div className="mt-2 text-sm text-text-muted">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

export default function RobotScene() {
  const setPerformanceTier = useRobotStore((s) => s.setPerformanceTier);

  return (
    <>
      <LoadingOverlay />
      <Canvas
        dpr={[1, 1.5]}
        camera={{position: [0, 1, 5], fov: 45}}
        gl={{antialias: false, powerPreference: 'high-performance'}}
      >
        <PerformanceMonitor
          onDecline={() => setPerformanceTier('low')}
          onIncline={() => setPerformanceTier('high')}
          flipflops={3}
          onFallback={() => setPerformanceTier('low')}
        >
          <AdaptiveDpr pixelated />
        </PerformanceMonitor>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <RobotModel />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </>
  );
}
