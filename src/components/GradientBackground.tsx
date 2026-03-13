"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const GradientBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const backgroundGradient = useTransform(
    [smoothX, smoothY],
    (input) => {
      const [x, y] = input;
      return `radial-gradient(circle at ${x}% ${y}%, #0f0c29, #302b63, #24243e)`;
    }
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: backgroundGradient,
      }}
    >
      {/* Lớp grain (tuỳ chọn) */}
      <div className="absolute inset-0 opacity-10 mix-blend-soft-light pointer-events-none" />
</motion.div>
  );
};

export default GradientBackground;
