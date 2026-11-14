import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/useAudio';

// Color map for satin/foil balloons
const BALLOON_PALETTES = {
  'dusty-rose': {
    bg: 'radial-gradient(ellipse at 29% 18%, rgba(255,244,249,0.95) 0%, rgba(255,220,232,0.3) 7%, transparent 23%), radial-gradient(ellipse at 38% 36%, #E8ADB9 0%, #A94E67 46%, #4B1727 100%)',
    border: 'rgba(212, 165, 171, 0.4)',
    string: 'rgba(212, 165, 171, 0.6)',
    glow: 'rgba(142, 90, 99, 0.3)'
  },
  'champagne': {
    bg: 'radial-gradient(ellipse at 29% 18%, rgba(255,255,247,0.98) 0%, rgba(255,244,218,0.35) 8%, transparent 24%), radial-gradient(ellipse at 40% 36%, #FFF0CC 0%, #C9A064 48%, #67472D 100%)',
    border: 'rgba(201, 169, 138, 0.5)',
    string: 'rgba(201, 169, 138, 0.65)',
    glow: 'rgba(201, 169, 138, 0.35)'
  },
  'burgundy': {
    bg: 'radial-gradient(ellipse at 28% 17%, rgba(255,226,239,0.88) 0%, rgba(247,174,197,0.28) 7%, transparent 23%), radial-gradient(ellipse at 40% 34%, #9E3857 0%, #59172F 50%, #1D0914 100%)',
    border: 'rgba(140, 64, 78, 0.4)',
    string: 'rgba(140, 64, 78, 0.6)',
    glow: 'rgba(90, 41, 54, 0.4)'
  },
  'cream': {
    bg: 'radial-gradient(ellipse at 29% 18%, rgba(255,255,255,1) 0%, rgba(255,255,250,0.42) 8%, transparent 24%), radial-gradient(ellipse at 40% 37%, #FFF9EF 0%, #D9C6AA 52%, #70604D 100%)',
    border: 'rgba(239, 228, 213, 0.6)',
    string: 'rgba(239, 228, 213, 0.7)',
    glow: 'rgba(239, 228, 213, 0.25)'
  },
  'blush': {
    bg: 'radial-gradient(ellipse at 29% 18%, rgba(255,248,249,0.96) 0%, rgba(255,220,224,0.32) 8%, transparent 24%), radial-gradient(ellipse at 40% 38%, #F2C2C8 0%, #BD737F 48%, #63323E 100%)',
    border: 'rgba(216, 176, 183, 0.5)',
    string: 'rgba(216, 176, 183, 0.65)',
    glow: 'rgba(216, 176, 183, 0.3)'
  },
  'wine': {
    bg: 'radial-gradient(ellipse at 29% 18%, rgba(255,221,228,0.78) 0%, rgba(255,180,197,0.24) 7%, transparent 23%), radial-gradient(ellipse at 40% 36%, #702139 0%, #3B1426 52%, #130810 100%)',
    border: 'rgba(107, 41, 56, 0.4)',
    string: 'rgba(107, 41, 56, 0.55)',
    glow: 'rgba(59, 22, 32, 0.4)'
  },
  violet: {
    bg: 'radial-gradient(ellipse at 29% 18%, rgba(255,244,255,0.9) 0%, rgba(223,190,255,0.3) 8%, transparent 24%), radial-gradient(ellipse at 40% 36%, #9E83BE 0%, #594069 50%, #211526 100%)',
    border: 'rgba(173, 146, 207, 0.45)',
    string: 'rgba(197, 171, 225, 0.65)',
    glow: 'rgba(137, 100, 177, 0.25)'
  }
};

const BALLOON_SHAPES = [
  'balloon-shape-classic',
  'balloon-shape-round',
  'balloon-shape-oval',
  'balloon-shape-pear'
];

const Balloon = ({
  id,
  left = 50,
  top = 'auto',
  delay = 0,
  duration = 6,
  wish = '',
  color = 'champagne',
  depth = 'mg', // 'bg' | 'mg' | 'fg'
  onPop
}) => {
  const { playPop } = useAudio();
  const [isPopped, setIsPopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const popTimer = useRef(null);

  useEffect(() => () => {
    if (popTimer.current) window.clearTimeout(popTimer.current);
  }, []);

  const palette = BALLOON_PALETTES[color] || BALLOON_PALETTES.champagne;

  // Depth styling configuration
  const depthConfig = {
    bg: {
      scale: 0.65,
      blur: 'blur(2.5px)',
      opacity: 0.6,
      zIndex: 5,
      width: 'w-12 sm:w-16 md:w-20',
      height: 'h-32 sm:h-36 md:h-40'
    },
    mg: {
      scale: 1,
      blur: 'blur(0px)',
      opacity: 0.95,
      zIndex: 15,
      width: 'w-16 sm:w-20 md:w-28',
      height: 'h-40 sm:h-44 md:h-48'
    },
    fg: {
      scale: 1.3,
      blur: 'blur(3.5px)',
      opacity: 0.75,
      zIndex: 25,
      width: 'w-20 sm:w-24 md:w-36',
      height: 'h-48 sm:h-52 md:h-60'
    }
  }[depth] || {};

  const variation = Number.isFinite(id) ? Math.abs(id) : 0;
  const balloonShape = BALLOON_SHAPES[variation % BALLOON_SHAPES.length];
  const scaleVariation = [0.94, 1.04, 0.98, 1.08][variation % 4];
  const balloonScale = depthConfig.scale * scaleVariation;
  const interactive = Boolean(wish && onPop);
  const floatRange = 11 + (variation % 5) * 2;
  const sway = 4 + (variation % 4) * 1.8;
  const rotation = (variation % 2 ? 1 : -1) * (1.2 + (variation % 3) * 0.55);

  const handleClick = (e) => {
    if (isPopped) return;
    setIsPopped(true);
    playPop();
    
    // Spawn glowing particle burst
    const spawnCount = 12;
    const trails = Array.from({ length: spawnCount }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: -50 - Math.random() * 120,
      scale: 0.4 + Math.random() * 0.6,
      rotate: (Math.random() - 0.5) * 180,
      delay: Math.random() * 0.1
    }));
    setParticles(trails);

    if (onPop) {
      const rect = e.currentTarget.getBoundingClientRect();
      const stage = e.currentTarget.closest('[data-balloon-stage]');
      if (!stage) {
        console.error('Interactive balloons must be rendered inside a balloon stage.');
        return;
      }
      const stageRect = stage.getBoundingClientRect();
      const x = rect.left - stageRect.left + rect.width / 2;
      const y = rect.top - stageRect.top + rect.height / 2;

      popTimer.current = window.setTimeout(() => {
        onPop(id, wish, x, y);
      }, 1250);
    }
  };

  return (
    <div 
      style={{
        left: `${left}%`,
        transform: 'translateX(-50%)',
        top: top !== 'auto' ? top : undefined,
        zIndex: depthConfig.zIndex
      }}
      className={`absolute bottom-0 ${depthConfig.width} ${depthConfig.height} select-none ${depth === 'mg' ? 'flex' : 'hidden sm:flex'}`}
    >
      <AnimatePresence>
        {!isPopped && (
          <motion.button
            type="button"
            onClick={interactive ? handleClick : undefined}
            disabled={!interactive}
            aria-hidden={!interactive}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            aria-label={wish ? `Pop balloon to reveal: ${wish}` : 'Pop decorative balloon'}
            whileTap={interactive ? { scale: balloonScale * 0.9 } : undefined}
            initial={{ y: 200, opacity: 0 }}
            animate={{
              y: [0, -floatRange, -floatRange * 0.42, 0],
              rotate: [0, rotation, -rotation * 0.72, 0],
              x: [0, sway, -sway * 0.7, 0],
              opacity: depthConfig.opacity,
              scale: isHovered ? balloonScale * 1.06 : balloonScale
            }}
            exit={{
              scale: [depthConfig.scale, depthConfig.scale * 1.35, 0],
              opacity: 0,
              filter: 'blur(6px)'
            }}
            transition={{
              y: {
                duration: duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay,
              },
              rotate: {
                duration: duration * (1.1 + (variation % 3) * 0.08),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.3,
              },
              x: {
                duration: duration * (1.35 + (variation % 2) * 0.12),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.5,
              },
              opacity: { duration: 1.2, delay: delay },
              scale: { type: 'spring', stiffness: 280, damping: 20 }
            }}
            style={{
              filter: depthConfig.blur,
              transformOrigin: 'bottom center'
            }}
            className={`balloon-button w-full h-full relative group flex flex-col items-center justify-center border-0 bg-transparent p-0 ${
              interactive
                ? 'cursor-pointer pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold'
                : 'pointer-events-none'
            }`}
          >
            <div 
              className={`balloon-body ${balloonShape} relative w-full h-[58%] overflow-hidden border border-white/20 shadow-[0_18px_40px_rgba(0,0,0,0.42)]`}
              style={{
                background: palette.bg,
                borderColor: palette.border,
                boxShadow: `0 18px 38px rgba(0,0,0,0.38), 0 0 18px ${palette.glow}, inset 0 -12px 24px rgba(12,4,10,0.46), inset 5px 2px 12px rgba(255,255,255,0.18)`
              }}
            >
              <span className="balloon-specular" />
              <span className="balloon-reflection" />
              <span className="balloon-rim-light" />
              <span className="balloon-bottom-shade" />

              {/* Wish Heart Emblem (only visible on Midground Interactive Balloons) */}
              {depth === 'mg' && wish && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-4 h-4 text-parchment/90 group-hover:text-gold transition-colors"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <span className="balloon-neck" style={{ backgroundColor: palette.border }} />
            <span className="balloon-knot" style={{ backgroundColor: palette.border }} />

            <svg
              viewBox="0 0 96 58"
              aria-hidden="true"
              className="balloon-string -mt-px h-14 w-[72%] overflow-visible pointer-events-none"
              style={{ transformOrigin: 'top center' }}
            >
              <motion.path
                d="M 48 0 C 58 14 39 28 49 43 C 54 49 52 54 49 58"
                animate={{ rotate: [rotation * 1.1, -rotation * 1.25, rotation * 1.1] }}
                transition={{
                  duration: duration * 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay
                }}
                style={{ transformOrigin: '48px 0' }}
                stroke={palette.string}
                strokeWidth="1.4"
                fill="transparent"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pop Sparkle Particles */}
      {isPopped && particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale, rotate: p.rotate }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: p.delay }}
          className="absolute top-1/2 left-1/2 z-40 pointer-events-none"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill={palette.border}
            className="drop-shadow-[0_0_8px_rgba(201,169,138,0.8)]"
          >
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default Balloon;
