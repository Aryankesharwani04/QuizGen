// Google Sign-In Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Initialize Google Sign-In
export const initializeGoogleSignIn = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.accounts) {
        resolve(window.google.accounts);
      } else {
        reject(new Error('Google Sign-In script loaded but google.accounts not available'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Sign-In script'));
    };
    
    document.head.appendChild(script);
  });
};

export const decodeGoogleToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding Google token:', error);
    return null;
  }
};

export const extractGoogleUserData = (token) => {
  const decodedToken = decodeGoogleToken(token);
  
  if (!decodedToken) {
    return null;
  }

  return {
    email: decodedToken.email,
    full_name: decodedToken.name,
    avatar: decodedToken.picture,
    google_id: decodedToken.sub,
    email_verified: decodedToken.email_verified,
  };
};
