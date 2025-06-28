import React from 'react';
import { motion } from 'framer-motion';
import { Track, AudioState } from '../types/audio';

interface TrackInfoProps {
  track: Track | null;
  audioState: AudioState;
  onSeek: (time: number) => void;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  audioState, 
  onSeek 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    onSeek(time);
  };

  if (!track) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-6 text-center"
      >
        <p className="text-white/70">Select a track to start playing</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{track.title}</h2>
        <p className="text-lg text-white/80 mb-1">{track.artist}</p>
        <p className="text-white/60">{track.album}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>{formatTime(audioState.currentTime)}</span>
          <span>{formatTime(audioState.duration)}</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max={audioState.duration || 0}
            value={audioState.currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg pointer-events-none"
            style={{ 
              width: `${(audioState.currentTime / (audioState.duration || 1)) * 100}%` 
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
