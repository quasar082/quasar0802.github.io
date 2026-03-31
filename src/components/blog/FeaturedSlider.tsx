'use client';

import {useRef, useState, useEffect, useCallback} from 'react';
import {gsap, Draggable, InertiaPlugin, ScrollTrigger, useGSAP} from '@/lib/gsap';
import {BlogCard} from './BlogCard';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';
import type {PostMeta} from '@/lib/blog';

interface FeaturedSliderProps {
  posts: PostMeta[];
  locale: string;
}

export function FeaturedSlider({posts, locale}: FeaturedSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(posts.length);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const draggableRef = useRef<Draggable[]>([]);
  const preloaderDone = usePreloaderDone();

  const getCardWidth = useCallback(() => {
    if (!containerRef.current) return 400;
    const containerWidth = containerRef.current.offsetWidth;
    const gap = 24;
    // Mobile: full width - 16px peek; Tablet: 2 cards; Desktop: 3 cards
    if (containerWidth < 768) return containerWidth - 16;
    if (containerWidth < 1024) return (containerWidth - gap) / 2;
    return (containerWidth - gap * 2) / 3;
  }, []);

  // Initialize Draggable
  useGSAP(() => {
    if (!trackRef.current || !containerRef.current || !preloaderDone) return;

    const gap = 24;
    const cardWidth = getCardWidth();
    const maxX = 0;
    const minX = -(posts.length - 1) * (cardWidth + gap);

    // Clean up existing Draggable instances
    draggableRef.current.forEach(d => d.kill());

    const snapPoints = posts.map((_, i) => -(i * (cardWidth + gap)));

    draggableRef.current = Draggable.create(trackRef.current, {
      type: 'x',
      bounds: {minX, maxX},
      inertia: true,
      snap: snapPoints,
      onDrag: function() {
        const x = this.x;
        const idx = Math.round(Math.abs(x) / (cardWidth + gap));
        setActiveIndex(Math.min(idx, posts.length - 1));
      },
      onThrowUpdate: function() {
        const x = this.x;
        const idx = Math.round(Math.abs(x) / (cardWidth + gap));
        setActiveIndex(Math.min(idx, posts.length - 1));
      },
      onThrowComplete: function() {
        const x = this.x;
        const idx = Math.round(Math.abs(x) / (cardWidth + gap));
        setActiveIndex(Math.min(idx, posts.length - 1));
      },
    });

    // Entrance animation — reveal cards with stagger
    const cards = trackRef.current.querySelectorAll('.slider-card');
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      filter: 'blur(4px)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      draggableRef.current.forEach(d => d.kill());
    };
  }, {scope: containerRef, dependencies: [preloaderDone, posts.length]});

  // Auto-play: advance every 5 seconds
  useEffect(() => {
    if (!preloaderDone || posts.length <= 1) return;

    const startAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        if (pausedRef.current) return;
        setActiveIndex(prev => {
          const next = prev >= posts.length - 1 ? 0 : prev + 1;
          goToSlide(next);
          return next;
        });
      }, 5000);
    };

    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [preloaderDone, posts.length]);

  const goToSlide = useCallback((index: number) => {
    if (!trackRef.current) return;
    const gap = 24;
    const cardWidth = getCardWidth();
    const targetX = -(index * (cardWidth + gap));
    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [getCardWidth]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
    goToSlide(index);
    // Pause auto-play for 3 seconds after manual interaction
    pausedRef.current = true;
    setTimeout(() => { pausedRef.current = false; }, 3000);
  }, [goToSlide]);

  const handleMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => { pausedRef.current = false; }, 3000);
  }, []);

  // Handle window resize: recalculate position
  useEffect(() => {
    const handleResize = () => {
      goToSlide(activeIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, goToSlide]);

  if (posts.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex cursor-grab active:cursor-grabbing"
          style={{gap: '24px'}}
        >
          {posts.map((post, i) => (
            <div
              key={post.slug}
              className="slider-card flex-shrink-0"
              style={{
                width: `calc((100% - 48px) / 3)`,
              }}
            >
              <BlogCard post={post} locale={locale} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {posts.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === i ? '24px' : '8px',
                backgroundColor: activeIndex === i
                  ? 'var(--greige-900)'
                  : 'var(--greige-300)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
