import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavbar from '../components/TopNavbar';
import SideNavbar from '../components/SideNavbar';
import MobileMenu from '../components/MobileMenu';
import MemoryCard from '../components/MemoryCard';
import Balloon from '../components/Balloon';
import ParallaxTilt from '../components/ParallaxTilt';
import { useAudio } from '../context/AudioContext';
import { SparkleIcon } from '../components/icons';

import beachImg from '../assets/images/beach-memory.png';
import cafeImg from '../assets/images/cafe-memory.png';
import cakeImg from '../assets/images/birthday-cake.png';

const OurStory = ({ onReplay }) => {
  const { isPlaying, togglePlay, playTick } = useAudio();
  const [activeSection, setActiveSection] = useState('beginning');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [poppedWishes, setPoppedWishes] = useState([]);
  const [isLetterOpened, setIsLetterOpened] = useState(false);
  const [typewrittenText, setTypewrittenText] = useState('');
  const [showHeartFinale, setShowHeartFinale] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // References for scroll tracking
  const beginningRef = useRef(null);
  const memoriesRef = useRef(null);
  const wishesRef = useRef(null);
  const finaleRef = useRef(null);

  const letterText = "Every moment spent together has been a chapter in a beautiful story. As we celebrate you today, know that my greatest wish is for your happiness to shine as brightly as you do. Thank you for being you.\n\nWith all my love.";

  // Wishes for balloons
  const initialWishes = [
    { id: 1, text: "May all your dreams take flight this year.", left: 15, delay: 0.2, duration: 5.5 },
    { id: 2, text: "Wishing you a year filled with endless laughter.", left: 38, delay: 0.8, duration: 6.2 },
    { id: 3, text: "To a beautiful soul, happy birthday.", left: 62, delay: 0.4, duration: 4.8 },
    { id: 4, text: "May love surround you always.", left: 83, delay: 1.1, duration: 5.8 }
  ];
  
  const [balloons, setBalloons] = useState(initialWishes);

  // Scroll sync active nav states
  useEffect(() => {
    const refs = [
      { id: 'beginning', ref: beginningRef },
      { id: 'growing-up', ref: beginningRef },
      { id: 'memories', ref: memoriesRef },
      { id: 'wishes', ref: wishesRef },
      { id: 'finale', ref: finaleRef }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matched = refs.find(r => r.ref.current === entry.target);
          if (matched) {
            setActiveSection(matched.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (beginningRef.current) observer.observe(beginningRef.current);
    if (memoriesRef.current) observer.observe(memoriesRef.current);
    if (wishesRef.current) observer.observe(wishesRef.current);
    if (finaleRef.current) observer.observe(finaleRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavigate = (targetId) => {
    let targetRef;
    if (targetId === 'beginning' || targetId === 'growing-up') {
      targetRef = beginningRef;
    } else if (targetId === 'memories') {
      targetRef = memoriesRef;
    } else if (targetId === 'wishes') {
      targetRef = wishesRef;
    } else if (targetId === 'finale') {
      targetRef = finaleRef;
    }

    if (targetRef && targetRef.current) {
      const yOffset = -120;
      const element = targetRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(targetId);
    }
  };

  const handleBalloonPop = (id, text, x, y) => {
    setPoppedWishes((prev) => [...prev, { id, text, x, y }]);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  const handleOpenLetter = () => {
    if (isLetterOpened) return;
    playTick();
    
    // Auto start chord synth audio progression if not already playing
    if (!isPlaying) {
      togglePlay();
    }
    
    setIsLetterOpened(true);
    setIsTyping(true);
    setTypewrittenText('');
    setShowHeartFinale(false);

    let charIndex = 0;
    const speed = 40;

    const typeWriter = () => {
      if (charIndex < letterText.length) {
        const char = letterText.charAt(charIndex);
        setTypewrittenText((prev) => prev + char);
        charIndex++;
        setTimeout(typeWriter, speed);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setShowHeartFinale(true);
        }, 550);
      }
    };

    setTimeout(typeWriter, 700);
  };

  const handleReplayJourney = () => {
    playTick();
    if (isPlaying) {
      togglePlay(); // stop audio synth
    }
    setBalloons(initialWishes);
    setPoppedWishes([]);
    setIsLetterOpened(false);
    setTypewrittenText('');
    setShowHeartFinale(false);
    onReplay();
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation Headers */}
      <TopNavbar
        activeSection={activeSection}
        onToggleMenu={() => setIsMobileMenuOpen(true)}
        onNavigate={handleNavigate}
      />
      <SideNavbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Layout */}
      <main className="relative z-10 pt-[140px] pb-stack-xl lg:pr-80">
        {/* Decorative Balloon Cluster */}
        <div className="pointer-events-none hidden xl:block absolute right-0 top-24 h-[calc(100vh-12rem)] w-96 overflow-visible z-0">
          <div className="absolute right-4 top-4 w-28 h-36 rounded-full bg-gradient-to-b from-[#f7e5b1] via-[#f6c15d] to-[#b88c4a] shadow-[0_20px_60px_rgba(0,0,0,0.32)] opacity-95 transform-gpu animate-[float_12s_ease-in-out_infinite]" />
          <div className="absolute right-14 top-24 w-20 h-28 rounded-full bg-gradient-to-b from-[#fff9ef] via-[#f8e8cf] to-[#f2dca5] border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.25)] opacity-90 transform-gpu animate-[float_10s_ease-in-out_infinite]" />
          <div className="absolute right-10 top-52 w-24 h-32 rounded-full bg-gradient-to-b from-[#e6c068] via-[#ffde96] to-[#f8d580] shadow-[0_22px_58px_rgba(0,0,0,0.32)] opacity-95 transform-gpu animate-[float_14s_ease-in-out_infinite]" />
          <div className="absolute right-28 top-44 w-14 h-20 rounded-full bg-gradient-to-b from-[#fffdf6] via-[#fff4df] to-[#ffe8c1] border border-white/15 shadow-[0_12px_26px_rgba(0,0,0,0.22)] opacity-90" />
          <div className="absolute right-20 top-72 w-32 h-40 rounded-full bg-gradient-to-b from-[#f8e8cf] via-[#f6c15d] to-[#cda25f] shadow-[0_24px_70px_rgba(0,0,0,0.28)] opacity-90" />
          <div className="absolute right-14 top-28 w-1 h-20 bg-gradient-to-b from-[#f7d87a] to-[#6c4a1b] rounded-full opacity-60 rotate-6" />
          <div className="absolute right-20 top-56 w-1 h-24 bg-gradient-to-b from-[#f7d87a] to-[#6c4a1b] rounded-full opacity-60 -rotate-3" />
        </div>

        {/* Scroll Anchor */}
        <div ref={beginningRef} id="beginning" className="h-0 w-0 pointer-events-none" />

        {/* Memory Gallery Section ("Memories") */}
        <motion.section
          ref={memoriesRef}
          id="memories"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 px-margin-mobile md:px-margin-desktop overflow-hidden relative scroll-mt-28"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 w-[420px] h-[420px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(239,192,86,0.12),transparent_60%)] blur-3xl opacity-80" />
            <div className="absolute right-12 top-24 w-24 h-24 rounded-full bg-white/10 blur-2xl opacity-70" />
            <div className="absolute left-12 top-28 w-16 h-16 rounded-full bg-[#f7e1a2]/20 blur-2xl opacity-80" />
          </div>
          <div className="relative select-none text-center">
            <p className="font-script text-3xl md:text-4xl text-secondary opacity-90 mb-3 tracking-[0.05em]">Our Beautiful</p>
            <h2 className="font-display-lg text-5xl md:text-6xl text-center mb-4 tracking-[0.12em] text-shimmer leading-tight">
              Treasured Moments
            </h2>
            <p className="font-display-lg italic text-lg md:text-xl text-on-surface-variant/80 max-w-2xl mx-auto mb-16 tracking-[0.18em] leading-relaxed">
              Every memory is a page in our story.
            </p>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-12 pt-4 px-6 no-scrollbar snap-x snap-mandatory">
            <MemoryCard
              image={beachImg}
              alt="Sunset beach memory photo"
              title="A Walk to Remember"
              description="The day the world stood still, wrapped in golden light."
            />
            <MemoryCard
              image={cafeImg}
              alt="Cozy cafe memory photo"
              title="Quiet Evenings"
              description="Coffee, candlelight, and a connection that transcends words."
              delayFloat={true}
              offset={true}
            />
            <MemoryCard isPlaceholder={true} />
          </div>
        </motion.section>

        {/* Wishes In The Sky Section ("Wishes") */}
        <motion.section
          ref={wishesRef}
          id="wishes"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-16 relative overflow-hidden scroll-mt-28"
        >
          <div className="select-none text-center z-10">
            <h2 className="font-display-lg text-5xl md:text-6xl text-center mb-4 tracking-widest text-shimmer leading-tight">
              Wishes in the Sky
            </h2>
            <p className="font-display-lg italic text-lg md:text-xl text-on-surface-variant/80 max-w-2xl mx-auto mb-16 tracking-wider">
              Tap a floating glass balloon to release its golden message.
            </p>
          </div>

          <div className="relative w-full max-w-4xl h-[420px] mx-auto z-10">
            {/* Float Balloons */}
            <AnimatePresence>
              {balloons.map((balloon) => (
                <Balloon
                  key={balloon.id}
                  id={balloon.id}
                  left={balloon.left}
                  delay={balloon.delay}
                  duration={balloon.duration}
                  wish={balloon.text}
                  onPop={handleBalloonPop}
                />
              ))}
            </AnimatePresence>

            {/* Revealed Wishes Cards */}
            <AnimatePresence>
              {poppedWishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, scale: 0.8, y: 25, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  style={{ left: `${wish.x}px`, top: `${wish.y}px` }}
                  className="absolute w-56 p-5 rounded-2xl border border-secondary/35 bg-surface-container-high/45 backdrop-blur-xl shadow-2xl text-center z-25 -translate-x-1/2 -translate-y-1/2 select-none"
                >
                  <div className="flex justify-center mb-2">
                    <SparkleIcon className="w-5 h-5 animate-pulse text-secondary" />
                  </div>
                  <p className="font-display-lg italic text-body-md text-on-surface leading-relaxed">
                    "{wish.text}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Grand Finale Section ("Grand Finale") */}
        <motion.section
          ref={finaleRef}
          id="finale"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-16 relative scroll-mt-28"
        >
          {/* Envelope Card Container */}
          {!isLetterOpened && (
            <ParallaxTilt maxRotation={10} scale={1.03} className="w-full max-w-xl">
              <motion.div
                initial={{ y: 200, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 24, stiffness: 85 }}
                onClick={handleOpenLetter}
                onMouseEnter={playTick}
                className="w-full glass-panel glass-panel-glow p-10 rounded-2xl relative z-20 cursor-pointer flex flex-col items-center shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              >
                {/* Envelope Heart Seal */}
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#b22222] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(178,34,34,0.6)] border-2 border-secondary/50 select-none z-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-secondary">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
                
                <div className="text-center mt-6 mb-8 select-none">
                  <p className="font-script text-4xl text-secondary tracking-[0.06em] leading-tight mb-3 opacity-90">
                    To my dearest,
                  </p>
                  <h3 className="font-display-lg text-headline-md md:text-3xl text-on-surface tracking-[0.06em] leading-tight">
                    A Final Note
                  </h3>
                </div>
                
                <button
                  onClick={handleOpenLetter}
                  className="px-10 py-3 bg-secondary/10 border border-secondary text-secondary rounded-full font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all duration-300 ambient-glow-gold select-none btn-sheen cursor-pointer"
                >
                  Open Letter
                </button>
              </motion.div>
            </ParallaxTilt>
          )}

          {/* Letter Reveal Content */}
          {isLetterOpened && (
            <div className="relative w-full max-w-2xl mt-8 z-20 flex items-center justify-center">
              {/* Pulsing Warm backlight glow behind paper */}
              <div className="absolute inset-[-15%] bg-[radial-gradient(circle,rgba(239,192,86,0.18)_0%,transparent_75%)] rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none z-0" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 50, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-10 md:p-14 rounded-2xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] z-10 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(rgba(12,15,16,0.92) 0%, rgba(12,15,16,0.98) 100%), repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(239, 192, 86, 0.03) 31px, rgba(239, 192, 86, 0.03) 32px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05)'
                }}
              >
                {/* Thin inner gold frame outline */}
                <div className="absolute inset-4 rounded-xl border border-secondary/15 pointer-events-none" />

                <p className="font-display-lg text-lg md:text-xl text-on-background leading-loose typewriter pr-1 whitespace-pre-wrap select-none tracking-wide">
                  {typewrittenText}
                  {isTyping && <span className="inline-block w-1.5 h-5 bg-secondary animate-pulse ml-0.5" />}
                </p>

                {/* Heart and Sparkles Finale */}
                <AnimatePresence>
                  {showHeartFinale && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 1.6 }}
                      className="mt-14 text-center select-none"
                    >
                      {/* Big Gold Heart */}
                      <div className="flex justify-center mb-6">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-16 h-16 text-[#b22222] drop-shadow-[0_0_30px_rgba(255,107,170,0.85)] animate-pulse"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-shimmer leading-tight tracking-[0.05em]">
                        Happy Birthday ❤️
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* Replay Button */}
          <div className="mt-20 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReplayJourney}
              className="flex items-center gap-3.5 px-8 py-4.5 border-[1.5px] border-secondary text-secondary bg-secondary/5 font-label-md text-label-md rounded-full hover:bg-secondary/10 hover:shadow-[0_0_30px_rgba(239,192,86,0.3)] transition-all duration-300 select-none btn-sheen cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
              </svg>
              Replay the Journey
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 px-margin-mobile md:px-margin-desktop py-10 bg-gradient-to-t from-[#0c0f10]/95 to-transparent z-40 relative lg:pr-80 border-t border-white/5 select-none">
        <div className="text-on-surface-variant/80 font-label-md text-label-md order-2 sm:order-1">
          Created with Love • 2026
        </div>
        <div className="flex gap-6 order-3 sm:order-2">
          <span className="text-on-surface-variant/80 font-label-md text-label-md hover:text-secondary transition-colors cursor-pointer">Privacy</span>
          <span className="text-on-surface-variant/80 font-label-md text-label-md hover:text-secondary transition-colors cursor-pointer">Terms</span>
        </div>
        <div className="text-secondary font-bold font-display-lg text-headline-sm tracking-widest order-1 sm:order-3 text-shimmer">
          priyanshu chakraborty
        </div>
      </footer>
    </div>
  );
};

export default OurStory;
