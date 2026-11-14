import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/useAudio';
import { CloseIcon } from './icons';
import { birthdayContent } from '../content/birthdayContent';

const MobileMenu = ({ isOpen, onClose, activeSection, onNavigate }) => {
  const { playTick } = useAudio();
  const panelRef = useRef(null);
  const closeHandlerRef = useRef(onClose);
  closeHandlerRef.current = onClose;

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;

    const panel = panelRef.current;
    const previousFocus = document.activeElement;
    const focusableElements = () => panel.querySelectorAll('button:not([disabled])');
    focusableElements()[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeHandlerRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = focusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  const handleNavigate = (targetId) => {
    playTick();
    onNavigate(targetId);
    onClose();
  };

  const handleClose = () => {
    playTick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-midnight/80 backdrop-blur-md z-50 md:hidden"
          />

          {/* Sliding Panel */}
          <motion.div
            ref={panelRef}
            id="story-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Story navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed right-0 top-0 z-[100] flex h-full max-h-[100svh] w-[min(20rem,calc(100vw-1rem))] flex-col overflow-y-auto border-l border-gold/20 bg-wine-dark/95 p-6 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-3xl xl:hidden sm:p-8"
          >
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gold/15">
              <div>
                <h3 className="font-serif text-2xl text-gold font-semibold tracking-wide select-none uppercase">Chapters</h3>
                <p className="font-sans text-xs text-parchment/60 select-none uppercase tracking-widest">Explore the path</p>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close story navigation"
                className="p-2 rounded-full border border-gold/20 bg-gold/10 text-gold hover:bg-gold hover:text-midnight transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-grow flex-col gap-2">
              {birthdayContent.chapters.map((chapter, index) => {
                const isActive = activeSection === chapter.targetId;
                return (
                  <motion.button
                    type="button"
                    key={chapter.targetId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, ease: 'easeOut' }}
                    onClick={() => handleNavigate(chapter.targetId)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`flex min-h-[52px] w-full items-center gap-4 rounded-2xl border-0 bg-transparent p-3 text-left cursor-pointer transition-all duration-300 select-none ${
                      isActive
                        ? 'text-gold border-r-2 border-gold bg-gold/10 pl-5'
                        : 'text-parchment/70 hover:bg-gold/5 hover:text-gold'
                    }`}
                  >
                    <span className="chapter-marker grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-gold/20 bg-gold/5 font-sans text-[9px] text-gold" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-xs uppercase tracking-[0.12em]">{chapter.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => handleNavigate('letter')}
              className="w-full py-4 mt-8 bg-gold/15 border border-gold/30 text-gold font-sans text-xs uppercase tracking-[0.18em] rounded-full hover:bg-gold hover:text-midnight transition-all duration-300 btn-sheen cursor-pointer"
            >
              Read Letter
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
