import { getToken } from './authService';

export default async function sendRequest(url, method = 'GET', payload = null) {
  const options = { method };

  if (payload instanceof FormData) {
    options.body = payload;
  } else if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }

  const token = getToken();
  if (token) {
    options.headers ||= {};
    options.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, options);

  if (res.ok) {
    const contentType = res.headers.get('content-type');
    if (
      res.status === 204 ||
      !contentType ||
      !contentType.includes('application/json')
    ) {
      return null; // ✅ Don't try to parse empty body
    }
    return res.json();
  }

  // Handle error response
  let errMessage = 'Something went wrong';
  try {
    const err = await res.json();
    errMessage = err.message || errMessage;
  } catch {
    // Fallback in case error body is also empty or invalid
  }
  throw new Error(errMessage);
}
