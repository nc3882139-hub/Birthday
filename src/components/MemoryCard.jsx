import React from 'react';
import { motion } from 'framer-motion';
import ParallaxTilt from './ParallaxTilt';
import { PhotoIcon } from './icons';

const MemoryCard = ({
  image,
  alt,
  title,
  description,
  delayFloat = false,
  offset = false,
  isPlaceholder = false
}) => {
  // Map date based on card title
  const getDate = () => {
    if (title === "A Walk to Remember") return "OCT. 14, 2025";
    if (title === "Quiet Evenings") return "DEC. 24, 2025";
    return "MEMORIES";
  };

  if (isPlaceholder) {
    return (
      <ParallaxTilt className="min-w-[300px] md:min-w-[380px] h-[400px] md:h-[480px] flex-shrink-0 snap-center">
        <div className="w-full h-full glass-panel rounded-2xl overflow-hidden group relative cursor-pointer flex items-center justify-center bg-surface-container-high/15 border border-white/5 shadow-2xl transition-all duration-500">
          {/* Inner hover glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="text-center p-6" style={{ transform: 'translateZ(25px)' }}>
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:text-secondary group-hover:border-secondary/50 group-hover:scale-110 transition-all duration-500 shadow-lg">
              <PhotoIcon className="w-8 h-8 text-on-surface-variant group-hover:text-secondary transition-colors duration-500" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-secondary transition-colors duration-500 select-none">
              More Memories Await
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant/80 italic font-display-lg select-none">The journey continues...</p>
          </div>
        </div>
      </ParallaxTilt>
    );
  }

  return (
    <ParallaxTilt
      className={`min-w-[300px] md:min-w-[380px] h-[400px] md:h-[480px] flex-shrink-0 snap-center ${
        offset ? 'mt-12' : ''
      }`}
    >
      <div
        className={`w-full h-full glass-panel rounded-[32px] overflow-hidden group relative cursor-pointer shadow-[0_35px_80px_rgba(0,0,0,0.35)] border border-[#ffffff0f] bg-[#0c0f10]/40 ${
          delayFloat ? 'animate-float-delayed' : 'animate-float'
        }`}
      >
        {/* Soft edge light glow */}
        <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none z-30 group-hover:border-secondary/20 transition-colors duration-500" />
        
        {/* Floating Date Label */}
        <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full border border-white/5 bg-black/40 backdrop-blur-md text-[11px] font-bold text-secondary tracking-widest shadow-md uppercase select-none">
          {getDate()}
        </div>

        {/* Ambient background glow inside card */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-95 group-hover:opacity-85 transition-opacity duration-700 z-10" />
        
        {/* Main Image */}
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 filter grayscale opacity-80 contrast-125 brightness-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 group-hover:contrast-100"
          style={{ transform: 'translateZ(-10px)' }}
        />
        <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)] opacity-50 pointer-events-none" />
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Floating Text Info */}
        <div 
          className="absolute bottom-0 left-0 p-8 w-full z-20 flex flex-col gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out"
          style={{ transform: 'translateZ(30px)' }}
        >
          <h3 className="font-display-lg text-headline-sm md:text-headline-md text-secondary drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide select-none">
            {title}
          </h3>
          <p className="font-display-lg text-body-md text-on-surface-variant italic leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 pr-4 select-none">
            "{description}"
          </p>
        </div>
      </div>
    </ParallaxTilt>
  );
};

export default MemoryCard;
