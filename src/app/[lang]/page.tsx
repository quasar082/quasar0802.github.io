'use client';

import {useTranslations} from 'next-intl';
import {RobotCanvas} from '@/components/robot/RobotCanvas';
import {HeroSection} from '@/components/hero/HeroSection';

export default function HomePage() {
  const tHome = useTranslations('Home');

  return (
    <div className="min-h-dvh">
      {/* Hero section */}
      <HeroSection />

      {/* 3D Robot Section */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <RobotCanvas />
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
