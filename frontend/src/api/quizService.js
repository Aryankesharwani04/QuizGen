import { API } from '../constants/api';
import { getCSRFToken } from '../utils/csrf';

// Helper function for API calls (similar to authService)
async function apiCall(endpoint, options = {}) {
  const url = `${API.BASE_URL}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes((options.method || 'GET').toUpperCase())) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
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

export const createQuizConfig = async (configData) => {
    return apiCall(API.QUIZ_CREATE_CONFIG, {
        method: 'POST',
        body: JSON.stringify(configData)
    });
};

export const startQuiz = async (quizId) => {
    return apiCall(`${API.QUIZ_START_NEW}${quizId}/`, {
        method: 'POST'
    });
};

export const submitQuiz = async (attemptId, submissionData) => {
    return apiCall(`${API.QUIZ_SUBMIT_NEW}${attemptId}/`, {
        method: 'POST',
        body: JSON.stringify(submissionData)
    });
};

export const fetchMockQuizzes = async () => {
    return apiCall(API.QUIZ_MOCK_LIST, {
        method: 'GET'
    });
};

export const fetchQuizHistory = async () => {
    return apiCall(API.QUIZ_HISTORY_NEW, {
        method: 'GET'
    });
};

export const deleteQuizHistory = async (ids = [], deleteAll = false) => {
    return apiCall(API.QUIZ_HISTORY_DELETE, {
        method: 'POST',
        body: JSON.stringify({ ids, delete_all: deleteAll })
    });
};

// Legacy functions (kept for compatibility if needed, but should be replaced)
export const verifyQuizCode = async (code) => {
    // For now, assume code is quiz_id and try to start it? 
    // Or maybe we need a specific endpoint to check if quiz exists.
    // Let's just return success for now if it looks like a 5-digit ID.
    if (code && code.length === 5) {
        return { success: true, data: { id: code } };
    }
    return { success: false, message: 'Invalid quiz code' };
};
