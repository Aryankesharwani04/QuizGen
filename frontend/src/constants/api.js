export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  GOOGLE_LOGIN: '/auth/google-login/',
  LOGOUT: '/auth/logout/',
  CHECK: '/auth/check/',
  PROFILE: '/auth/profile/',
  PROFILE_UPDATE: '/auth/profile/update/',
  PROFILE_AVATAR: '/auth/profile/avatar/',
  PROFILE_HISTORY: '/auth/profile/history/',
  SEND_VERIFICATION: '/auth/send-verification/',
  VERIFY_EMAIL: '/auth/verify/',
  PASSWORD_RESET: '/auth/password-reset/',
  PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm/',
  QUIZ_CATEGORIES: '/quiz/categories/',
  QUIZ_SUBCATEGORIES: '/quiz/categories/:id/subcategories/',
  QUIZ_START: '/quiz/start/',
  QUIZ_SUBMIT: '/quiz/submit/',
  QUIZ_LEADERBOARD: '/quiz/leaderboard/',
  QUIZ_STATS: '/quiz/stats/',
};
export const SESSION_TIMEOUT_MINUTES = parseInt(
  import.meta.env.VITE_SESSION_TIMEOUT || '1440',
  10
);
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password is too weak. Use uppercase, lowercase, numbers, and symbols.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  INVALID_EMAIL: 'Invalid email address.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
};
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
};

export default API;
