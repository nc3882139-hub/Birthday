import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxTilt from '../components/ParallaxTilt';
import giftBoxImg from '../assets/images/gift-box.png';
import { useAudio } from '../context/AudioContext';

const GiftReveal = ({ onOpenComplete }) => {
  const { playTick } = useAudio();
  const [isOpening, setIsOpening] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleOpenGift = () => {
    if (isOpening) return;
    playTick();
    setIsOpening(true);

    // After 1 second, trigger the white flash screen
    setTimeout(() => {
      setShowFlash(true);
    }, 1000);

    // After 2 seconds, trigger the callback to load the story
    setTimeout(() => {
      onOpenComplete();
    }, 2000);
  };

  const handleSkip = () => {
    playTick();
    onOpenComplete();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background radial gradient shadows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,15,16,0.2)_0%,rgba(12,15,16,0.95)_100%)] z-0 pointer-events-none" />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop text-center"
      >
        {/* Celebration Header */}
        <div className="mb-12 mt-12 md:mt-0 select-none">
          <motion.h1 
            initial={{ letterSpacing: '0.01em', opacity: 0 }}
            animate={{ letterSpacing: '0.04em', opacity: 1 }}
            transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
            className="font-display-lg text-4xl md:text-display-lg text-secondary text-shimmer mb-6 leading-tight drop-shadow-[0_0_30px_rgba(239,192,86,0.4)]"
          >
            A Surprise Awaits You
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body-lg text-lg md:text-body-lg text-on-surface-variant/85 max-w-2xl mx-auto tracking-[0.12em] leading-relaxed"
          >
            Step into a cinematic journey crafted just for you.
          </motion.p>
        </div>

        {/* Gift Box Interactive Container */}
        <div
          onClick={handleOpenGift}
          onMouseEnter={playTick}
          className="relative w-full max-w-lg mb-12 group cursor-pointer"
        >
          {/* Ambient Outer Gold Halo Glow */}
          <div className="absolute inset-[-10%] bg-[radial-gradient(circle,rgba(239,192,86,0.18)_0%,transparent_70%)] rounded-full blur-3xl opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 pointer-events-none" />

          {/* 3D Parallax Tilt Wrap */}
          <ParallaxTilt maxRotation={12} scale={1.04}>
            <motion.div
              animate={isOpening ? { scale: 1.08, y: -15, filter: 'brightness(1.5) blur(1px)' } : { scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-surface-container-high/10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.05)] z-10"
            >
              {/* Gold double light edge overlay */}
              <div className="absolute inset-0 border-2 border-secondary/15 rounded-2xl pointer-events-none z-30 group-hover:border-secondary/35 transition-colors duration-500" />

              <div className="aspect-[1.6/1] relative">
                <img
                  src={giftBoxImg}
                  alt="A premium gift box with golden ribbon"
                  className="w-full h-full object-cover select-none transition-all duration-700 group-hover:scale-103 brightness-95"
                  style={{ transform: 'translateZ(-15px)' }}
                />

                {/* Sparkle radial glow on click */}
                <motion.div
                  animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 bg-[radial-gradient(circle,rgba(239,192,86,0.9)_0%,transparent_60%)] mix-blend-screen pointer-events-none z-20"
                />
              </div>
            </motion.div>
          </ParallaxTilt>

          {/* Bounce Indicator Cue */}
          {!isOpening && (
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 border border-secondary/40 text-secondary shadow-[0_0_15px_rgba(239,192,86,0.3)] pointer-events-none group-hover:bg-secondary/25 transition-colors z-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.3 2.1-.8 2.1-1.74 0-1.38-1.79-2.5-4-2.5s-4 1.12-4 2.5c0 .94.89 1.44 2 1.74zm9.85 2.6c-.34-.78-1.22-1.12-1.99-.78l-1.86.83V7.5c0-1.93-1.57-3.5-3.5-3.5S8 5.57 8 7.5v8.78l-2.68-.56c-.84-.18-1.71.27-2.07 1.05-.37.8-.1 1.75.64 2.23l4.73 3.03c.89.57 1.95.88 3.03.88h4.69c1.93 0 3.5-1.57 3.5-3.5v-4.14c0-.62-.35-1.19-.91-1.44l-1.08-.49z" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col items-center gap-6 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenGift}
            disabled={isOpening}
            className="px-10 py-4.5 rounded-full border border-secondary/50 text-secondary bg-secondary/5 font-label-md text-label-md hover:bg-secondary hover:text-on-secondary hover:shadow-[0_0_35px_rgba(239,192,86,0.45)] transition-all duration-300 flex items-center gap-3.5 select-none btn-sheen cursor-pointer"
          >
            {isOpening ? 'Opening Surprise...' : 'Open My Gift'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.5 2.5 0 0 0-5-0.5c0 .08.01.15.02.23L12 5.5l-1.02-.77c.01-.08.02-.15.02-.23a2.5 2.5 0 0 0-5-0.5c0 .35.07.69.18 1H4a2 2 0 0 0-2 2v3c0 .8.5 1.47 1.22 1.78L3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2l-.22-7.22C21.5 12.47 22 11.8 22 11V8a2 2 0 0 0-2-2zM9 13H5v-2h4v2zm10 0h-4v-2h4v2z" />
            </svg>
          </motion.button>
          
          <button
            onClick={handleSkip}
            disabled={isOpening}
            className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:border-secondary transition-all border-b border-transparent pb-1.5 opacity-70 hover:opacity-100 select-none bg-transparent cursor-pointer tracking-wider"
          >
            Skip to Story
          </button>
        </div>
      </motion.main>

      {/* Screen White Flash transition */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-white z-[1000] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftReveal;
