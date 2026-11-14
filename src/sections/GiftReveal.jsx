import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxTilt from '../components/ParallaxTilt';
import Balloon from '../components/Balloon';
import giftBoxImg from '../assets/images/gift-box.webp';
import { useAudio } from '../context/useAudio';
import MusicControls from '../components/MusicControls';
import { birthdayContent } from '../content/birthdayContent';

const GiftReveal = ({ onOpenComplete }) => {
  const { playTick, startMusic } = useAudio();
  const [isOpening, setIsOpening] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => {
    timers.current.forEach(window.clearTimeout);
  }, []);

  const handleOpenGift = () => {
    if (isOpening) return;
    playTick();
    void startMusic();
    setIsOpening(true);

    timers.current.push(window.setTimeout(() => {
      setShowFlash(true);
    }, 1150));

    timers.current.push(window.setTimeout(() => {
      onOpenComplete();
    }, 2200));
  };

  const handleSkip = () => {
    playTick();
    onOpenComplete();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-midnight">
      {/* Radial vignetting overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(36,21,27,0.1)_0%,rgba(18,13,16,0.95)_100%)] z-0 pointer-events-none" />

      {/* Decorative framing balloons around the hero (hidden on small mobile to keep focus centered) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5 hidden md:block">
        <Balloon id={101} left={7} delay={0.2} duration={8} color="champagne" depth="bg" />
        <Balloon id={102} left={93} delay={0.8} duration={8.5} color="burgundy" depth="bg" />
      </div>

      {/* Main Hero Content */}
      <motion.main
        aria-labelledby="gift-title"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop text-center max-w-4xl mx-auto"
      >
        {/* Editorial Eyebrow & Headline */}
        <div className="mb-10 select-none">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.15em' }}
            animate={{ opacity: 0.8, letterSpacing: '0.25em' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-label-md text-xs md:text-label-md uppercase text-gold tracking-[0.25em] mb-4"
          >
            A Birthday Keepsake for {birthdayContent.recipient}
          </motion.p>
          <motion.h1
            id="gift-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-parchment text-shimmer mb-4 leading-tight drop-shadow-md font-semibold"
          >
            A Little Something,<br />Just For You
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-script text-2xl md:text-3xl text-gold/90 max-w-xl mx-auto tracking-wide leading-relaxed"
          >
            Some moments deserve to be celebrated differently.
          </motion.p>
        </div>

        {/* Interactive 3D Gift Box Card */}
        <div className="relative w-full max-w-md mb-10 group">
          {/* Subtle Champagne Light Glow */}
          <div className="absolute inset-[-12%] bg-[radial-gradient(circle,rgba(201,169,138,0.2)_0%,transparent_70%)] rounded-full blur-3xl opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 pointer-events-none" />

          {/* 3D Parallax Tilt Card */}
          <ParallaxTilt maxRotation={10} scale={1.03}>
            <motion.button
              type="button"
              onClick={handleOpenGift}
              disabled={isOpening}
              aria-label="Open your birthday gift"
              animate={isOpening ? { scale: 1.04, y: -8, rotateX: -7, filter: 'brightness(1.25)' } : { scale: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative block w-full rounded-3xl overflow-hidden border border-gold/20 bg-wine-dark/40 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] z-10 cursor-pointer disabled:cursor-wait"
            >
              {/* Gold double light edge overlay */}
              <div className="absolute inset-0 border border-gold/25 rounded-3xl pointer-events-none z-30 group-hover:border-gold/50 transition-colors duration-500" />

              <div className="aspect-[1.5/1] relative">
                <img
                  src={giftBoxImg}
                  alt="A luxury gift box with ribbon details"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover select-none transition-all duration-700 group-hover:scale-105 brightness-95"
                  style={{ transform: 'translateZ(-15px)' }}
                />

                {/* Light burst overlay on click */}
                <motion.div
                  animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 bg-[radial-gradient(circle,rgba(248,243,236,0.95)_0%,transparent_70%)] mix-blend-screen pointer-events-none z-20"
                />
              </div>
            </motion.button>
          </ParallaxTilt>

          <div className="absolute inset-0 pointer-events-none z-20 overflow-visible" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={isOpening ? {
                  opacity: [0, 0.9, 0],
                  scale: [0.2, 1, 0.4],
                  x: (index % 2 ? 1 : -1) * (28 + (index % 4) * 22),
                  y: -70 - (index % 5) * 24,
                } : {}}
                transition={{ duration: 1.25, delay: (index % 5) * 0.05, ease: 'easeOut' }}
                style={{
                  left: `${18 + ((index * 17) % 64)}%`,
                  top: `${38 + ((index * 13) % 38)}%`,
                }}
                className="absolute w-1 h-1 rounded-full bg-gold shadow-[0_0_14px_rgba(201,169,138,0.9)]"
              />
            ))}
          </div>

          {/* Bounce Indicator Cue */}
          {!isOpening && (
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-midnight/80 border border-gold/40 text-gold shadow-[0_0_20px_rgba(201,169,138,0.3)] pointer-events-none group-hover:bg-gold group-hover:text-midnight transition-colors z-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.3 2.1-.8 2.1-1.74 0-1.38-1.79-2.5-4-2.5s-4 1.12-4 2.5c0 .94.89 1.44 2 1.74zm9.85 2.6c-.34-.78-1.22-1.12-1.99-.78l-1.86.83V7.5c0-1.93-1.57-3.5-3.5-3.5S8 5.57 8 7.5v8.78l-2.68-.56c-.84-.18-1.71.27-2.07 1.05-.37.8-.1 1.75.64 2.23l4.73 3.03c.89.57 1.95.88 3.03.88h4.69c1.93 0 3.5-1.57 3.5-3.5v-4.14c0-.62-.35-1.19-.91-1.44l-1.08-.49z" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-5 z-20">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenGift}
            disabled={isOpening}
            className="px-9 py-4 rounded-full border border-gold/40 text-parchment bg-gold/10 font-label-md text-xs md:text-sm tracking-[0.15em] uppercase hover:bg-gold hover:text-midnight hover:shadow-[0_0_35px_rgba(201,169,138,0.4)] transition-all duration-300 flex items-center gap-3 select-none btn-sheen cursor-pointer"
          >
            {isOpening ? 'Unfolding Surprise...' : 'Open Your Gift'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.5 2.5 0 0 0-5-0.5c0 .08.01.15.02.23L12 5.5l-1.02-.77c.01-.08.02-.15.02-.23a2.5 2.5 0 0 0-5-0.5c0 .35.07.69.18 1H4a2 2 0 0 0-2 2v3c0 .8.5 1.47 1.22 1.78L3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2l-.22-7.22C21.5 12.47 22 11.8 22 11V8a2 2 0 0 0-2-2zM9 13H5v-2h4v2zm10 0h-4v-2h4v2z" />
            </svg>
          </motion.button>
          
          <button
            onClick={handleSkip}
            disabled={isOpening}
            className="font-sans text-xs text-parchment/70 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-0.5 select-none bg-transparent cursor-pointer tracking-widest uppercase"
          >
            Skip to Story
          </button>
        </div>
      </motion.main>

      <MusicControls />

      {/* Soft warm flash transition */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-ivory z-[1000] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftReveal;
