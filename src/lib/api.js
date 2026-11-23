/**
 * Centralized API utility for MentorLagbe frontend.
 * Communicates with backend endpoints using NEXT_PUBLIC_API_URL.
 * Supports GET, POST, PATCH, PUT, and DELETE methods.
 * Automatically attaches JWT Authorization headers when provided.
 * Supports JSON payloads and FormData without overriding multipart boundaries.
 * Includes credentials for session-based endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Universal request function
 * @param {string} endpoint - API path, e.g. '/api/tuitions' or 'tuitions'
 * @param {object} options - fetch options
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    token,
    headers = {},
    credentials = 'include',
    ...rest
  } = options;

  // Normalize endpoint URL
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  const url = `${API_BASE_URL}${fullPath}`;

  const requestHeaders = { ...headers };

  // Attach JWT Bearer token if available
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Handle request body
  let requestBody = body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body !== undefined && !isFormData && typeof body === 'object') {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }
  // When body is FormData, do NOT set Content-Type header so the browser sets the boundary automatically

  const config = {
    method,
    headers: requestHeaders,
    credentials,
    ...rest,
  };

  if (requestBody !== undefined && method !== 'GET' && method !== 'HEAD') {
    config.body = requestBody;
  }

  try {
    const response = await fetch(url, config);
    let data = null;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    throw error;
  }
}

// Convenience methods
export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

