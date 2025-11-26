export function getCookie(name) {
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

export function getCSRFToken() {
  return getCookie('csrftoken');
}
export async function fetchWithCSRF(url, options = {}) {
  const csrfToken = getCSRFToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes((options.method || 'GET').toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken;
  }

  return fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });
}
