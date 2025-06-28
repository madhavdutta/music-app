import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat,
  Repeat1
} from 'lucide-react';
import { AudioState } from '../types/audio';

interface PlayerControlsProps {
  audioState: AudioState;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  audioState,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onPrevious,
  onNext
}) => {
  const getRepeatIcon = () => {
    switch (audioState.repeatMode) {
      case 'one':
        return Repeat1;
      case 'all':
        return Repeat;
      default:
        return Repeat;
    }
  };

  const RepeatIcon = getRepeatIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between">
        {/* Secondary Controls */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              audioState.isShuffled 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Shuffle size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleRepeat}
            className={`p-2 rounded-lg transition-colors ${
              audioState.repeatMode !== 'none'
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <RepeatIcon size={20} />
          </motion.button>
        </div>

        {/* Main Controls */}
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevious}
            className="p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <SkipBack size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePlay}
            className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {audioState.isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <SkipForward size={24} />
          </motion.button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            {audioState.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
          
          <div className="w-24">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.isMuted ? 0 : audioState.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
