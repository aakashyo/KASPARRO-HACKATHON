import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeStore = async (storeUrl: string, accessToken: string) => {
  const response = await axios.post(`${API_BASE_URL}/analyze`, {
    store_url: storeUrl,
    access_token: accessToken,
  });
  return response.data;
};
