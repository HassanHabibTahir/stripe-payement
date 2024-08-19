import React from 'react';

const SongList = ({ songs, onSelect }) => {
  return (
    <div className="song-list">
      {songs?.map((song) => (
        <div key={song?.id} className="song-card">
          <img src={song?.image_url} alt={song?.title} />
          <div className="content">
            <h2>{song?.title}</h2>
            <button onClick={() => onSelect(song.id)}>Play Song</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
