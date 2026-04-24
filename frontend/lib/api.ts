const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getStoredCredentials = () => {
  if (typeof window === 'undefined') return { store_url: null, access_token: null };
  return {
    store_url: localStorage.getItem('shopify_url'),
    access_token: localStorage.getItem('shopify_token'),
  };
};

export const analyzeStore = async (
  storeUrl: string, 
  accessToken: string,
  onUpdate: (data: any) => void
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store_url: storeUrl, access_token: accessToken }),
    });

    if (!response.body) throw new Error('No response body from analysis engine');

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
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            onUpdate(data);
          } catch (e) {
            console.error('Error parsing stream line:', e, trimmed);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Analysis stream failed:', error);
    throw error;
  }
};

export const simulateQuery = async (query: string, products: any[]) => {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, products }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Simulation failed' }));
    throw new Error(err.detail || 'Simulation failed');
  }

  return response.json();
};

export const pushFixes = async (
  productId: string,
  description: string,
  tags: string[]
) => {
  const credentials = getStoredCredentials();
  if (!credentials.store_url || !credentials.access_token) {
    throw new Error('Missing Shopify credentials. Please reconnect your store.');
  }

  const response = await fetch(`${API_BASE_URL}/push-fixes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, description, tags, ...credentials }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Push failed' }));
    throw new Error(err.detail || 'Push failed');
  }

  return response.json();
};

export async function pushBulkFixes(fixes: { product_id: string, description: string, tags: string[] }[]): Promise<any> {
  const credentials = getStoredCredentials();
  if (!credentials.store_url || !credentials.access_token) {
    throw new Error('Missing Shopify credentials. Please reconnect your store.');
  }

  const response = await fetch(`${API_BASE_URL}/push-bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fixes, ...credentials }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Bulk push failed' }));
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
      `"${(p.title || '').replace(/"/g, '""')}"`,
      audit?.gaps?.severity ?? scan?.severity ?? '',
      audit?.impact?.before_score != null ? Math.round(audit.impact.before_score * 100) : '',
      audit?.impact?.after_score != null ? Math.round(audit.impact.after_score * 100) : '',
      `"${(audit?.gaps?.insight || scan?.basic_gap || '').replace(/"/g, '""')}"`,
      `"${(audit?.fixes?.improved_description || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'FAQ preview failed' }));
    throw new Error(err.detail || 'Failed to preview FAQ page');
  }
  return response.json();
};

export const pushFAQPage = async (products: any[]) => {
  const credentials = getStoredCredentials();
  if (!credentials.store_url || !credentials.access_token) {
    throw new Error('Missing Shopify credentials. Please reconnect your store.');
  }

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
