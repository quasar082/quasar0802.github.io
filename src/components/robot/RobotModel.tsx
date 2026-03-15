'use client';

/**
 * 3D robot model with emotion-driven animation crossfade.
 *
 * Loads the GLTF model via drei's useGLTF, manages animations
 * via useAnimations, and subscribes to Zustand emotion state
 * for crossfade transitions between clips.
 */

import {useRef, useEffect} from 'react';
import {useGLTF, useAnimations} from '@react-three/drei';
import type {Group} from 'three';
import {useRobotStore} from '@/stores/useRobotStore';
import {EMOTION_CLIP_MAP, MODEL_PATH} from '@/types/robot';
import type {RobotEmotion} from '@/types/robot';

export function RobotModel() {
  const groupRef = useRef<Group>(null);
  const {scene, animations} = useGLTF(MODEL_PATH);
  const {actions} = useAnimations(animations, groupRef);

  const emotion = useRobotStore((s) => s.emotion);
  const setModelLoaded = useRobotStore((s) => s.setModelLoaded);

  // Signal model loaded/unloaded to store
  useEffect(() => {
    setModelLoaded(true);
    return () => setModelLoaded(false);
  }, [setModelLoaded]);

  // Log available animation clips for debugging (critical for model swap)
  useEffect(() => {
    console.log(
      '[Robot] Available animations:',
      animations.map((a) => a.name),
    );
  }, [animations]);

  // Emotion-driven animation crossfade
  const prevEmotionRef = useRef<RobotEmotion>(emotion);
  useEffect(() => {
    const prevClip = EMOTION_CLIP_MAP[prevEmotionRef.current];
    const nextClip = EMOTION_CLIP_MAP[emotion];
    const prevAction = actions[prevClip];
    const nextAction = actions[nextClip];

    if (nextAction) {
      if (prevAction && prevAction !== nextAction) {
        prevAction.fadeOut(0.5);
      }
      nextAction.reset().fadeIn(0.5).play();
    }

    prevEmotionRef.current = emotion;
  }, [emotion, actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
