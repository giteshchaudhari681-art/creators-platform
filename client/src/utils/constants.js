// Application Constants

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  CREATE_POST_SUCCESS: 'Post created successfully!',
  UPDATE_POST_SUCCESS: 'Post updated successfully!',
  DELETE_POST_SUCCESS: 'Post deleted successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  IMAGE_UPLOAD_SUCCESS: 'Image uploaded successfully!',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_POST: '/create-post',
  EDIT_POST: '/edit-post/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const USER_ROLES = {
  USER: 'user',
  CREATOR: 'creator',
  ADMIN: 'admin',
};

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_IMAGE_SIZE = 5; // MB
export const MAX_POST_TITLE_LENGTH = 100;
export const MAX_POST_DESCRIPTION_LENGTH = 500;
export const MAX_CONTENT_LENGTH = 5000;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const DEBOUNCE_DELAY = 300; // ms
export const REQUEST_TIMEOUT = 10000; // ms

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PREFERENCES: 'preferences',
  THEME: 'theme',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  NEW_POST: 'newPost',
  POST_UPDATED: 'postUpdated',
  POST_DELETED: 'postDeleted',
  USER_ONLINE: 'userOnline',
  USER_OFFLINE: 'userOffline',
  NOTIFICATION: 'notification',
};

export const ANIMATIONS = {
  FADE_IN: 'animate-fadeIn',
  SLIDE_IN: 'animate-slideIn',
  SPIN: 'animate-spin',
  BOUNCE: 'animate-bounce',
  PULSE: 'animate-pulse',
};

export const BREAKPOINTS = {
  MOBILE: '640px',
  TABLET: '768px',
  DESKTOP: '1024px',
  WIDE: '1280px',
};

export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export default {
  API_BASE_URL,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  USER_ROLES,
  POST_STATUS,
  IMAGE_FORMATS,
  MAX_IMAGE_SIZE,
  PAGINATION,
  LOCAL_STORAGE_KEYS,
  THEMES,
  SOCKET_EVENTS,
  ANIMATIONS,
  BREAKPOINTS,
};
