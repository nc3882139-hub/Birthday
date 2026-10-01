import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const ParallaxTilt = ({ children, maxRotation = 10, scale = 1.03, className = '' }) => {
  const ref = useRef(null);

  // Core coordinates relative to element dimensions (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for 60 FPS deceleration
  const springConfig = { damping: 28, stiffness: 90, mass: 0.7 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxRotation, -maxRotation]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxRotation, maxRotation]), springConfig);
  const componentScale = useSpring(1, springConfig);

  // Magnetic drift translation (card moves slightly toward the cursor)
  const driftX = useSpring(useTransform(x, [0, 1], [-10, 10]), springConfig);
  const driftY = useSpring(useTransform(y, [0, 1], [-10, 10]), springConfig);

  // Reflection glare movement
  const glareX = useSpring(useTransform(x, [0, 1], ['-35%', '35%']), springConfig);
  const glareY = useSpring(useTransform(y, [0, 1], ['-35%', '35%']), springConfig);
  const glareOpacity = useSpring(useTransform(x, [0, 0.5, 1], [0.2, 0.02, 0.2]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    componentScale.set(scale);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    componentScale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        x: driftX,
        y: driftY,
        scale: componentScale,
        transformStyle: 'preserve-3d',
      }}
      className={`perspective-1000 relative ${className}`}
    >
      <div 
        style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }} 
        className="h-full w-full relative overflow-hidden rounded-[inherit]"
      >
        {children}
        
        {/* Dynamic Light Reflection Sheen (Glare) */}
        <motion.div
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%)',
            left: glareX,
            top: glareY,
            opacity: glareOpacity,
          }}
          className="absolute inset-[-50%] pointer-events-none z-30 mix-blend-overlay"
        />
      </div>
    </motion.div>
  );
};

export default ParallaxTilt;
