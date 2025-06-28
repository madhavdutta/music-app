export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  artwork: string;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}

export interface VisualizationData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
}
