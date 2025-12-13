'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPauseCircle } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa6';
import { RECITERS } from '@/lib/api';
import { useReciter } from '@/contexts/ReciterContext';

interface AudioPlayerProps {
  audioFull: { [key: string]: string };
  surahName: string;
  surahNumber: number;
}

export default function AudioPlayer({ audioFull, surahName, surahNumber }: AudioPlayerProps) {
  const { selectedReciter, setSelectedReciter } = useReciter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Reset audio when reciter changes
  useEffect(() => {
    const resetAudio = async () => {
      if (audioRef.current) {
        const wasPlaying = isPlaying;
        
        // Pause current audio
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(0);
        
        // Load new audio
        audioRef.current.load();
        
        // Wait a bit for load to complete before trying to play
        if (wasPlaying) {
          await new Promise(resolve => setTimeout(resolve, 100));
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error auto-playing after reciter change:', error);
          }
        }
      }
    };
    
    resetAudio();
  }, [selectedReciter]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  const audioUrl = audioFull[selectedReciter] || Object.values(audioFull)[0];
  const currentReciter = RECITERS.find(r => r.id === selectedReciter);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Reciter Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pilih Qari
        </label>
        <select
          value={selectedReciter}
          onChange={(e) => setSelectedReciter(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        >
          {RECITERS.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-full w-14 h-14 flex items-center justify-center transition-colors shadow-md"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <FaPauseCircle className="text-2xl" />
          ) : (
            <FaPlay className="text-2xl" />
          )}
        </button>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
             Audio Bacaan
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {surahName}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {currentReciter?.name}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          onClick={handleProgressClick}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden"
        >
          <div
            className="h-full bg-green-600 transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
}
