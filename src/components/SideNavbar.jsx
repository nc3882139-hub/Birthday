import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

import beachImg from '../assets/images/beach-memory.png';
import giftBoxImg from '../assets/images/gift-box.png';
import cakeImg from '../assets/images/birthday-cake.png';

const SideNavbar = ({ activeSection, onNavigate }) => {
  const { playTick } = useAudio();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState(null);

  const chapters = [
    { label: 'The Beginning', targetId: 'beginning', icon: '✦', img: giftBoxImg },
    { label: 'Memories', targetId: 'memories', icon: '📷', img: beachImg },
    { label: 'Wishes', targetId: 'wishes', icon: '♥', img: cakeImg },
    { label: 'The Letter', targetId: 'finale', icon: '★', img: giftBoxImg }
  ];

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
    <aside className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[40] flex-col p-6 rounded-3xl border border-gold/20 bg-midnight/70 backdrop-blur-2xl w-64 shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
      <div className="mb-5 pb-3.5 border-b border-gold/15">
        <h2 className="font-serif text-xl text-gold select-none tracking-[0.15em] uppercase font-semibold">Story Chapters</h2>
        <p className="font-sans text-[11px] text-parchment/70 tracking-[0.2em] select-none uppercase">Relive the magic</p>
      </div>

      <div className="relative flex flex-col gap-5 pl-5 py-1">
        {/* Scroll Progress Line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-[2px] bg-gold/15 rounded-full">
          <div 
            className="w-full bg-gradient-to-b from-gold to-dusty-rose rounded-full shadow-[0_0_10px_rgba(201,169,138,0.7)]"
            style={{ height: `${scrollProgress * 100}%`, transition: 'height 0.1s ease-out' }}
          />
        </div>

        {chapters.map((chapter) => {
          const isActive = activeSection === chapter.targetId;
          const isHovered = hoveredChapter === chapter.targetId;

          return (
            <button
              type="button"
              key={chapter.targetId}
              onClick={() => handleNav(chapter.targetId)}
              onMouseEnter={() => setHoveredChapter(chapter.targetId)}
              onMouseLeave={() => setHoveredChapter(null)}
              onFocus={() => setHoveredChapter(chapter.targetId)}
              onBlur={() => setHoveredChapter(null)}
              aria-current={isActive ? 'location' : undefined}
              className="relative flex items-center gap-3 cursor-pointer group border-0 bg-transparent py-1 text-left"
            >
              {/* Chapter dot indicator */}
              <div 
                className={`absolute left-[-17px] w-3 h-3 rounded-full border-2 transition-all duration-300 z-10 ${
                  isActive 
                    ? 'bg-gold border-gold scale-125 shadow-[0_0_12px_rgba(201,169,138,0.9)]' 
                    : 'bg-midnight border-gold/30 group-hover:border-gold'
                }`}
              />
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border border-gold/20 grid place-items-center transition-all duration-300 ${
                  isActive ? 'bg-gold/15 shadow-[0_0_15px_rgba(201,169,138,0.2)]' : 'bg-gold/5 group-hover:bg-gold/15'
                }`}>
                  <span className={`text-xs ${isActive ? 'text-gold' : 'text-parchment/60'}`}>
                    {chapter.icon}
                  </span>
                </div>
                <div className="flex flex-col select-none">
                  <span className={`font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 ${
                    isActive ? 'text-gold font-medium' : 'text-parchment/70 group-hover:text-gold'
                  }`}>
                    {chapter.label}
                  </span>
                </div>
              </div>

              {/* Floating glass preview tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-full mr-4 top-1/2 -translate-y-1/2 p-2 rounded-2xl border border-gold/20 bg-wine-dark/95 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5 pointer-events-none z-50 w-32"
                  >
                    <img 
                      src={chapter.img} 
                      alt={chapter.label}
                      className="w-full h-16 object-cover rounded-xl border border-white/10" 
                    />
                    <div className="text-[10px] font-medium text-center text-gold tracking-wider font-sans uppercase">
                      {chapter.icon} {chapter.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handleNav('finale')}
        className="w-full mt-5 py-2.5 bg-gold/10 border border-gold/30 text-gold font-sans text-xs uppercase tracking-[0.15em] rounded-full hover:bg-gold hover:text-midnight transition-all duration-300 btn-sheen cursor-pointer"
      >
        Read Letter
      </button>
    </aside>
  );
};

export default SideNavbar;
