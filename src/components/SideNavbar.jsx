import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../context/useAudio';
import { birthdayContent } from '../content/birthdayContent';

const SideNavbar = ({ activeSection, onNavigate }) => {
  const { playTick } = useAudio();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalScroll > 0 ? window.scrollY / totalScroll : 0);
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
    <nav
      aria-label="Story chapters"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[40] max-h-[calc(100svh-32px)] w-64 flex-col overflow-y-auto rounded-3xl border border-gold/20 bg-midnight/80 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    >
      <div className="mb-5 border-b border-gold/15 pb-3.5">
        <h2 className="font-serif text-xl font-semibold tracking-[0.15em] text-gold">Story Chapters</h2>
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-parchment/70">A journey for Your Name</p>
      </div>

      <div className="relative flex flex-col gap-3 pl-5 py-1">
        <div className="absolute left-1.5 top-2 bottom-2 w-[2px] rounded-full bg-gold/15" aria-hidden="true">
          <div
            className="w-full rounded-full bg-gradient-to-b from-gold to-dusty-rose shadow-[0_0_10px_rgba(214,183,122,0.7)]"
            style={{ height: `${scrollProgress * 100}%`, transition: 'height 0.1s ease-out' }}
          />
        </div>

        {birthdayContent.chapters.map((chapter, index) => {
          const isActive = activeSection === chapter.targetId;
          return (
            <button
              type="button"
              key={chapter.targetId}
              onClick={() => handleNav(chapter.targetId)}
              aria-current={isActive ? 'location' : undefined}
              className="group relative flex min-h-10 items-center gap-3 border-0 bg-transparent py-1 text-left"
            >
              <span
                className={`absolute left-[-17px] z-10 h-3 w-3 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'scale-125 border-gold bg-gold shadow-[0_0_12px_rgba(214,183,122,0.9)]'
                    : 'border-gold/30 bg-midnight group-hover:border-gold'
                }`}
                aria-hidden="true"
              />
              <span
                className={`chapter-marker grid h-8 w-8 place-items-center rounded-full border text-[9px] transition-colors ${
                  isActive ? 'border-gold/40 bg-gold/15 text-gold' : 'border-gold/20 bg-gold/5 text-parchment/60 group-hover:text-gold'
                }`}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`font-sans text-[10px] uppercase tracking-[0.09em] transition-colors ${
                isActive ? 'font-medium text-gold' : 'text-parchment/70 group-hover:text-gold'
              }`}>
                {chapter.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="chapter-active-indicator"
                  className="absolute inset-0 -z-10 rounded-xl bg-gold/5"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SideNavbar;
