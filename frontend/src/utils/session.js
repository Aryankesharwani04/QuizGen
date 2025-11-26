import { SESSION_TIMEOUT_MINUTES } from '../constants/api';

export function parseCookies() {
  const cookies = {};

  if (typeof document === 'undefined') {
    return cookies;
  }

  document.cookie.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });

  return cookies;
}

export function getCookie(name) {
  const cookies = parseCookies();
  return cookies[name] || null;
}

export function hasAuthCookie() {
  return !!getCookie('sessionid');
}

export function getSessionId() {
  return getCookie('sessionid');
}

export function getSessionStatus() {
  const hasSessionCookie = hasAuthCookie();
  const sessionId = getSessionId();
  const lastCheckTime = Date.now();
  const lastActivityStr = localStorage.getItem('lastActivity');
  const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : lastCheckTime;
  const isExpired = isSessionExpired(lastActivity, SESSION_TIMEOUT_MINUTES);

  return {
    isAuthenticated: hasSessionCookie && !isExpired,
    hasSessionCookie,
    sessionId,
    lastCheckTime,
    lastActivity,
    isExpired,
  };
}

export function isSessionExpired(lastActiveTimestamp, timeoutMinutes = SESSION_TIMEOUT_MINUTES) {
  if (!lastActiveTimestamp) return false;

  const now = Date.now();
  const elapsedMinutes = (now - lastActiveTimestamp) / (1000 * 60);

  return elapsedMinutes > timeoutMinutes;
}

export function updateActivityTimestamp() {
  localStorage.setItem('lastActivity', Date.now().toString());
}

export function getSessionTimeRemaining() {
  const lastActivityStr = localStorage.getItem('lastActivity');
  const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : Date.now();

  const now = Date.now();
  const elapsedMinutes = (now - lastActivity) / (1000 * 60);
  const remainingMinutes = SESSION_TIMEOUT_MINUTES - elapsedMinutes;

  return remainingMinutes;
}

export function initializeSession() {
  if (!localStorage.getItem('lastActivity')) {
    updateActivityTimestamp();
  }
  const activityEvents = ['click', 'keydown', 'scroll', 'touchstart'];

  activityEvents.forEach((event) => {
    window.addEventListener(event, updateActivityTimestamp, { passive: true });
  });
  return () => {
    activityEvents.forEach((event) => {
      window.removeEventListener(event, updateActivityTimestamp);
    });
  };
}
export function clearSession() {
  localStorage.removeItem('lastActivity');
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

export function shouldWarnAboutSessionExpiry(warningThresholdMinutes = 5) {
  const remaining = getSessionTimeRemaining();
  return remaining > 0 && remaining < warningThresholdMinutes;
}

export function debugLogCookies() {
  console.log('=== Current Cookies ===');
  const cookies = parseCookies();
  Object.entries(cookies).forEach(([name, value]) => {
    console.log(`${name}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  });
  console.log('=======================');
}

export function debugLogSessionStatus() {
  const status = getSessionStatus();
  console.log('=== Session Status ===');
  console.log('Authenticated:', status.isAuthenticated);
  console.log('Has Cookie:', status.hasSessionCookie);
  console.log('Session ID:', status.sessionId);
  console.log('Is Expired:', status.isExpired);
  console.log('Time Remaining:', `${Math.ceil(getSessionTimeRemaining())} minutes`);
  console.log('=====================');
}

export default {
  parseCookies,
  getCookie,
  hasAuthCookie,
  getSessionId,
  getSessionStatus,
  isSessionExpired,
  updateActivityTimestamp,
  getSessionTimeRemaining,
  initializeSession,
  clearSession,
  shouldWarnAboutSessionExpiry,
  debugLogCookies,
  debugLogSessionStatus,
};
