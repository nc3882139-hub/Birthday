import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const activeOscillators = useRef([]);
  const timerId = useRef(null);
  
  // Note frequencies matching beautiful warm jazz chord extensions
  const chords = [
    [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9 (C3, E3, G3, B3, D4)
    [110.00, 130.81, 164.81, 196.00, 246.94], // Am9 (A2, C3, E3, G3, B3)
    [87.31, 110.00, 130.81, 164.81, 196.00],  // Fmaj9 (F2, A2, C3, E3, G3)
    [98.00, 123.47, 146.83, 174.61, 220.00]   // G11/G9 (G2, B2, D3, F3, A3)
  ];
  
  const currentChordIndex = useRef(0);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playChord = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    
    // Cycle chord
    const chordNotes = chords[currentChordIndex.current];
    currentChordIndex.current = (currentChordIndex.current + 1) % chords.length;
    
    // master gain for this specific chord block
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.06, now + 1.8); // slow atmospheric fade-in
    masterGain.gain.setValueAtTime(0.06, now + 3.0);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8); // soft decay
    
    // lowpass filter to create warm, mellow piano timbre
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);
    
    masterGain.connect(filter);
    filter.connect(ctx.destination);
    
    // play each note of the chord with a light arpeggiation delay
    chordNotes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      // Mellow triangle wave
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      oscGain.gain.setValueAtTime(0.1, now);
      oscGain.gain.exponentialRampToValueAtTime(0.03, now + 4.2);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      osc.start(now + index * 0.08);
      osc.stop(now + 4.9);
      
      activeOscillators.current.push(osc);
    });
    
    // clear memory arrays
    setTimeout(() => {
      activeOscillators.current = activeOscillators.current.filter(o => o.state !== 'stopped');
    }, 5500);
  };

  const playTick = () => {
    initAudio();
    if (!audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') return;
    
    const now = ctx.currentTime;
    
    // Quick organic glass click
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(300, now);
    
    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  };

  const togglePlay = () => {
    initAudio();
    
    if (isPlaying) {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playChord();
      timerId.current = setInterval(playChord, 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, playTick }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;
