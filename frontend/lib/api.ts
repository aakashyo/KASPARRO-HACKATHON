import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeStore = async (storeUrl: string, accessToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      store_url: storeUrl,
      access_token: accessToken,
    }, {
      timeout: 120000 // 2 minute timeout for deep analysis
    });
    
    if (!response.data || !response.data.products) {
        throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
        throw new Error('Analysis timed out. Try analyzing fewer products or check server health.');
    }
    throw error;
  }
};
