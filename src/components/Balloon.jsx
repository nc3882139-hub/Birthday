import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

// Color map for satin/foil balloons
const BALLOON_PALETTES = {
  'dusty-rose': {
    bg: 'radial-gradient(circle at 32% 28%, #D4A5AB 0%, #8E5A63 55%, #5A2936 90%)',
    border: 'rgba(212, 165, 171, 0.4)',
    string: 'rgba(212, 165, 171, 0.6)',
    glow: 'rgba(142, 90, 99, 0.3)'
  },
  'champagne': {
    bg: 'radial-gradient(circle at 32% 28%, #FAF0E4 0%, #C9A98A 55%, #8C6F51 90%)',
    border: 'rgba(201, 169, 138, 0.5)',
    string: 'rgba(201, 169, 138, 0.65)',
    glow: 'rgba(201, 169, 138, 0.35)'
  },
  'burgundy': {
    bg: 'radial-gradient(circle at 32% 28%, #8C404E 0%, #5A2936 55%, #2D1118 90%)',
    border: 'rgba(140, 64, 78, 0.4)',
    string: 'rgba(140, 64, 78, 0.6)',
    glow: 'rgba(90, 41, 54, 0.4)'
  },
  'cream': {
    bg: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #EFE4D5 60%, #C9A98A 90%)',
    border: 'rgba(239, 228, 213, 0.6)',
    string: 'rgba(239, 228, 213, 0.7)',
    glow: 'rgba(239, 228, 213, 0.25)'
  },
  'blush': {
    bg: 'radial-gradient(circle at 32% 28%, #FBEBEB 0%, #D8B0B7 55%, #8E5A63 90%)',
    border: 'rgba(216, 176, 183, 0.5)',
    string: 'rgba(216, 176, 183, 0.65)',
    glow: 'rgba(216, 176, 183, 0.3)'
  },
  'wine': {
    bg: 'radial-gradient(circle at 32% 28%, #6B2938 0%, #3B1620 60%, #1A090D 95%)',
    border: 'rgba(107, 41, 56, 0.4)',
    string: 'rgba(107, 41, 56, 0.55)',
    glow: 'rgba(59, 22, 32, 0.4)'
  }
};

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
  const { playTick } = useAudio();
  const [isPopped, setIsPopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const popTimer = useRef(null);

  useEffect(() => () => {
    if (popTimer.current) window.clearTimeout(popTimer.current);
  }, []);

  const palette = BALLOON_PALETTES[color] || BALLOON_PALETTES['champagne'];

  // Depth styling configuration
  const depthConfig = {
    bg: {
      scale: 0.65,
      blur: 'blur(2.5px)',
      opacity: 0.6,
      zIndex: 5,
      width: 'w-12 sm:w-16 md:w-20',
      height: 'h-20 sm:h-24 md:h-28'
    },
    mg: {
      scale: 1,
      blur: 'blur(0px)',
      opacity: 0.95,
      zIndex: 15,
      width: 'w-16 sm:w-20 md:w-28',
      height: 'h-24 sm:h-28 md:h-36'
    },
    fg: {
      scale: 1.3,
      blur: 'blur(3.5px)',
      opacity: 0.75,
      zIndex: 25,
      width: 'w-20 sm:w-24 md:w-36',
      height: 'h-28 sm:h-32 md:h-48'
    }
  }[depth] || {};

  const handleClick = (e) => {
    if (isPopped) return;
    setIsPopped(true);
    playTick();
    
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
      const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
      const x = rect.left - parentRect.left + rect.width / 2;
      const y = rect.top - parentRect.top;

      popTimer.current = window.setTimeout(() => {
        onPop(id, wish, x, y);
      }, 350);
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
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={wish ? `Pop balloon to reveal: ${wish}` : 'Pop decorative balloon'}
            initial={{ y: 200, opacity: 0 }}
            animate={{
              y: [0, -16, 0],
              rotate: [0, 2, -1.5, 0],
              x: [0, 8, -6, 0],
              opacity: depthConfig.opacity,
              scale: isHovered ? (depthConfig.scale * 1.08) : depthConfig.scale
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
                duration: duration * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.3,
              },
              x: {
                duration: duration * 1.4,
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
            className="w-full h-full cursor-pointer relative group flex flex-col items-center justify-center pointer-events-auto border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            {/* Realistic Elliptical Satin Balloon Body */}
            <div 
              className="w-full h-[88%] rounded-t-[50%] rounded-b-[45%] relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 transition-shadow duration-500 overflow-hidden"
              style={{
                background: palette.bg,
                borderColor: palette.border,
                boxShadow: `0 20px 45px rgba(0,0,0,0.45), 0 0 25px ${palette.glow}, inset 0 -8px 20px rgba(0,0,0,0.3)`
              }}
            >
              {/* Primary Top-Left Specular Light Highlight */}
              <div className="absolute top-[8%] left-[18%] w-[32%] h-[20%] bg-gradient-to-b from-white/60 to-white/0 rounded-full blur-[1px] rotate-[-22deg] pointer-events-none" />
              
              {/* Secondary Soft Rim Reflection */}
              <div className="absolute top-[12%] right-[10%] w-[18%] h-[40%] bg-gradient-to-l from-white/30 to-transparent rounded-full blur-[2px] pointer-events-none" />

              {/* Bottom Rim Ambient Shadow */}
              <div className="absolute bottom-0 inset-x-0 h-[25%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

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

            {/* Balloon Knot Base */}
            <div 
              className="w-3.5 h-2.5 rounded-b-sm border-t border-white/20 -mt-0.5 shadow-sm"
              style={{ backgroundColor: palette.border }}
            />

            {/* Swaying Ribbon String */}
            <svg 
              className="w-24 h-24 overflow-visible pointer-events-none -mt-0.5"
              style={{ transformOrigin: 'top center' }}
            >
              <motion.path
                d="M 48 0 Q 56 30 48 60 Q 40 90 48 110"
                animate={{ rotate: [2, -2, 2] }}
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
