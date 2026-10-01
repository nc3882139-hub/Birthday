import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { SparkleIcon, PhotoIcon, HeartIcon, CloseIcon } from './icons';

const MobileMenu = ({ isOpen, onClose, activeSection, onNavigate }) => {
  const { playTick } = useAudio();

  const chapters = [
    { label: 'The Beginning', targetId: 'beginning', icon: <SparkleIcon className="w-5 h-5" /> },
    { label: 'Growing Up', targetId: 'growing-up', icon: <SparkleIcon className="w-5 h-5 opacity-70" /> },
    { label: 'Memories', targetId: 'memories', icon: <PhotoIcon className="w-5 h-5" /> },
    { label: 'Wishes', targetId: 'wishes', icon: <HeartIcon className="w-5 h-5" /> },
    { label: 'The Grand Finale', targetId: 'finale', icon: <SparkleIcon className="w-5 h-5 text-secondary-fixed" /> }
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
          {/* Backdrop Overlay with blur fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 md:hidden"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%', filter: 'blur(8px)' }}
            animate={{ x: 0, filter: 'blur(0px)' }}
            exit={{ x: '100%', filter: 'blur(8px)' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-80 bg-surface-container-high/65 backdrop-blur-3xl border-l border-white/5 p-8 flex flex-col z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-secondary tracking-wide select-none">Chapters</h3>
                <p className="font-label-md text-label-md text-on-surface-variant select-none">Explore the path</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full border border-white/5 bg-white/5 text-secondary hover:bg-secondary/15 hover:border-secondary/30 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Staggered Navigation Items */}
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
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 min-h-[56px] select-none ${
                      isActive
                        ? 'text-secondary border-r-2 border-secondary bg-white/5 pl-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]'
                        : 'text-on-surface-variant hover:bg-white/5 hover:text-secondary'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {chapter.icon}
                    </div>
                    <span className="font-label-md text-label-md">{chapter.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => handleNavigate('finale')}
              className="w-full py-4 mt-8 bg-secondary/10 border border-secondary/30 text-secondary font-label-md text-label-md rounded-full hover:bg-secondary hover:text-on-secondary hover:shadow-[0_0_25px_rgba(239,192,86,0.3)] transition-all duration-300 btn-sheen cursor-pointer"
            >
              Go to Today
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
