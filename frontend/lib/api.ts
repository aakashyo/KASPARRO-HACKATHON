const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const analyzeStore = async (
  storeUrl: string, 
  accessToken: string,
  onUpdate: (data: any) => void
) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store_url: storeUrl, access_token: accessToken }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim().startsWith('data: ')) {
        try {
          const data = JSON.parse(line.trim().slice(6));
          onUpdate(data);
        } catch (e) {
          console.error('Error parsing stream line:', e);
        }
      }
    }
  }
};
