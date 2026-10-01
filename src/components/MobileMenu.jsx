import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { SparkleIcon, PhotoIcon, HeartIcon, CloseIcon } from './icons';

const MobileMenu = ({ isOpen, onClose, activeSection, onNavigate }) => {
  const { playTick } = useAudio();

  const chapters = [
    { label: 'The Beginning', targetId: 'beginning', icon: <SparkleIcon className="w-5 h-5 text-gold" /> },
    { label: 'Memories', targetId: 'memories', icon: <PhotoIcon className="w-5 h-5 text-gold" /> },
    { label: 'Wishes', targetId: 'wishes', icon: <HeartIcon className="w-5 h-5 text-gold" /> },
    { label: 'The Letter', targetId: 'finale', icon: <SparkleIcon className="w-5 h-5 text-gold" /> }
  ];

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
            initial={{ x: '100%', filter: 'blur(8px)' }}
            animate={{ x: 0, filter: 'blur(0px)' }}
            exit={{ x: '100%', filter: 'blur(8px)' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-80 bg-wine-dark/95 backdrop-blur-3xl border-l border-gold/20 p-8 flex flex-col z-[100] shadow-[0_0_60px_rgba(0,0,0,0.9)] md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gold/15">
              <div>
                <h3 className="font-serif text-2xl text-gold font-semibold tracking-wide select-none uppercase">Chapters</h3>
                <p className="font-sans text-xs text-parchment/60 select-none uppercase tracking-widest">Explore the path</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full border border-gold/20 bg-gold/10 text-gold hover:bg-gold hover:text-midnight transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-4 flex-grow">
              {chapters.map((chapter, index) => {
                const isActive = activeSection === chapter.targetId;
                return (
                  <motion.div
                    key={chapter.targetId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, ease: 'easeOut' }}
                    onClick={() => handleNavigate(chapter.targetId)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 min-h-[54px] select-none ${
                      isActive
                        ? 'text-gold border-r-2 border-gold bg-gold/10 pl-5'
                        : 'text-parchment/70 hover:bg-gold/5 hover:text-gold'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {chapter.icon}
                    </div>
                    <span className="font-sans text-xs uppercase tracking-[0.15em]">{chapter.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => handleNavigate('finale')}
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
