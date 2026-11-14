import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import { AudioProvider } from './context/AudioContext';
import BackgroundShader from './components/BackgroundShader';
import GiftReveal from './sections/GiftReveal';
import OurStory from './sections/OurStory';

function AppContent() {
  const [view, setView] = useState('gift'); // 'gift' or 'story'

  // Initialize high-performance Lenis smooth scroll
  useEffect(() => {
    if (view !== 'story') return; // Only apply smooth scrolling on the main story layout
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.4, // Slightly longer duration for cinematic feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleResize = () => lenis.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [view]);

  return (
    <div className="relative min-h-screen w-full bg-[#080709] text-[#F8F0E7]">
      {/* Background Shader is mounted globally so it animates continuously */}
      <BackgroundShader />

      {/* Screen view transitions */}
      <AnimatePresence mode="wait">
        {view === 'gift' ? (
          <motion.div
            key="gift-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen"
          >
            <GiftReveal onOpenComplete={() => setView('story')} />
          </motion.div>
        ) : (
          <motion.div
            key="story-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen"
          >
            <OurStory onReplay={() => setView('gift')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AudioProvider>
      <MotionConfig reducedMotion="user">
        <AppContent />
      </MotionConfig>
    </AudioProvider>
  );
}

export default App;
