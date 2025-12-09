'use client';

import { useState } from 'react';

interface AyahCardProps {
  ayah: {
    numberInSurah: number;
    teksArab: string;
    teksLatin?: string;
    teksIndonesia?: string;
    audio?: string;
  };
}

export default function AyahCard({ ayah }: AyahCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (ayah.audio) {
      if (isPlaying && audio) {
        audio.pause();
        setIsPlaying(false);
      } else {
        const newAudio = new Audio(ayah.audio);
        newAudio.play();
        newAudio.onended = () => setIsPlaying(false);
        setAudio(newAudio);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
          {ayah.numberInSurah}
        </span>
        {ayah.audio && (
          <button
            onClick={handlePlayAudio}
            className={`${
              isPlaying 
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            } rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-all`}
            title={isPlaying ? 'Stop audio' : 'Putar audio ayat ini'}
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
        )}
      </div>
      
      <p className="text-right text-2xl md:text-3xl leading-loose mb-4 text-gray-800 dark:text-white font-arabic">
        {ayah.teksArab}
      </p>
      
      {ayah.teksLatin && (
        <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-3 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
          <span className="font-semibold">Latin:</span> {ayah.teksLatin}
        </p>
      )}
      
      {ayah.teksIndonesia && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed border-t pt-4 border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-green-600 dark:text-green-400">Terjemahan:</span> {ayah.teksIndonesia}
        </p>
      )}
    </div>
  );
}
