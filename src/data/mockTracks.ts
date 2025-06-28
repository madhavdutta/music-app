import { Track, Playlist } from '../types/audio';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Nocturnal Vibes',
    duration: 245,
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
  },
  {
    id: '2',
    title: 'Electric Pulse',
    artist: 'Neon Nights',
    album: 'Synthwave Collection',
    duration: 198,
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    audioUrl: 'https://file-examples.com/storage/fe68c8a7c4bb3b135e2c5c8/2017/11/file_example_MP3_700KB.mp3'
  },
  {
    id: '3',
    title: 'Ocean Waves',
    artist: 'Ambient Collective',
    album: 'Natural Sounds',
    duration: 312,
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: '4',
    title: 'Urban Rhythm',
    artist: 'City Beats',
    album: 'Street Symphony',
    duration: 267,
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3'
  },
  {
    id: '5',
    title: 'Cosmic Journey',
    artist: 'Space Odyssey',
    album: 'Interstellar',
    duration: 423,
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
  },
  {
    id: '6',
    title: 'Digital Dreams',
    artist: 'Cyber Collective',
    album: 'Future Sounds',
    duration: 189,
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audioUrl: 'https://file-examples.com/storage/fe68c8a7c4bb3b135e2c5c8/2017/11/file_example_MP3_1MG.mp3'
  },
  {
    id: '7',
    title: 'Retro Vibes',
    artist: 'Vintage Sound',
    album: 'Throwback Collection',
    duration: 234,
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: '8',
    title: 'Ambient Flow',
    artist: 'Peaceful Minds',
    album: 'Meditation Series',
    duration: 298,
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3'
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    tracks: mockTracks.slice(0, 4),
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Electronic Mix',
    tracks: mockTracks.slice(2, 6),
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Ambient Collection',
    tracks: [mockTracks[2], mockTracks[4], mockTracks[7]],
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Complete Collection',
    tracks: mockTracks,
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'
  }
];
