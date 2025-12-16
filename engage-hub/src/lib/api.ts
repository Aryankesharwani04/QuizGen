// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Type definitions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  username?: string;
  avatar?: string;
  avatar_file?: string;
  bio?: string;
  preferences?: {
    interests?: string[];
    [key: string]: any;
  };
  is_email_verified: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/auth`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          success: false,
          message: error.message,
          errors: { detail: [error.message] },
        };
      }
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request<null>("/logout/", {
      method: "POST",
    });
  }

  async checkAuth(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/check/", {
      method: "GET",
    });
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/profile/", {
      method: "GET",
    });
  }

  async uploadAvatar(file: File): Promise<ApiResponse<UserProfile>> {
    const formData = new FormData();
    formData.append("avatar", file);

    const url = `${this.baseURL}/profile/avatar/`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  }

  async updateProfile(data: {
    full_name?: string;
    bio?: string;
    preferences?: any;
  }): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/profile/update/", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async createQuiz(data: {
    category: string;
    title: string;
    level: "easy" | "medium" | "hard";
    num_questions: number;
    duration_seconds: number;
    additional_instructions?: string;
  }): Promise<ApiResponse<any>> {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/quiz/create/`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Quiz creation failed");
    }

    const result = await response.json();
    return result.data
      ? result
      : {
        success: true,
        message: "OK",
        data: result,
      };
  }

  async getQuizList(): Promise<ApiResponse<{ quizzes: any[]; count: number }>> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/list/`);
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return response.json();
  }

  async getQuizQuestions(quizId: string): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_BASE_URL}/api/quiz/${quizId}/questions/`
    );
    if (!response.ok) throw new Error("Failed to fetch quiz questions");
    return response.json();
  }

  async saveQuizAttempt(
    quizId: string,
    selectedAnswers: any,
    timeTaken: number
  ): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/quiz/attempt/save/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        quiz_id: quizId,
        selected_answers: selectedAnswers,
        time_taken: timeTaken,
      }),
    });

    if (!response.ok) throw new Error("Failed to save quiz attempt");
    return response.json();
  }

  async getHistorySummary(): Promise<ApiResponse<any>> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/auth/quiz/history/summary/`,
      {
        method: "GET",
        headers,
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch history summary");
    return response.json();
  }

  async getQuizHistory(): Promise<ApiResponse<any>> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/quiz/history/`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch quiz history");
    return response.json();
  }

  async getQuizHistoryById(attemptId: number): Promise<ApiResponse<any>> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/auth/quiz/history/${attemptId}/`,
      {
        method: "GET",
        headers,
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch quiz attempt");
    return response.json();
  }

  async getCategoryPerformance(): Promise<ApiResponse<any>> {
    return this.request("/quiz/category-performance/", {
      method: "GET",
    });
  }


  async getUserStreak(): Promise<ApiResponse<any>> {
    return this.request("/streak/", {
      method: "GET",
    });
  }

  async getUserXP(): Promise<ApiResponse<any>> {
    return this.request("/xp/", {
      method: "GET",
    });
  }

  // New CSV-based quiz APIs
  async getQuizzesByCategory(
    category: string,
    subtopic: string
  ): Promise<any> {
    const params = new URLSearchParams({ category, subtopic });
    const response = await fetch(
      `${API_BASE_URL}/api/quiz/by-category/?${params}`
    );
    if (!response.ok) throw new Error("Failed to fetch quizzes by category");
    return response.json();
  }

  async countQuizzesByCategory(
    category: string,
    subtopic: string
  ): Promise<any> {
    const params = new URLSearchParams({ category, subtopic });
    const response = await fetch(
      `${API_BASE_URL}/api/quiz/count-by-category/?${params}`
    );
    if (!response.ok)
      throw new Error("Failed to count quizzes by category");
    return response.json();
  }

  async getQuizQuestionsFromCSV(quizId: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/quiz/csv/${quizId}/questions/`
    );
    if (!response.ok)
      throw new Error("Failed to fetch quiz questions from CSV");
    return response.json();
  }

  // Get quizzes created by the authenticated user
  async getMyCreatedQuizzes() {
    return this.request('/quiz/my-quizzes/', {
      method: 'GET',
    });
  }
}

export const api = new ApiService();

