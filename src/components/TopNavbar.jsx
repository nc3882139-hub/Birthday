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
    { label: 'The Letter', targetId: 'finale' }
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
      className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-80px)] max-w-5xl z-50 flex justify-between items-center px-6 py-3 rounded-full border border-gold/20 bg-midnight/70 backdrop-blur-[35px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      {/* Brand Title */}
      <div 
        className="font-serif text-xl md:text-2xl text-gold cursor-pointer select-none tracking-[0.15em] hover:opacity-85 transition-opacity font-semibold"
        onClick={() => handleNavClick('beginning')}
      >
        <span className="uppercase tracking-[0.18em]">The Celebration</span>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = activeSection === item.targetId;
          return (
            <span
              key={item.targetId}
              onClick={() => handleNavClick(item.targetId)}
              className={`relative font-sans text-xs tracking-[0.15em] uppercase transition-all duration-300 py-1.5 cursor-pointer select-none ${
                isActive
                  ? 'text-gold font-medium bg-gold/10 backdrop-blur-xl rounded-full px-4 py-1.5 shadow-[0_0_25px_rgba(201,169,138,0.2)]'
                  : 'text-parchment/70 hover:text-gold'
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="top-nav-active-line"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-gold rounded-full shadow-[0_0_8px_rgba(201,169,138,0.8)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </span>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        {/* Audio Synth Button */}
        <button
          onClick={handleAudioToggle}
          className="p-2 rounded-full border border-gold/20 bg-gold/5 text-gold hover:bg-gold/20 hover:border-gold/40 transition-all duration-300 cursor-pointer flex items-center justify-center relative group"
        >
          {isPlaying ? (
            <VolumeOnIcon className="w-4 h-4 animate-pulse text-gold" />
          ) : (
            <VolumeOffIcon className="w-4 h-4 text-parchment/60" />
          )}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded text-[10px] bg-midnight border border-gold/30 text-parchment opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap uppercase tracking-wider font-sans">
            {isPlaying ? 'Mute Music' : 'Play Ambient Chords'}
          </span>
        </button>

        {/* Mobile Hamburger menu */}
        <button
          onClick={() => { playTick(); onToggleMenu(); }}
          className="md:hidden p-2 rounded-full border border-gold/20 bg-gold/5 text-gold hover:bg-gold/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
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
