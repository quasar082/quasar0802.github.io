'use client';

import {useRef, useState, useEffect} from 'react';
import WaterRippleEffect from '@/components/ui/water-ripple-effect';

interface WaterRippleImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Aspect ratio string like "16/9", "3/4", etc. Overrides natural aspect ratio */
  aspectRatio?: string;
  /** Wave/ripple tuning */
  waveIntensity?: number;
  rippleIntensity?: number;
  animationSpeed?: number;
  hoverRippleMultiplier?: number;
}

export function WaterRippleImage({
  src,
  alt,
  className = '',
  style,
  loading,
  fetchPriority,
  aspectRatio,
  waveIntensity = 0.004,
  rippleIntensity = 0.008,
  animationSpeed = 0.8,
  hoverRippleMultiplier = 3.0,
}: WaterRippleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [isVisible, setIsVisible] = useState(loading === 'eager');

  // Measure container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({width: Math.round(rect.width), height: Math.round(rect.height)});
      }
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Lazy loading: observe intersection
  useEffect(() => {
    if (loading === 'eager' || isVisible) return;

    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      {rootMargin: '200px'}
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, isVisible]);

  const mergedStyle: React.CSSProperties = {
    ...style,
    aspectRatio: aspectRatio || style?.aspectRatio,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={mergedStyle}
      role="img"
      aria-label={alt}
    >
      {isVisible && dimensions.width > 0 && dimensions.height > 0 ? (
        <WaterRippleEffect
          imageSrc={src}
          width={dimensions.width}
          height={dimensions.height}
          waveIntensity={waveIntensity}
          rippleIntensity={rippleIntensity}
          animationSpeed={animationSpeed}
          hoverRippleMultiplier={hoverRippleMultiplier}
          scale={1.0}
          containerClassName="w-full h-full"
          className="w-full h-full"
        />
      ) : (
        // Fallback / placeholder while loading
        <div className="w-full h-full bg-surface-elevated" />
      )}
    </div>
  );
}
