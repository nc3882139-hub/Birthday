import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

const Balloon = ({ id, left, delay, duration, wish, onPop }) => {
  const { playTick } = useAudio();
  const [isPopped, setIsPopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [butterflies, setButterflies] = useState([]);

  const handleClick = (e) => {
    if (isPopped) return;
    setIsPopped(true);
    
    // Play quick damp click sound to simulate popping
    playTick();
    
    // Spawn butterfy particle trail at click coordinates
    const spawnCount = 10;
    const trails = Array.from({ length: spawnCount }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 150,
      y: -60 - Math.random() * 120,
      scale: 0.3 + Math.random() * 0.7,
      rotate: (Math.random() - 0.5) * 180,
      delay: Math.random() * 0.12
    }));
    setButterflies(trails);

    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    
    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top;

    // After popping animation completes, reveal the wish card
    setTimeout(() => {
      onPop(id, wish, x, y);
    }, 400);
  };

  return (
    <div 
      style={{ left: `${left}%` }}
      className="absolute bottom-0 z-10 w-24 h-32"
    >
      <AnimatePresence>
        {!isPopped && (
          <motion.div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ y: 380, opacity: 0, scale: 0.95 }}
            animate={{
              y: [0, -18, 0],
              opacity: 1,
              scale: isHovered ? 1.08 : 1
            }}
            exit={{
              scale: [1, 1.3, 0],
              opacity: 0,
              filter: 'blur(5px)'
            }}
            transition={{
              y: {
                duration: duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay,
              },
              opacity: { duration: 1.2, delay: delay },
              scale: { type: 'spring', stiffness: 300, damping: 18 }
            }}
            className="w-full h-full rounded-t-[52%] rounded-b-[42%] cursor-pointer relative shadow-[0_18px_50px_rgba(0,0,0,0.35)] border border-[#efc05633] bg-gradient-to-tr from-white/10 via-[#fff3d8]/20 to-white/10 backdrop-blur-sm group flex items-center justify-center overflow-visible"
          >
            {/* Top reflective specular highlight */}
            <div className="absolute top-2 left-6 w-10 h-5 bg-white/20 rounded-full blur-[1.5px] rotate-[-18deg] pointer-events-none" />
            <div className="absolute right-0 top-5 w-16 h-8 rounded-full bg-white/10 blur-[1.8px] pointer-events-none" />
            
            {/* Inner secondary gold border glow */}
            <div className="absolute inset-1.5 rounded-[inherit] border border-[#efc05622] shadow-[0_0_24px_rgba(239,192,86,0.15)] pointer-events-none" />

            {/* Glowing heart seal inside */}
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/25 shadow-[0_0_16px_rgba(239,192,86,0.25)] group-hover:bg-secondary/20 transition-colors duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-4 h-4 text-secondary/70 group-hover:text-secondary group-hover:scale-110 transition-all duration-300"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Swaying physical string vector */}
            <svg 
              className="absolute top-[98%] left-1/2 -translate-x-1/2 w-28 h-28 overflow-visible pointer-events-none"
              style={{ transformOrigin: 'top center' }}
            >
              <motion.path
                d="M 48 0 Q 48 32 48 62"
                animate={{
                  d: [
                    "M 48 0 Q 56 32 48 62",
                    "M 48 0 Q 40 32 48 62",
                    "M 48 0 Q 56 32 48 62"
                  ]
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay
                }}
                stroke="rgba(239, 192, 86, 0.5)"
                strokeWidth="1.6"
                fill="transparent"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop Particle Sparkles (glowing butterflies) */}
      {isPopped && butterflies.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: b.x, y: b.y, opacity: 0, scale: b.scale, rotate: b.rotate }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: b.delay }}
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
        >
          {/* Beautiful glowing butterfly SVG path */}
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="#efc056" 
            className="drop-shadow-[0_0_8px_rgba(239,192,86,0.9)]"
          >
            <path d="M12 10C11.5 6.5 8 5 6 5c-2 0-4 1.5-4 4 0 3 2.5 5 6 6 1.5.5 2.5 1 4 2 1.5-1 2.5-1.5 4-2 3.5-1 6-3 6-6 0-2.5-2-4-4-4-2 0-5.5 1.5-6 5z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default Balloon;
