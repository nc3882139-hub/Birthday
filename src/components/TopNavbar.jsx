import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { VolumeOnIcon, VolumeOffIcon } from './icons';

const TopNavbar = ({ activeSection, onToggleMenu, onNavigate }) => {
  const { isPlaying, togglePlay, playTick } = useAudio();

  const navItems = [
    { label: 'The Beginning', targetId: 'beginning' },
    { label: 'Memories', targetId: 'memories' },
    { label: 'Wishes', targetId: 'wishes' },
    { label: 'The Grand Finale', targetId: 'finale' }
  ];

  const handleNavClick = (targetId) => {
    playTick();
    onNavigate(targetId);
  };

  const handleAudioToggle = () => {
    playTick();
    togglePlay();
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-80px)] max-w-5xl z-50 flex justify-between items-center px-6 py-3.5 rounded-full border border-white/10 bg-[#120908]/55 backdrop-blur-[35px] shadow-[0_20px_70px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.06)]"
    >
      {/* Brand Title */}
      <div 
        className="font-display-lg text-headline-sm md:text-headline-md text-secondary cursor-pointer select-none tracking-[0.18em] hover:opacity-85 transition-opacity"
        onClick={() => handleNavClick('beginning')}
      >
        <span className="uppercase tracking-[0.2em] drop-shadow-[0_0_20px_rgba(239,192,86,0.18)]">The Celebration</span>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = activeSection === item.targetId;
          return (
            <span
              key={item.targetId}
              onClick={() => handleNavClick(item.targetId)}
              className={`relative font-label-md text-label-md transition-all duration-300 pb-1 cursor-pointer select-none ${
                isActive
                  ? 'text-secondary font-semibold bg-white/5 backdrop-blur-xl rounded-full px-4 py-1.5 shadow-[0_0_32px_rgba(239,192,86,0.14)]'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="top-nav-active-line"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary rounded-full shadow-[0_0_8px_rgba(239,192,86,0.8)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </span>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        {/* Audio Synth Button */}
        <button
          onClick={handleAudioToggle}
          className="p-2 rounded-full border border-white/5 bg-white/5 text-secondary hover:bg-secondary/15 hover:border-secondary/30 transition-all duration-300 cursor-pointer flex items-center justify-center relative group"
        >
          {isPlaying ? (
            <VolumeOnIcon className="w-5 h-5 animate-pulse" />
          ) : (
            <VolumeOffIcon className="w-5 h-5" />
          )}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] bg-black/85 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {isPlaying ? 'Mute Theme' : 'Play Ambient Chords'}
          </span>
        </button>

        {/* Mobile Hamburger menu */}
        <button
          onClick={() => { playTick(); onToggleMenu(); }}
          className="md:hidden p-2 rounded-full border border-white/5 bg-white/5 text-secondary hover:bg-secondary/15 hover:border-secondary/30 transition-all duration-300 cursor-pointer flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default TopNavbar;
