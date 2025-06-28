import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, AudioState, VisualizationData } from '../types/audio';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none'
  });
  const [visualizationData, setVisualizationData] = useState<VisualizationData>({
    frequencies: new Uint8Array(128),
    waveform: new Uint8Array(128)
  });

  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume audio context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
        
        console.log('Audio context initialized successfully');
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    }
  }, []);

  const updateVisualization = useCallback(() => {
    if (analyserRef.current) {
      const frequencies = new Uint8Array(analyserRef.current.frequencyBinCount);
      const waveform = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      analyserRef.current.getByteFrequencyData(frequencies);
      analyserRef.current.getByteTimeDomainData(waveform);
      
      setVisualizationData({ frequencies, waveform });
    }
    
    if (audioState.isPlaying) {
      animationRef.current = requestAnimationFrame(updateVisualization);
    }
  }, [audioState.isPlaying]);

  useEffect(() => {
    if (audioState.isPlaying) {
      updateVisualization();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioState.isPlaying, updateVisualization]);

  // Test audio format support
  const testAudioSupport = useCallback(() => {
    const audio = document.createElement('audio');
    const formats = {
      mp3: audio.canPlayType('audio/mpeg'),
      ogg: audio.canPlayType('audio/ogg'),
      wav: audio.canPlayType('audio/wav'),
      m4a: audio.canPlayType('audio/mp4')
    };
    console.log('Supported audio formats:', formats);
    return formats;
  }, []);

  const loadTrack = useCallback(async (track: Track) => {
    if (audioRef.current) {
      try {
        console.log('Testing audio format support...');
        testAudioSupport();
        
        // Stop current playback
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        // Set crossOrigin to handle CORS
        audioRef.current.crossOrigin = 'anonymous';
        
        // Load new track
        audioRef.current.src = track.audioUrl;
        setCurrentTrack(track);
        setAudioState(prev => ({ 
          ...prev, 
          currentTime: 0, 
          duration: 0, 
          isPlaying: false 
        }));
        
        console.log('Loading track:', track.title, track.audioUrl);
        
        // Wait for the audio to load with timeout
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.error('Audio load timeout');
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            reject(new Error('Audio load timeout'));
          }, 10000);
          
          const handleCanPlay = () => {
            console.log('Audio can play:', track.title);
            clearTimeout(timeout);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            resolve(true);
          };
          
          const handleError = (e: Event) => {
            console.error('Audio load error:', e);
            clearTimeout(timeout);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            reject(e);
          };
          
          audioRef.current?.addEventListener('canplay', handleCanPlay);
          audioRef.current?.addEventListener('error', handleError);
          audioRef.current?.load();
        });
        
      } catch (error) {
        console.error('Error loading track:', error);
        alert(`Failed to load audio: ${error.message}. This might be due to CORS restrictions or unsupported format.`);
      }
    }
  }, [testAudioSupport]);

  const play = useCallback(async () => {
    if (audioRef.current && currentTrack) {
      try {
        console.log('Attempting to play:', currentTrack.title);
        console.log('Audio ready state:', audioRef.current.readyState);
        console.log('Audio network state:', audioRef.current.networkState);
        
        // Initialize audio context on first play
        await initializeAudioContext();
        
        // Ensure audio context is running
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        // Check if audio is ready to play
        if (audioRef.current.readyState < 3) {
          console.log('Audio not ready, waiting...');
          await new Promise((resolve) => {
            const handleCanPlay = () => {
              audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
              resolve(true);
            };
            audioRef.current?.addEventListener('canplaythrough', handleCanPlay);
          });
        }
        
        // Play the audio
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setAudioState(prev => ({ ...prev, isPlaying: true }));
          console.log('Audio playing successfully');
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioState(prev => ({ ...prev, isPlaying: false }));
        
        // Handle specific error types
        if (error.name === 'NotAllowedError') {
          console.log('Autoplay prevented. User interaction required.');
          alert('Please click the play button to start audio playback. Autoplay is blocked by your browser.');
        } else if (error.name === 'NotSupportedError') {
          console.log('Audio format not supported');
          alert('Audio format not supported by your browser. Please try a different track.');
        } else if (error.name === 'AbortError') {
          console.log('Audio playback aborted');
          alert('Audio playback was interrupted. Please try again.');
        } else {
          alert(`Playback error: ${error.message}`);
        }
      }
    }
  }, [currentTrack, initializeAudioContext]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      console.log('Audio paused');
    }
  }, []);

  const togglePlay = useCallback(() => {
    console.log('Toggle play - current state:', audioState.isPlaying);
    if (audioState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [audioState.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !audioState.isMuted;
      audioRef.current.volume = newMuted ? 0 : audioState.volume;
      setAudioState(prev => ({ ...prev, isMuted: newMuted }));
    }
  }, [audioState.isMuted, audioState.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setAudioState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setAudioState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      console.log('Audio ended');
      setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handleCanPlay = () => {
      console.log('Audio can play - ready for playback');
    };

    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      console.error('Audio error details:', {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState,
        src: audio.src
      });
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    const handleWaiting = () => {
      console.log('Audio waiting for data');
    };

    const handlePlaying = () => {
      console.log('Audio started playing');
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      console.log('Audio paused');
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleStalled = () => {
      console.log('Audio download stalled');
    };

    const handleSuspend = () => {
      console.log('Audio loading suspended');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('suspend', handleSuspend);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('suspend', handleSuspend);
    };
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = audioState.volume;
      audioRef.current.preload = 'metadata';
      audioRef.current.crossOrigin = 'anonymous';
      console.log('Audio element initialized');
    }
  }, [audioState.volume]);

  return {
    audioRef,
    currentTrack,
    audioState,
    visualizationData,
    loadTrack,
    togglePlay,
    setVolume,
    seek,
    toggleMute,
    play,
    pause
  };
};
