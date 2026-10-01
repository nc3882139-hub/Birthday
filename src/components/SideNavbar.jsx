import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

import beachImg from '../assets/images/beach-memory.png';
import cafeImg from '../assets/images/cafe-memory.png';
import giftBoxImg from '../assets/images/gift-box.png';
import cakeImg from '../assets/images/birthday-cake.png';

const SideNavbar = ({ activeSection, onNavigate }) => {
  const { playTick } = useAudio();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState(null);

  const chapters = [
    { label: 'The Beginning', targetId: 'beginning', icon: '✦', img: giftBoxImg },
    { label: 'Growing Up', targetId: 'growing-up', icon: '✻', img: cafeImg },
    { label: 'Memories', targetId: 'memories', icon: '📷', img: beachImg },
    { label: 'Wishes', targetId: 'wishes', icon: '♥', img: cakeImg },
    { label: 'The Grand Finale', targetId: 'finale', icon: '★', img: giftBoxImg }
  ];

  // Track window scroll progress for journey line
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (targetId) => {
    playTick();
    onNavigate(targetId);
  };

  return (
    <aside className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[40] flex-col p-6 rounded-[32px] border border-[#efc05633] bg-[#120908]/50 backdrop-blur-[32px] w-72 shadow-[0_25px_80px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.06)]">
      <div className="mb-6 pb-4 border-b border-[#ffffff10]">
        <h2 className="font-headline-sm text-headline-sm text-secondary select-none tracking-[0.18em] uppercase opacity-95">Story Chapters</h2>
        <p className="font-label-md text-label-md text-on-surface-variant tracking-[0.22em] select-none uppercase opacity-80">Relive the magic</p>
      </div>

      <div className="relative flex flex-col gap-6 pl-6 py-2">
        {/* Scroll Progress Line */}
        <div className="absolute left-1.5 top-3 bottom-3 w-[2px] bg-white/10 rounded-full">
          <div 
            className="w-full bg-gradient-to-b from-secondary to-secondary-fixed-dim rounded-full shadow-[0_0_10px_rgba(239,192,86,0.7)]"
            style={{ height: `${scrollProgress * 100}%`, transition: 'height 0.1s ease-out' }}
          />
        </div>

        {chapters.map((chapter) => {
          const isActive = activeSection === chapter.targetId;
          const isHovered = hoveredChapter === chapter.targetId;

          return (
            <div
              key={chapter.targetId}
              onClick={() => handleNav(chapter.targetId)}
              onMouseEnter={() => setHoveredChapter(chapter.targetId)}
              onMouseLeave={() => setHoveredChapter(null)}
              className="relative flex items-center gap-4 cursor-pointer group py-1.5"
            >
              {/* Chapter dot indicator (anchored to progress line) */}
              <div 
                className={`absolute left-[-21px] w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${
                  isActive 
                    ? 'bg-secondary border-secondary scale-125 shadow-[0_0_12px_rgba(239,192,86,0.95)]' 
                    : 'bg-[#120908] border-[#d7c08f55] group-hover:border-secondary'
                }`}
              />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border border-white/10 grid place-items-center transition-all duration-300 ${
                  isActive ? 'bg-secondary/15 shadow-[0_0_20px_rgba(239,192,86,0.14)]' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <span className={`text-sm ${isActive ? 'text-secondary' : 'text-on-surface-variant/80'}`}>
                    {chapter.icon}
                  </span>
                </div>
                <div className="flex flex-col select-none">
                  <span className={`font-label-md text-label-md transition-all duration-300 ${
                    isActive ? 'text-secondary font-semibold' : 'text-on-surface-variant/80 group-hover:text-secondary'
                  }`}>
                    {chapter.label}
                  </span>
                </div>
              </div>

              {/* Floating glass thumbnail and tooltip card */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-full mr-4 top-1/2 -translate-y-1/2 p-2 rounded-xl border border-white/10 bg-surface-container-high/90 backdrop-blur-xl shadow-2xl flex flex-col gap-2 pointer-events-none z-50 w-36"
                  >
                    <img 
                      src={chapter.img} 
                      alt={chapter.label}
                      className="w-full h-20 object-cover rounded-lg border border-white/5" 
                    />
                    <div className="text-[11px] font-semibold text-center text-secondary tracking-wider">
                      {chapter.icon} {chapter.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => handleNav('finale')}
        className="w-full mt-6 py-2.5 bg-[#efc05622] border border-[#efc05644] text-secondary font-label-md text-label-md rounded-full hover:bg-[#efc0562b] hover:text-on-secondary hover:shadow-[0_0_30px_rgba(239,192,86,0.4)] transition-all duration-300 btn-sheen cursor-pointer"
      >
        Go to Today
      </button>
    </aside>
  );
};

export default SideNavbar;
