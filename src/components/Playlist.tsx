import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';
import { Track } from '../types/audio';

interface PlaylistProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onTogglePlay: () => void;
}

export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onTogglePlay
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center mb-6">
        <Music className="text-white mr-3" size={24} />
        <h3 className="text-xl font-semibold text-white">Playlist</h3>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                isCurrentTrack 
                  ? 'bg-purple-500/20 border border-purple-400/30' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => onTrackSelect(track)}
            >
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop';
                    }}
                  />
                  {isCurrentTrack && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay();
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </motion.button>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${
                    isCurrentTrack ? 'text-white' : 'text-white/90'
                  }`}>
                    {track.title}
                  </h4>
                  <p className={`text-sm truncate ${
                    isCurrentTrack ? 'text-white/80' : 'text-white/60'
                  }`}>
                    {track.artist}
                  </p>
                </div>

                <div className={`text-sm ${
                  isCurrentTrack ? 'text-white/80' : 'text-white/50'
                }`}>
                  {formatDuration(track.duration)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
