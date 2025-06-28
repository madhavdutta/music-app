import React, { useEffect, useRef } from 'react';
import { VisualizationData } from '../types/audio';

interface AudioVisualizerProps {
  data: VisualizationData;
  mode: 'bars' | 'wave' | 'circular';
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  data, 
  mode, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (mode === 'bars') {
      drawBars(ctx, data.frequencies, width, height);
    } else if (mode === 'wave') {
      drawWave(ctx, data.waveform, width, height);
    } else if (mode === 'circular') {
      drawCircular(ctx, data.frequencies, width, height);
    }
  }, [data, mode]);

  const drawBars = (ctx: CanvasRenderingContext2D, frequencies: Uint8Array, width: number, height: number) => {
    const barCount = 64;
    const barWidth = width / barCount;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = (frequencies[i] / 255) * height * 0.8;
      const x = i * barWidth;
      const y = height - barHeight;
      
      const hue = (i / barCount) * 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
  };

  const drawWave = (ctx: CanvasRenderingContext2D, waveform: Uint8Array, width: number, height: number) => {
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const sliceWidth = width / waveform.length;
    let x = 0;
    
    for (let i = 0; i < waveform.length; i++) {
      const v = waveform[i] / 128.0;
      const y = (v * height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, frequencies: Uint8Array, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    const barCount = 64;
    
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const barHeight = (frequencies[i] / 255) * radius;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      const hue = (i / barCount) * 360;
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className={`bg-black/20 rounded-lg ${className}`}
    />
  );
};
