import axios from 'axios';

const API_URL = 'https://suno-api-v2-five.vercel.app/api'; // Replace with the actual API URL

export const generateSong = async (prompt) => {
  try {
    console.log(prompt ,"prompt")
    const response = await axios.post(`${API_URL}/custom_generate`, prompt );
    console.log(response,"response")
    return response.data;
  } catch (error) {
    console.error('Error generating song:', error);
    throw error;
  }
};

export const getSong = async (songId) => {
  try {
    const response = await axios.get(`${API_URL}/get?ids=${songId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching song:', error);
    throw error;
  }
};
export const getAllSongs = async () => {
    try {
      const response = await axios.get(`${API_URL}/get`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all songs:', error);
      throw error;
    }
  };