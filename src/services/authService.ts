import apiClient from "../api/apiClient";
import { apiRoutes } from "../api/apiRoutes";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        apiRoutes.auth.login,
        credentials,
      );

      const data = response.data;

      // Store tokens
      if (data.access_token || data.token) {
        const token = data.access_token || data.token;
        localStorage.setItem("authToken", token);
      }

      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }

      // Store user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        apiRoutes.auth.registration,
        credentials,
      );

      const data = response.data;

      // Store tokens
      if (data.access_token || data.token) {
        const token = data.access_token || data.token;
        localStorage.setItem("authToken", token);
      }

      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }

      // Store user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Sign out user
   */
  async signout(): Promise<void> {
    try {
      await apiClient.post(apiRoutes.auth.logout);
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      // Clear storage regardless of API response
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  /**
   * Get stored user info
   */
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
