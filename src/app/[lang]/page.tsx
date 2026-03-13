'use client';

import {useTranslations} from 'next-intl';
import {RobotCanvas} from '@/components/robot/RobotCanvas';
import {useRobotStore} from '@/stores/useRobotStore';
import type {RobotEmotion} from '@/types/robot';

export default function HomePage() {
  const tHero = useTranslations('Hero');
  const tHome = useTranslations('Home');

  return (
    <div className="min-h-dvh">
      {/* Hero section (placeholder -- real hero comes in Phase 5) */}
      <section className="mx-auto flex max-w-[1200px] flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
        <h1 className="text-balance font-display text-5xl font-medium text-text-primary md:text-6xl">
          {tHero('greeting')}
        </h1>
        <p className="mt-4 font-display text-2xl text-accent md:text-3xl">
          {tHero('role')}
        </p>
        <p className="text-pretty mt-4 text-lg text-text-secondary md:text-xl">
          {tHero('tagline')}
        </p>
      </section>

      {/* 3D Robot Section */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <RobotCanvas />
        {/* Emotion demo controls -- development only, will be removed when chatbot drives emotions in Phase 4 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {(
            ['idle', 'happy', 'sad', 'excited', 'thinking'] as RobotEmotion[]
          ).map((emotion) => (
            <button
              key={emotion}
              onClick={() => useRobotStore.getState().setEmotion(emotion)}
              className="rounded border border-border px-3 py-1 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              {emotion}
            </button>
          ))}
        </div>
      </section>

      {/* Showcase section -- proves design tokens + translations working */}
      <section className="mx-auto max-w-[1200px] px-4 py-32 sm:px-6">
        <div className="rounded-lg border border-border bg-surface-elevated p-8">
          <h2 className="text-balance font-display text-2xl font-medium text-text-primary">
            {tHome('welcome')}
          </h2>
          <p className="text-pretty mt-2 font-body text-lg text-text-secondary">
            {tHome('subtitle')}
          </p>
          <p className="text-pretty mt-4 font-body text-text-secondary">
            {tHome('description')}
          </p>
          <div className="mt-8">
            <button className="rounded-md border border-accent px-6 py-2 text-accent transition-colors duration-150 hover:bg-accent hover:text-surface-base">
              {tHome('cta')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
