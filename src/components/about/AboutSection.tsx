'use client';

import {useRef} from 'react';
import {ServicesBlock} from '@/components/about/ServicesBlock';
import {IntroBlock} from '@/components/about/IntroBlock';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="overflow-hidden">
      {/* ===== PART 1: Introduction ===== */}
      <div style={{paddingTop: '14rem'}}>
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          <IntroBlock />
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
