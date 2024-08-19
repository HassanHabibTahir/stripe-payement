import React, { useEffect, useRef, useState } from 'react';
import { getSong } from '../api';

const SongPlayer = ({ songId }) => {
  const [song, setSong] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const fetchedSong = await getSong(songId);
        setSong(fetchedSong[0]);
      } catch (error) {
        console.error('Error fetching song:', error);
      }
    };

    if (songId) {
      fetchSong();
    }
  }, [songId]);

  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Error auto-playing audio:', error);
      });
    }
  }, [song]);

  if (!song) {
    return <div>Loading...</div>;
  }

  return (
    <div className="song-player">
      <h2>{song.title}</h2>
      <audio ref={audioRef} controls src={song.audio_url}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default SongPlayer;
