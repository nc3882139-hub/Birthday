import React, { useEffect, useRef, useState } from 'react';
import AudioContext from './audioContextValue';

const CHORD_PROGRESSIONS = [
  { pad: [130.81, 196, 246.94, 293.66], piano: [392, 493.88, 587.33, 493.88] },
  { pad: [110, 164.81, 196, 246.94], piano: [329.63, 392, 493.88, 392] },
  { pad: [87.31, 130.81, 164.81, 196], piano: [261.63, 329.63, 392, 329.63] },
  { pad: [98, 146.83, 174.61, 220], piano: [293.66, 349.23, 440, 349.23] }
];

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.38);
  const [audioError, setAudioError] = useState('');
  const audioCtxRef = useRef(null);
  const musicGainRef = useRef(null);
  const uiGainRef = useRef(null);
  const activeVoices = useRef([]);
  const timerId = useRef(null);
  const currentChordIndex = useRef(0);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const volumeRef = useRef(0.38);
  const startPendingRef = useRef(false);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) throw new Error('Web Audio is not supported in this browser.');

      const context = new AudioContextConstructor();
      const musicGain = context.createGain();
      const uiGain = context.createGain();
      musicGain.gain.value = 0;
      uiGain.gain.value = isMutedRef.current ? 0 : 0.18;
      musicGain.connect(context.destination);
      uiGain.connect(context.destination);

      audioCtxRef.current = context;
      musicGainRef.current = musicGain;
      uiGainRef.current = uiGain;
    }

    return audioCtxRef.current;
  };

  const rampMusicGain = (target, seconds) => {
    const context = audioCtxRef.current;
    const gain = musicGainRef.current;
    if (!context || !gain) return;

    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(target, now, seconds);
  };

  const registerVoice = (oscillator, voiceGain, filter) => {
    activeVoices.current.push({ oscillator, gain: voiceGain });
    oscillator.onended = () => {
      activeVoices.current = activeVoices.current.filter((voice) => voice.oscillator !== oscillator);
      oscillator.disconnect();
      voiceGain.disconnect();
      filter.disconnect();
    };
  };

  const playChord = () => {
    const context = audioCtxRef.current;
    if (!context || context.state !== 'running' || !isPlayingRef.current || isMutedRef.current) return;

    const now = context.currentTime;
    const chord = CHORD_PROGRESSIONS[currentChordIndex.current];
    currentChordIndex.current = (currentChordIndex.current + 1) % CHORD_PROGRESSIONS.length;

    chord.pad.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const voiceGain = context.createGain();
      const end = now + 6.7;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(780 + index * 75, now);
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.linearRampToValueAtTime(0.018, now + 1.15);
      voiceGain.gain.setValueAtTime(0.018, now + 4.7);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.connect(filter);
      filter.connect(voiceGain);
      voiceGain.connect(musicGainRef.current);
      registerVoice(oscillator, voiceGain, filter);
      oscillator.start(now);
      oscillator.stop(end);
    });

    chord.piano.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const voiceGain = context.createGain();
      const start = now + 0.35 + index * 0.82;
      const end = start + 2.4;

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1850, start);
      voiceGain.gain.setValueAtTime(0.0001, start);
      voiceGain.gain.linearRampToValueAtTime(0.045, start + 0.025);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.connect(filter);
      filter.connect(voiceGain);
      voiceGain.connect(musicGainRef.current);
      registerVoice(oscillator, voiceGain, filter);
      oscillator.start(start);
      oscillator.stop(end);
    });
  };

  const startMusic = async () => {
    if (isPlayingRef.current || startPendingRef.current) return;
    startPendingRef.current = true;

    try {
      const context = getAudioContext();
      if (context.state === 'suspended') await context.resume();

      isPlayingRef.current = true;
      setIsPlaying(true);
      setAudioError('');
      rampMusicGain(isMutedRef.current ? 0 : volumeRef.current, 0.65);
      playChord();
      timerId.current = window.setInterval(playChord, 6500);
    } catch (error) {
      console.error('Unable to start the ambient score.', error);
      setAudioError('Ambient music is unavailable in this browser.');
    } finally {
      startPendingRef.current = false;
    }
  };

  const stopMusic = () => {
    if (timerId.current) {
      window.clearInterval(timerId.current);
      timerId.current = null;
    }

    isPlayingRef.current = false;
    setIsPlaying(false);
    rampMusicGain(0, 0.16);

    const context = audioCtxRef.current;
    if (!context) return;
    const stopAt = context.currentTime + 0.45;
    activeVoices.current.forEach(({ oscillator, gain }) => {
      if (oscillator.state === 'stopped') return;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setTargetAtTime(0.0001, context.currentTime, 0.08);
      oscillator.stop(stopAt);
    });
  };

  const togglePlay = () => {
    if (isPlayingRef.current) {
      stopMusic();
    } else {
      void startMusic();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
    rampMusicGain(nextMuted || !isPlayingRef.current ? 0 : volumeRef.current, 0.12);
    const context = audioCtxRef.current;
    const uiGain = uiGainRef.current;
    if (context && uiGain) {
      uiGain.gain.setTargetAtTime(nextMuted ? 0 : 0.18, context.currentTime, 0.04);
    }
  };

  const changeVolume = (nextVolume) => {
    const next = Math.max(0, Math.min(1, Number(nextVolume)));
    volumeRef.current = next;
    setVolume(next);
    rampMusicGain(isMutedRef.current || !isPlayingRef.current ? 0 : next, 0.12);
  };

  const resumeAudioContext = async (context, soundLabel) => {
    if (context.state !== 'suspended') return true;

    try {
      await context.resume();
      return true;
    } catch (error) {
      console.error(`Unable to resume audio for ${soundLabel}.`, error);
      setAudioError('Sound effects are unavailable in this browser.');
      return false;
    }
  };

  const playTick = async () => {
    let context;
    try {
      context = getAudioContext();
    } catch (error) {
      console.error('Unable to play the interface sound.', error);
      return;
    }

    if (!await resumeAudioContext(context, 'the interface sound')) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(300, now);

    oscillator.connect(gain);
    gain.connect(filter);
    filter.connect(uiGainRef.current);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      filter.disconnect();
    };
    oscillator.start(now);
    oscillator.stop(now + 0.08);
  };

  const playPop = async () => {
    let context;
    try {
      context = getAudioContext();
    } catch (error) {
      console.error('Unable to play the balloon sound.', error);
      return;
    }

    if (!await resumeAudioContext(context, 'the balloon sound')) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(190, now);
    oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.11);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(uiGainRef.current);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      filter.disconnect();
    };
    oscillator.start(now);
    oscillator.stop(now + 0.13);
  };

  useEffect(() => () => {
    if (timerId.current) window.clearInterval(timerId.current);
    activeVoices.current.forEach(({ oscillator }) => {
      if (oscillator.state !== 'stopped') oscillator.stop();
    });
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      void audioCtxRef.current.close();
    }
  }, []);

  return (
    <AudioContext.Provider value={{
      isPlaying,
      isMuted,
      volume,
      audioError,
      startMusic,
      togglePlay,
      toggleMute,
      changeVolume,
      playTick,
      playPop
    }}>
      {children}
    </AudioContext.Provider>
  );
};
