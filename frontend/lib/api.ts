const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getStoredCredentials = () => ({
  store_url: typeof window !== 'undefined' ? localStorage.getItem('shopify_url') : null,
  access_token: typeof window !== 'undefined' ? localStorage.getItem('shopify_token') : null,
});

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

export const simulateQuery = async (query: string, products: any[]) => {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, products }),
  });

  if (!response.ok) {
    throw new Error('Simulation failed');
  }

  return response.json();
};

export const pushFixes = async (
  productId: string,
  description: string,
  tags: string[]
) => {
  const credentials = getStoredCredentials();
  const response = await fetch(`${API_BASE_URL}/push-fixes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, description, tags, ...credentials }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Push failed');
  }

  return response.json();
};

export async function pushBulkFixes(fixes: { product_id: string, description: string, tags: string[] }[]): Promise<any> {
  const credentials = getStoredCredentials();
  const response = await fetch(`${API_BASE_URL}/push-bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fixes, ...credentials }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Failed to push bulk fixes');
  }
  return response.json();
}

export const exportReportCSV = (products: any[]) => {
  const headers = ['Product', 'Severity', 'AI Score Before', 'AI Score After', 'Gap Insight', 'Improved Description'];
  const rows = products.map((p: any) => {
    const audit = p.audit_deep;
    const scan = p.scan_quick;
    return [
      `"${p.title}"`,
      audit?.gaps?.severity ?? scan?.severity ?? '',
      audit?.impact?.before_score != null ? Math.round(audit.impact.before_score * 100) : '',
      audit?.impact?.after_score != null ? Math.round(audit.impact.after_score * 100) : '',
      `"${(audit?.gaps?.insight || scan?.basic_gap || '').replace(/"/g, "'")}"`,
      `"${(audit?.fixes?.improved_description || '').replace(/"/g, "'")}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `repoptimizer-audit-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const validateCredentials = async (storeUrl: string, accessToken: string) => {
  const response = await fetch(`${API_BASE_URL}/validate-credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store_url: storeUrl, access_token: accessToken }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Validation failed' }));
    throw new Error(err.detail || 'Invalid Store URL or API Token');
  }

  return response.json();
};

export const previewFAQPage = async (products: any[]) => {
  const credentials = getStoredCredentials();
  const response = await fetch(`${API_BASE_URL}/preview-faq-page`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products, ...credentials }),
  });
  if (!response.ok) throw new Error('Failed to preview FAQ page');
  return response.json();
};

export const pushFAQPage = async (products: any[]) => {
  const credentials = getStoredCredentials();

  const response = await fetch(`${API_BASE_URL}/push-faq-page`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products, ...credentials }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'FAQ push failed' }));
    throw new Error(err.detail || 'Failed to push FAQ page');
  }

  return response.json();
};


export const fetchConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/config`);
  if (!response.ok) throw new Error('Failed to fetch config');
  return response.json();
};
