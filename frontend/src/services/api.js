import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// In-flight GET dedup: identical concurrent GETs (StrictMode double-effects,
// dashboard→history refetch races) share one promise instead of hitting the
// backend twice. No behavior change for distinct requests.
const pendingGets = new Map();
api.interceptors.request.use((config) => {
  if ((config.method || 'get').toLowerCase() !== 'get' || config.__deduped) return config;
  const key = `${config.baseURL || ''}${config.url || ''}::${JSON.stringify(config.params || {})}`;
  if (pendingGets.has(key)) {
    config.adapter = () => pendingGets.get(key);
    config.__deduped = true;
  } else {
    let resolveOuter;
    const shared = new Promise((resolve) => { resolveOuter = resolve; });
    pendingGets.set(key, shared);
    config.__dedupKey = key;
    config.__resolveShared = resolveOuter;
  }
  return config;
});
api.interceptors.response.use(
  (response) => {
    const key = response.config?.__dedupKey;
    if (key) {
      response.config.__resolveShared?.(response);
      pendingGets.delete(key);
    }
    return response;
  },
  (error) => {
    const key = error.config?.__dedupKey;
    if (key) {
      // Share the rejection too, then clear so retries work.
      error.config.__resolveShared?.(Promise.reject(error));
      pendingGets.delete(key);
    }
    // A forbidden request is not a logout. Keep the session so the page can
    // display the server's actual access/availability message.
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A forbidden request is not a logout. Keep the session so the page can
    // display the server's actual access/availability message.
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
