import React from 'react';
import { motion } from 'framer-motion';
import { Track } from '../types/audio';

interface VinylRecordProps {
  track: Track | null;
  isPlaying: boolean;
  className?: string;
}

export const VinylRecord: React.FC<VinylRecordProps> = ({ 
  track, 
  isPlaying, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Vinyl Record */}
      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{
          duration: 8,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear"
        }}
        className="relative w-80 h-80 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black vinyl-shadow"
      >
        {/* Vinyl grooves */}
        <div className="absolute inset-4 rounded-full border border-gray-700/30" />
        <div className="absolute inset-8 rounded-full border border-gray-700/20" />
        <div className="absolute inset-12 rounded-full border border-gray-700/15" />
        <div className="absolute inset-16 rounded-full border border-gray-700/10" />
        
        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 rounded-full bg-black" />
        </div>
        
        {/* Album artwork overlay */}
        {track && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-white/20"
          >
            <img
              src={track.artwork}
              alt={track.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop';
              }}
            />
          </motion.div>
        )}
      </motion.div>
      
      {/* Tonearm */}
      <motion.div
        animate={{ rotate: isPlaying ? -15 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute -top-4 -right-8 w-32 h-2 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full origin-right shadow-lg"
        style={{ transformOrigin: '90% 50%' }}
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-500 rounded-full shadow-md" />
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 rounded-full shadow-lg" />
      </motion.div>
      
      {/* Glow effect when playing */}
      {isPlaying && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full glow-effect pointer-events-none"
        />
      )}
    </div>
  );
};
