import React from 'react';
import ParallaxTilt from './ParallaxTilt';
import { PhotoIcon } from './icons';

const MemoryCard = ({
  image,
  alt,
  title,
  description,
  label = 'A memory to keep',
  offset = false,
  isPlaceholder = false
}) => {
  if (isPlaceholder) {
    return (
      <ParallaxTilt className="w-[min(82vw,320px)] md:w-[360px] h-[390px] md:h-[460px] flex-shrink-0 snap-center">
        <div className="w-full h-full glass-panel rounded-2xl overflow-hidden group relative flex items-center justify-center bg-wine-dark/30 border border-gold/15 shadow-2xl transition-all duration-500">
          <div className="text-center p-6" style={{ transform: 'translateZ(25px)' }}>
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:text-midnight group-hover:scale-110 transition-all duration-500 shadow-md">
              <PhotoIcon className="w-7 h-7 text-gold group-hover:text-midnight transition-colors duration-500" />
            </div>
            <h3 className="font-serif text-2xl text-parchment mb-2 group-hover:text-gold transition-colors duration-500 select-none font-semibold">
              Make room for another memory
            </h3>
            <p className="font-script text-xl text-gold/80 select-none">Add the next moment when you are ready.</p>
          </div>
        </div>
      </ParallaxTilt>
    );
  }

  return (
    <ParallaxTilt
      className={`w-[min(82vw,320px)] md:w-[360px] h-[390px] md:h-[460px] flex-shrink-0 snap-center ${
        offset ? 'md:mt-12' : ''
      }`}
    >
      <div
        className="w-full h-full glass-panel rounded-2xl overflow-hidden group relative shadow-[0_30px_75px_rgba(0,0,0,0.5)] border border-gold/20 bg-wine-dark/40"
      >
        {/* Fine gold inner border */}
        <div className="absolute inset-2 border border-gold/15 rounded-xl pointer-events-none z-30 group-hover:border-gold/40 transition-colors duration-500" />
        
        {/* Floating Editorial Stamp Badge */}
        <div className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full border border-gold/30 bg-midnight/75 backdrop-blur-md text-[9px] font-medium text-gold tracking-[0.22em] shadow-lg uppercase select-none font-sans">
          {label}
        </div>

        {/* Gradient shadow overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-700 z-10" />
        
        {/* Editorial Photograph */}
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.07] filter saturate-[0.78] opacity-85 brightness-90 group-hover:saturate-100 group-hover:opacity-100 group-hover:brightness-100"
          style={{ transform: 'translateZ(-10px)' }}
        />

        {/* Text Details */}
        <div 
          className="absolute bottom-0 left-0 p-7 w-full z-20 flex flex-col gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out"
          style={{ transform: 'translateZ(25px)' }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-ivory drop-shadow-md tracking-wide select-none font-normal">
            {title}
          </h3>
          <p className="font-serif italic text-base md:text-lg text-parchment/90 leading-relaxed opacity-80 group-hover:opacity-100 transition-all duration-500 delay-100 pr-2 select-none">
            "{description}"
          </p>
        </div>
      </div>
    </ParallaxTilt>
  );
};

export default MemoryCard;
