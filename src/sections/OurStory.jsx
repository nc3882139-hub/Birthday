import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavbar from '../components/TopNavbar';
import SideNavbar from '../components/SideNavbar';
import MobileMenu from '../components/MobileMenu';
import MemoryCard from '../components/MemoryCard';
import Balloon from '../components/Balloon';
import ParallaxTilt from '../components/ParallaxTilt';
import { useAudio } from '../context/useAudio';
import { SparkleIcon } from '../components/icons';
import cakeImg from '../assets/images/birthday-cake.webp';
import { birthdayContent } from '../content/birthdayContent';

const initialBalloons = [
  ...birthdayContent.wishes.map((text, index) => ({
    id: index + 1,
    text,
    left: [12, 37, 63, 88][index],
    delay: [0.2, 0.8, 0.4, 1.1][index],
    duration: [7.2, 6.5, 7.8, 6.8][index],
    color: ['dusty-rose', 'champagne', 'burgundy', 'blush'][index],
    depth: 'mg'
  })),
  { id: 5, text: '', left: 4, delay: 1.5, duration: 8.5, color: 'violet', depth: 'bg' },
  { id: 6, text: '', left: 96, delay: 2, duration: 8, color: 'cream', depth: 'bg' }
];

const OurStory = ({ onReplay }) => {
  const { playTick } = useAudio();
  const [activeSection, setActiveSection] = useState('beginning');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [poppedWishes, setPoppedWishes] = useState([]);
  const [isEnvelopeClicked, setIsEnvelopeClicked] = useState(false);
  const [isLetterOpened, setIsLetterOpened] = useState(false);
  const [typewrittenText, setTypewrittenText] = useState('');
  const [showHeartFinale, setShowHeartFinale] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const beginningRef = useRef(null);
  const memoriesRef = useRef(null);
  const littleThingsRef = useRef(null);
  const wishesRef = useRef(null);
  const wishesStageRef = useRef(null);
  const letterRef = useRef(null);
  const finaleRef = useRef(null);

  const [balloons, setBalloons] = useState(initialBalloons);
  const letterText = birthdayContent.letter;

  useEffect(() => {
    if (!isEnvelopeClicked) return undefined;

    let typewriterTimer;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsLetterOpened(true);
      setTypewrittenText(letterText);
      setIsTyping(false);
      setShowHeartFinale(true);
      return undefined;
    }

    const revealTimer = window.setTimeout(() => {
      setIsLetterOpened(true);
      setIsTyping(true);
      setTypewrittenText('');
      setShowHeartFinale(false);

      let charIndex = 0;
      const typeNextCharacter = () => {
        if (charIndex < letterText.length) {
          setTypewrittenText(letterText.slice(0, charIndex + 1));
          charIndex += 1;
          typewriterTimer = window.setTimeout(typeNextCharacter, 32);
          return;
        }

        setIsTyping(false);
        typewriterTimer = window.setTimeout(() => setShowHeartFinale(true), 650);
      };

      typewriterTimer = window.setTimeout(typeNextCharacter, 550);
    }, 850);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(typewriterTimer);
    };
  }, [isEnvelopeClicked, letterText]);

  useEffect(() => {
    const refs = [
      { id: 'beginning', ref: beginningRef },
      { id: 'memories', ref: memoriesRef },
      { id: 'little-things', ref: littleThingsRef },
      { id: 'wishes', ref: wishesRef },
      { id: 'letter', ref: letterRef },
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
          const matched = refs.find((chapter) => chapter.ref.current === entry.target);
          if (matched) {
            setActiveSection(matched.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (beginningRef.current) observer.observe(beginningRef.current);
    if (memoriesRef.current) observer.observe(memoriesRef.current);
    if (littleThingsRef.current) observer.observe(littleThingsRef.current);
    if (wishesRef.current) observer.observe(wishesRef.current);
    if (letterRef.current) observer.observe(letterRef.current);
    if (finaleRef.current) observer.observe(finaleRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavigate = (targetId) => {
    const chapterRefs = {
      beginning: beginningRef,
      memories: memoriesRef,
      'little-things': littleThingsRef,
      wishes: wishesRef,
      letter: letterRef,
      finale: finaleRef
    };
    const targetRef = chapterRefs[targetId];

    if (targetRef && targetRef.current) {
      const element = targetRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      window.scrollTo({ top: Math.max(0, y), behavior });
      setActiveSection(targetId);
    }
  };

  const handleBalloonPop = (id, text, x, y) => {
    if (text) {
      const containerWidth = wishesStageRef.current?.clientWidth || window.innerWidth;
      const containerHeight = wishesStageRef.current?.clientHeight || 340;
      const safeX = Math.max(120, Math.min(containerWidth - 120, x));
      const safeY = Math.max(80, Math.min(containerHeight - 70, y));
      setPoppedWishes((prev) => [...prev, { id, text, x: safeX, y: safeY }]);
    }
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  const handleOpenLetterSequence = () => {
    if (isEnvelopeClicked) return;
    playTick();
    
    setIsEnvelopeClicked(true);

    setTypewrittenText('');
    setShowHeartFinale(false);
  };

  const handleReplayJourney = () => {
    playTick();
    setBalloons(initialBalloons);
    setPoppedWishes([]);
    setIsEnvelopeClicked(false);
    setIsLetterOpened(false);
    setTypewrittenText('');
    setShowHeartFinale(false);
    onReplay();
  };

  const handleReplayLetter = () => {
    playTick();
    setIsEnvelopeClicked(false);
    setIsLetterOpened(false);
    setIsTyping(false);
    setTypewrittenText('');
    setShowHeartFinale(false);
  };

  return (
    <div className="relative min-h-screen">
      <a
        href="#beginning"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-midnight focus:px-5 focus:py-3 focus:text-gold"
      >
        Skip to the birthday story
      </a>

      {/* Top and Side Navbars */}
      <TopNavbar
        activeSection={activeSection}
        onToggleMenu={() => setIsMobileMenuOpen(true)}
        onNavigate={handleNavigate}
        isMenuOpen={isMobileMenuOpen}
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
      <main className="relative z-10 pt-[104px] sm:pt-[120px] pb-24 lg:pr-72">
        <section
          ref={beginningRef}
          id="beginning"
          aria-labelledby="birthday-hero-title"
          className="birthday-hero relative mx-auto mb-24 flex min-h-[calc(100svh-104px)] max-w-7xl flex-col items-center justify-center overflow-clip px-5 pb-20 pt-10 text-center sm:px-10 lg:mb-32 scroll-mt-28"
        >
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="relative z-10 mb-6 font-sans text-[10px] uppercase tracking-[0.34em] text-gold sm:text-xs"
          >
            For {birthdayContent.recipient} <span aria-hidden="true">·</span> Made with love
          </motion.p>
          <motion.h1
            id="birthday-hero-title"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-5xl font-serif text-[clamp(3.35rem,9vw,8.5rem)] font-normal leading-[0.82] tracking-[-0.055em] text-ivory"
          >
            Today Is <span className="hero-title-italic">All About You.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 0.82, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="relative z-10 mt-8 max-w-xl font-serif text-lg leading-relaxed text-parchment/80 sm:mt-10 sm:text-2xl"
          >
            Happy birthday, {birthdayContent.nickname}. This little world is here to celebrate you.
          </motion.p>
          <motion.button
            type="button"
            onClick={() => handleNavigate('memories')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="scroll-cue absolute bottom-8 z-10 inline-flex flex-col items-center gap-3 border-0 bg-transparent text-[9px] uppercase tracking-[0.25em] text-gold/80 transition-colors hover:text-ivory"
            aria-label="Scroll to the memories"
          >
            <span>Begin the story</span>
            <span className="scroll-cue-line" aria-hidden="true" />
          </motion.button>
        </section>

        {/* Memory Gallery Section ("Memories") */}
        <motion.section
          ref={memoriesRef}
          id="memories"
          aria-labelledby="birthday-memories-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 px-margin-mobile md:px-margin-desktop overflow-hidden relative scroll-mt-28"
        >
          <div className="relative select-none text-center mb-12">
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-gold/80 mb-4">Chapter 02 · A collection to make your own</p>
            <h2 id="birthday-memories-title" className="font-serif text-4xl md:text-6xl text-center mb-4 text-ivory font-normal tracking-tight">
              Beautiful <span className="hero-title-italic">memories.</span>
            </h2>
            <p className="mx-auto max-w-lg font-serif text-lg leading-relaxed text-parchment/65">
              A place for the photographs and moments you choose to keep close.
            </p>
          </div>
          
          <div
            tabIndex={0}
            role="region"
            aria-label="Scrollable birthday memory gallery"
            className="flex gap-8 overflow-x-auto px-4 pb-10 pt-2 no-scrollbar snap-x snap-mandatory focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            {birthdayContent.memories.map((memory, index) => (
              <MemoryCard
                key={memory.title}
                {...memory}
                offset={index % 2 === 1}
              />
            ))}
            <MemoryCard isPlaceholder={true} />
          </div>
        </motion.section>

        <motion.section
          ref={littleThingsRef}
          id="little-things"
          aria-labelledby="little-things-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-28 scroll-mt-28 px-margin-mobile py-12 md:px-margin-desktop lg:mb-36"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.32em] text-gold/80">Chapter 03 · The details that stay</p>
              <h2 id="little-things-title" className="font-serif text-4xl font-normal tracking-tight text-ivory md:text-6xl">
                Little things <span className="hero-title-italic">that matter.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl font-serif text-lg leading-relaxed text-parchment/70">
                The smallest details can hold the most meaning. Make these words your own.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {birthdayContent.littleThings.map((prompt, index) => (
                <article key={prompt} className="glass-panel rounded-2xl p-6 sm:p-8">
                  <p className="chapter-marker mb-8 font-sans text-[10px] text-gold/80">0{index + 1} / 03</p>
                  <p className="font-serif text-xl leading-relaxed text-parchment sm:text-2xl">{prompt}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-center font-sans text-[10px] uppercase tracking-[0.16em] text-parchment/45">
              Replace these prompts with details that are true to Your Name.
            </p>
          </div>
        </motion.section>

        {/* Wishes In The Sky Section ("Wishes") */}
        <motion.section
          ref={wishesRef}
          id="wishes"
          aria-labelledby="birthday-wishes-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[65vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-12 relative overflow-hidden scroll-mt-28"
        >
          <div className="select-none text-center z-10 mb-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-gold/80 mb-4">Chapter 04 · A few words from the heart</p>
            <h2 id="birthday-wishes-title" className="font-serif text-4xl md:text-6xl text-center mb-4 text-ivory font-normal tracking-tight">
              Birthday <span className="hero-title-italic">wishes.</span>
            </h2>
            <p className="font-serif text-base md:text-lg text-parchment/70 max-w-xl mx-auto">
              Tap, click, or focus a balloon and press Enter to reveal a wish for Your Name.
            </p>
          </div>

          <div ref={wishesStageRef} data-balloon-stage className="relative w-full max-w-5xl h-[340px] sm:h-[440px] mx-auto z-10">
            {/* Multi-layered Satin Floating Balloons */}
            <AnimatePresence>
              {balloons.map((balloon) => (
                <Balloon
                  key={balloon.id}
                  id={balloon.id}
                  left={balloon.left}
                  delay={balloon.delay}
                  duration={balloon.duration}
                  wish={balloon.text}
                  color={balloon.color}
                  depth={balloon.depth}
                  onPop={handleBalloonPop}
                />
              ))}
            </AnimatePresence>

            {/* Revealed Wishes Floating Cards */}
            <AnimatePresence>
              {poppedWishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  style={{ left: `${wish.x}px`, top: `${wish.y}px` }}
                  className="absolute w-60 p-5 rounded-2xl border border-gold/35 bg-wine-dark/90 backdrop-blur-2xl shadow-2xl text-center z-30 -translate-x-1/2 -translate-y-1/2 select-none"
                >
                  <div className="flex justify-center mb-2">
                    <SparkleIcon className="w-4 h-4 animate-pulse text-gold" />
                  </div>
                  <p className="font-serif italic text-base text-parchment leading-relaxed">
                    "{wish.text}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* A Letter From the Heart */}
        <motion.section
          ref={letterRef}
          id="letter"
          aria-labelledby="birthday-letter-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-16 relative scroll-mt-28"
        >
          {/* Section Header */}
          <div className="text-center mb-10 select-none z-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-gold/80 mb-3">Chapter 05 · A letter from the heart</p>
            <h2 id="birthday-letter-title" className="font-serif text-4xl md:text-5xl text-parchment text-shimmer font-semibold">
              A letter, just for you
            </h2>
          </div>

          {/* Envelope Physical Opening Interaction */}
          {!isLetterOpened && (
            <ParallaxTilt maxRotation={8} scale={1.02} className="w-full max-w-lg">
              <motion.button
                type="button"
                aria-label={`Open the birthday letter for ${birthdayContent.recipient}`}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 90 }}
                onClick={handleOpenLetterSequence}
                className="w-full relative z-20 cursor-pointer flex flex-col items-center group select-none border-0 bg-transparent p-0 text-left"
              >
                {/* 3D Physical Envelope Structure */}
                <div className="w-full aspect-[1.6/1] bg-gradient-to-b from-[#24151B] to-[#180E12] rounded-2xl border border-gold/30 shadow-[0_30px_70px_rgba(0,0,0,0.7)] relative overflow-hidden flex flex-col items-center justify-center p-8">
                  {/* Outer Gold Debossed Border */}
                  <div className="absolute inset-3 border border-gold/20 rounded-xl pointer-events-none" />

                  {/* Envelope Flap 3D Simulation */}
                  <motion.div 
                    animate={isEnvelopeClicked ? { rotateX: -160, y: -40, opacity: 0.4 } : { rotateX: 0, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top center' }}
                    className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#2E1B23] to-[#24151B] border-b border-gold/20 rounded-t-2xl shadow-md z-20 pointer-events-none"
                  />

                  {/* Crimson Wax Seal with Heart */}
                  <motion.div 
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isEnvelopeClicked ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-full wax-seal flex items-center justify-center z-30 shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gold">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </motion.div>

                  <div className="mt-8 text-center z-10">
                    <p className="font-script text-3xl text-gold/90 mb-1">To {birthdayContent.recipient},</p>
                    <p className="font-sans text-xs text-parchment/70 tracking-[0.2em] uppercase">Select to unfold this letter</p>
                  </div>
                </div>
              </motion.button>
            </ParallaxTilt>
          )}

          {/* Physical Luxury Stationery Letter Composition */}
          {isLetterOpened && (
            <div className="relative w-full max-w-2xl z-20 flex flex-col items-center justify-center">
              {/* Soft warm gold backlight glow behind parchment */}
              <div className="absolute inset-[-12%] bg-[radial-gradient(circle,rgba(201,169,138,0.18)_0%,transparent_70%)] rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none z-0" />

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-8 sm:p-12 md:p-16 rounded-2xl stationery-paper z-10 relative overflow-hidden"
              >
                {/* Gold Blind-Debossed Inner Border Frame */}
                <div className="absolute inset-5 rounded-xl paper-inner-border pointer-events-none" />

                {/* Top Ornamental Filigree Divider */}
                <div className="text-center mb-8 text-gold/60 select-none">
                  <span className="font-serif text-xl tracking-[0.3em]">❖ ❖ ❖</span>
                </div>

                {/* Main Personal Message Text */}
                <div className="font-serif text-xl sm:text-2xl text-[#2D2024] leading-[1.85] typewriter whitespace-pre-wrap tracking-wide" aria-hidden="true">
                  {typewrittenText}
                  {isTyping && <span className="inline-block w-1.5 h-6 bg-[#701B3A] animate-pulse ml-1" aria-hidden="true" />}
                </div>
                <p className="sr-only">{isLetterOpened ? letterText : ''}</p>

                {/* Heart & Celebration Finale */}
                <AnimatePresence>
                  {showHeartFinale && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.6 }}
                      className="mt-12 pt-8 border-t border-gold/20 text-center select-none"
                    >
                      <div className="flex justify-center mb-4">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-12 h-12 text-[#701B3A] drop-shadow-[0_0_20px_rgba(112,27,58,0.6)] animate-pulse"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#701B3A] font-semibold tracking-wide">
                        Happy Birthday, {birthdayContent.nickname}
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {isLetterOpened && (
              <button
                type="button"
                onClick={handleReplayLetter}
                disabled={isTyping}
                className="rounded-full border border-gold/30 bg-gold/5 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/15 disabled:cursor-wait disabled:opacity-50"
              >
                Read the letter again
              </button>
            )}
            <button
              type="button"
              onClick={() => handleNavigate('finale')}
              className="rounded-full border border-gold/30 bg-gold/10 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20"
            >
              Continue to the finale
            </button>
          </div>
        </motion.section>

        {/* Grand Finale */}
        <motion.section
          ref={finaleRef}
          id="finale"
          aria-labelledby="birthday-finale-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex min-h-[85vh] flex-col items-center justify-center px-margin-mobile py-20 relative scroll-mt-28 md:px-margin-desktop"
        >
          <div className="mb-10 text-center">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.32em] text-gold/80">Chapter 06 · The grand finale</p>
            <h2 id="birthday-finale-title" className="font-serif text-4xl font-normal tracking-tight text-ivory md:text-6xl">
              A new chapter, <span className="hero-title-italic">all yours.</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-gold/20 bg-[#100B0E]/80 shadow-[0_35px_100px_rgba(0,0,0,0.5)] md:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="relative min-h-[280px] overflow-hidden sm:min-h-[380px]">
              <img
                src={cakeImg}
                alt="A candlelit birthday cake beneath warm celebration lights"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100B0E]/65 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center px-7 py-10 text-center sm:px-12 md:text-left">
              <p className="mb-4 font-sans text-[9px] uppercase tracking-[0.3em] text-gold">For {birthdayContent.recipient}</p>
              <h3 className="font-serif text-4xl font-normal leading-tight tracking-tight text-ivory sm:text-5xl">
                Make a wish.<br /><span className="hero-title-italic">Then make it yours.</span>
              </h3>
              <p className="mt-5 max-w-sm font-serif text-lg leading-relaxed text-parchment/70">
                May the year ahead bring you joy, wonder, and the space to become even more yourself. Happy birthday, {birthdayContent.nickname}.
              </p>
            </div>
          </motion.div>

          {/* Replay Button */}
          <div className="mt-16 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReplayJourney}
              className="flex items-center gap-3 px-8 py-4 border border-gold/30 text-gold bg-gold/5 font-sans text-xs uppercase tracking-[0.18em] rounded-full hover:bg-gold hover:text-midnight hover:shadow-[0_0_30px_rgba(201,169,138,0.3)] transition-all duration-300 select-none btn-sheen cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
              </svg>
              Replay the Journey
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 px-margin-mobile md:px-margin-desktop py-8 bg-gradient-to-t from-midnight to-transparent z-40 relative lg:pr-72 border-t border-gold/10 select-none">
        <div className="text-parchment/60 font-sans text-xs tracking-wider order-2 sm:order-1">
          Created with Love • 2026
        </div>
        <div className="text-gold font-serif text-lg tracking-widest order-1 sm:order-3 text-shimmer font-semibold uppercase">
          {birthdayContent.sender}
        </div>
      </footer>
    </div>
  );
};

export default OurStory;
