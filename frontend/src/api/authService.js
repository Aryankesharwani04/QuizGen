
import { API } from '../constants/api';
import { getCSRFToken } from '../utils/csrf';

async function apiCall(endpoint, options = {}) {
  const url = `${API.BASE_URL}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  // Add CSRF token for mutation requests (POST, PUT, PATCH, DELETE)
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes((options.method || 'GET').toUpperCase())) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    });
    
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : { message: response.statusText };

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: data.message || data.error || 'An error occurred',
        statusCode: response.status,
        errors: data.errors || {},
      };
    }

    return {
      success: true,
      data: data,
      message: data.message || 'Success',
      statusCode: response.status,
    };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      data: null,
      message: error.message || 'Network error occurred',
      statusCode: 0,
    };
  }
}
export async function registerUser(credentials) {
  return apiCall(API.REGISTER, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
export async function loginUser(credentials) {
  return apiCall(API.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function googleSignIn(googleToken) {
  return apiCall(API.GOOGLE_LOGIN, {
    method: 'POST',
    body: JSON.stringify({ token: googleToken }),
  });
}
export async function logoutUser() {
  return apiCall(API.LOGOUT, {
    method: 'POST',
  });
}

export async function checkAuth() {
  return apiCall(API.CHECK, {
    method: 'GET',
  });
}

export async function getProfile() {
  return apiCall(API.PROFILE, {
    method: 'GET',
  });
}

export async function updateProfile(data) {
  return apiCall(API.PROFILE_UPDATE, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch(`${API.BASE_URL}${API.PROFILE_AVATAR}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: data.message || 'Avatar upload failed',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data,
      message: 'Avatar uploaded successfully',
      statusCode: response.status,
    };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Upload failed',
      statusCode: 0,
    };
  }
}

export async function getHistory(options = {}) {
  const queryString = new URLSearchParams(options).toString();
  const endpoint = queryString ? `${API.PROFILE_HISTORY}?${queryString}` : API.PROFILE_HISTORY;
  
  return apiCall(endpoint, {
    method: 'GET',
  });
}

export async function sendVerificationEmail() {
  return apiCall(API.SEND_VERIFICATION, {
    method: 'POST',
  });
}

export async function verifyEmail(token) {
  return apiCall(`${API.VERIFY_EMAIL}?token=${token}`, {
    method: 'GET',
  });
}
export async function requestPasswordReset(data) {
  return apiCall(API.PASSWORD_RESET, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function confirmPasswordReset(data) {
  return apiCall(API.PASSWORD_RESET_CONFIRM, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

export function getCookies() {
  return document.cookie.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {});
}


export function hasSessionCookie() {
  return document.cookie.includes('sessionid');
}

export default {
  registerUser,
  loginUser,
  googleSignIn,
  logoutUser,
  checkAuth,
  getProfile,
  updateProfile,
  updateAvatar,
  getHistory,
  sendVerificationEmail,
  verifyEmail,
  requestPasswordReset,
  confirmPasswordReset,
  getCsrfToken,
  getCookies,
  hasSessionCookie,
};
