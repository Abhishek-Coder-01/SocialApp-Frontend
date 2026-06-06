import { isRenderApiHost } from './apiConfig';

let state = {
  activeRequests: 0,
  showNotice: false,
  message: '',
  isRenderHost: isRenderApiHost(),
};

const listeners = new Set();
let noticeTimer = null;

const emit = () => {
  listeners.forEach((listener) => listener(state));
};

const clearNoticeTimer = () => {
  if (noticeTimer) {
    clearTimeout(noticeTimer);
    noticeTimer = null;
  }
};

export const subscribeApiStatus = (listener) => {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
};

export const getApiStatusSnapshot = () => state;

export const beginApiRequest = () => {
  state = {
    ...state,
    activeRequests: state.activeRequests + 1,
    isRenderHost: isRenderApiHost(),
  };

  if (state.isRenderHost && state.activeRequests === 1) {
    clearNoticeTimer();
    noticeTimer = setTimeout(() => {
      state = {
        ...state,
        showNotice: true,
        message: 'Render server is waking up. Please wait a moment.',
      };
      emit();
    }, 2000);
  }

  emit();
};

export const endApiRequest = () => {
  state = {
    ...state,
    activeRequests: Math.max(0, state.activeRequests - 1),
  };

  if (state.activeRequests === 0) {
    clearNoticeTimer();
  }

  emit();
  return state.activeRequests;
};

export const showApiNotice = (message) => {
  clearNoticeTimer();
  state = {
    ...state,
    showNotice: true,
    message,
  };
  emit();
};

export const hideApiNotice = () => {
  clearNoticeTimer();
  state = {
    ...state,
    showNotice: false,
    message: '',
  };
  emit();
};
