import React, { useState, useRef, useEffect } from 'react';
import { songsData } from '../constants/data.js';

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(songsData[0].song_url));

  const goToNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    const songEnded = () => {
      goToNextSong();
    };

    const currentAudio = audioRef.current;
    currentAudio.addEventListener('ended', songEnded);

    if (isPlaying) {
      currentAudio.play().catch((e) => console.error(e));
    }

    return () => {
      currentAudio.removeEventListener('ended', songEnded);
    };
  }, [isPlaying]);

  useEffect(() => {
    const switchSong = () => {
      const currentAudio = audioRef.current;
      currentAudio.src = songsData[currentSongIndex].song_url;
      if (isPlaying) {
        currentAudio.play().catch((e) => console.error(e));
      }
    };

    switchSong();

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [currentSongIndex]);

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    goToNextSong();
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : songsData.length - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-800 text-white">
      <div className="flex flex-col items-center md:flex-row md:items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <button onClick={prevSongHandler} className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-full md:text-base">
          Prev
        </button>
        <button onClick={playPauseHandler} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-400 rounded-full md:text-base">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextSongHandler} className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-full md:text-base">
          Next
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg md:text-xl">Now playing: <span className="text-blue-400">{songsData[currentSongIndex].song_name}</span></p>
        <p className="text-md md:text-lg">by <span className="text-blue-400">{Array.isArray(songsData[currentSongIndex].artist_name) ? songsData[currentSongIndex].artist_name.join(", ") : songsData[currentSongIndex].artist_name}</span></p>
      </div>
    </div>
  );
};

export default Track;