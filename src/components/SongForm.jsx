import React, { useState } from "react";
import { generateSong } from "../api";

const SongForm = ({ onSongGenerated,setActiveTab }) => {
  const [prompt, setPrompt] = useState("");
  const [makeInstrumental, setMakeInstrumental] = useState(true);
  const [waitAudio, setWaitAudio] = useState(true);
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const song = await generateSong({
        prompt,
        make_instrumental: makeInstrumental,
        wait_audio: waitAudio,
        tags,
        title,
      });
      setLoading(false);
      setActiveTab("list")
      console.log(song);
      onSongGenerated(song);
    } catch (error) {
      setLoading(false);
      console.error("Error generating song:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a song prompt"
            required
          />
        </label>
      </div>
      {/* <div>
        <label>
          Make Instrumental:
          <input
            type="checkbox"
            checked={makeInstrumental}
            onChange={(e) => setMakeInstrumental(e.target.checked)}
          />
        </label>
      </div> */}
      {/* <div>
        <label>
          Wait Audio:
          <input
            type="checkbox"
            checked={waitAudio}
            onChange={(e) => setWaitAudio(e.target.checked)}
          />
        </label>
      </div> */}
      <div>
        <label>
          Tags:
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags"
          />
        </label>
      </div>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
          />
        </label>
      </div>
      <button type="submit">{loading?"Loading...":"Generate Song"}</button>
    </form>
  );
};

export default SongForm;
