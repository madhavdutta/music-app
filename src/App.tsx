import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VinylRecord } from './components/VinylRecord';
import { AudioVisualizer } from './components/AudioVisualizer';
import { PlayerControls } from './components/PlayerControls';
import { TrackInfo } from './components/TrackInfo';
import { Playlist } from './components/Playlist';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { mockTracks } from './data/mockTracks';
import { Track } from './types/audio';
import { BarChart3, Radio, Disc } from 'lucide-react';

function App() {
  const {
    audioRef,
    currentTrack,
    audioState,
    visualizationData,
    loadTrack,
    togglePlay,
    setVolume,
    seek,
    toggleMute
  } = useAudioPlayer();

  const [playlist] = useState<Track[]>(mockTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [visualizationMode, setVisualizationMode] = useState<'bars' | 'wave' | 'circular'>('bars');

  // Load first track on mount
  useEffect(() => {
    if (playlist.length > 0 && !currentTrack) {
      loadTrack(playlist[0]);
      setCurrentTrackIndex(0);
    }
  }, [playlist, currentTrack, loadTrack]);

  const handleTrackSelect = (track: Track) => {
    const index = playlist.findIndex(t => t.id === track.id);
    if (index !== -1) {
      loadTrack(track);
      setCurrentTrackIndex(index);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    loadTrack(playlist[prevIndex]);
    setCurrentTrackIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    loadTrack(playlist[nextIndex]);
    setCurrentTrackIndex(nextIndex);
  };

  const handleToggleShuffle = () => {
    // Shuffle logic would go here
    console.log('Toggle shuffle');
  };

  const handleToggleRepeat = () => {
    // Repeat logic would go here
    console.log('Toggle repeat');
  };

  const getVisualizationIcon = () => {
    switch (visualizationMode) {
      case 'bars':
        return BarChart3;
      case 'wave':
        return Radio;
      case 'circular':
        return Disc;
      default:
        return BarChart3;
    }
  };

  const VisualizationIcon = getVisualizationIcon();

  const cycleVisualizationMode = () => {
    const modes: ('bars' | 'wave' | 'circular')[] = ['bars', 'wave', 'circular'];
    const currentIndex = modes.indexOf(visualizationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizationMode(modes[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <audio ref={audioRef} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Vinyl Player
          </h1>
          <p className="text-white/70">Professional Music Experience</p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vinyl & Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vinyl Record */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <VinylRecord
                track={currentTrack}
                isPlaying={audioState.isPlaying}
                className="mb-6"
              />
            </motion.div>

            {/* Track Info */}
            <TrackInfo
              track={currentTrack}
              audioState={audioState}
              onSeek={seek}
            />

            {/* Audio Visualizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Audio Visualizer</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cycleVisualizationMode}
                  className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white transition-colors"
                  title={`Switch to ${visualizationMode === 'bars' ? 'wave' : visualizationMode === 'wave' ? 'circular' : 'bars'} mode`}
                >
                  <VisualizationIcon size={20} />
                </motion.button>
              </div>
              
              <div className="flex justify-center">
                <AudioVisualizer
                  data={visualizationData}
                  mode={visualizationMode}
                  className="rounded-lg"
                />
              </div>
            </motion.div>

            {/* Player Controls */}
            <PlayerControls
              audioState={audioState}
              onTogglePlay={togglePlay}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
              onToggleShuffle={handleToggleShuffle}
              onToggleRepeat={handleToggleRepeat}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </div>

          {/* Right Column - Playlist */}
          <div className="space-y-6">
            <Playlist
              tracks={playlist}
              currentTrack={currentTrack}
              isPlaying={audioState.isPlaying}
              onTrackSelect={handleTrackSelect}
              onTogglePlay={togglePlay}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
