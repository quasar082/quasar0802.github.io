'use client';

import {useRef} from 'react';
import {ServicesBlock} from '@/components/about/services-block';
import {IntroBlock} from '@/components/about/intro-block';
import {StrengthBlock} from '@/components/about/strength-block';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="overflow-hidden">
      {/* ===== PART 1: Introduction ===== */}
      <div>
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          <IntroBlock />
          <StrengthBlock />
        </div>
      </div>

      {/* ===== PART 2: "I can help you with" + 3 service cards ===== */}
      <div style={{paddingTop: '14rem'}}>
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          <ServicesBlock />
        </div>
      </div>
    </section>
  );
}
