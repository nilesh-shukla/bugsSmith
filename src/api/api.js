const API_BASE_URL = 'http://localhost:5000';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  //Handling JWT expiry/invalidity
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/'; // force logout
    throw new Error('Session expired');
  }

  if(!response.ok){
    const errorData = await response.json();
    throw new Error(errorData.error || 'Request failed');
  }

  return response.json();
}
