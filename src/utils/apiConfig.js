const LOCAL_API_URL = 'http://localhost:5000/api';
const PRODUCTION_API_URL = 'https://socialapp-backend-i2sv.onrender.com/api';

const getHostname = () => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname;
};

const isLocalHost = () => ['localhost', '127.0.0.1'].includes(getHostname());

const normalizeApiUrl = (url) => url.replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/, '');

const resolvedApiUrl =
  process.env.REACT_APP_API_URL || (isLocalHost() ? LOCAL_API_URL : PRODUCTION_API_URL);

export const API_URL = normalizeApiUrl(resolvedApiUrl);
export const isRenderApiHost = () => /render\.com|onrender\.com/i.test(API_URL);
