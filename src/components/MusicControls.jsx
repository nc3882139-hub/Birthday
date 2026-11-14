import React from 'react';
import { useAudio } from '../context/AudioContext';
import { VolumeOffIcon, VolumeOnIcon } from './icons';

const MusicControls = ({ placement = 'floating' }) => {
  const { isPlaying, isMuted, volume, audioError, togglePlay, toggleMute, changeVolume } = useAudio();
  const volumeControlId = `ambient-volume-${placement}`;

  return (
    <div
      role="group"
      aria-label="Original ambient score controls"
      className={placement === 'nav'
        ? 'flex items-center gap-1 sm:gap-2'
        : 'fixed bottom-4 right-4 z-[70] flex items-center gap-2 rounded-full border border-gold/20 bg-midnight/85 px-2.5 py-2 shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:bottom-6 sm:right-6 sm:gap-3 sm:px-3'}
    >
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
        aria-pressed={isPlaying}
        className="grid h-7 w-7 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold transition-colors hover:bg-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:h-8 sm:w-8"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
            <path d="M7 5h4v14H7zM15 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5 h-3.5 w-3.5">
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute ambient music' : 'Mute ambient music'}
        aria-pressed={isMuted}
        className="grid h-7 w-7 place-items-center rounded-full border border-gold/15 bg-transparent text-gold/80 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:h-8 sm:w-8"
      >
        {isMuted ? <VolumeOffIcon className="h-4 w-4" /> : <VolumeOnIcon className="h-4 w-4" />}
      </button>

      <label className="sr-only" htmlFor={volumeControlId}>Ambient music volume</label>
      <input
        id={volumeControlId}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => changeVolume(event.target.value)}
        aria-valuetext={`${Math.round(volume * 100)} percent`}
        className="music-volume-slider w-10 cursor-pointer sm:w-16 md:w-20"
      />

      <span role="status" aria-live="polite" className="sr-only">{audioError}</span>
    </div>
  );
};

export default MusicControls;
