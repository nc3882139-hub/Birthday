import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Sync Lenis with scroll triggers
    window.addEventListener('resize', () => lenis.resize());

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [view]);

  return (
    <div className="relative min-h-screen w-full bg-[#0c0f10] text-[#e1e3e4] overflow-hidden">
      {/* Background Shader is mounted globally so it animates continuously */}
      <BackgroundShader />

      {/* Screen view transitions */}
      <AnimatePresence mode="wait">
        {view === 'gift' ? (
          <motion.div
            key="gift-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen"
          >
            <GiftReveal onOpenComplete={() => setView('story')} />
          </motion.div>
        ) : (
          <motion.div
            key="story-view"
            initial={{ opacity: 0, y: 30, scale: 1.01, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
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
      <AppContent />
    </AudioProvider>
  );
}

export default App;
