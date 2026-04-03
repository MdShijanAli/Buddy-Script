import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import type { RootState } from "../store";

export interface User {
  id: string;
  email: string;
  name?: string;
  profile_image?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  refresh_token?: string;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
  user?: User;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: apiRoutes.auth.login,
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: apiRoutes.auth.registration,
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: apiRoutes.auth.logout,
        method: "POST",
      }),
    }),

    refreshToken: builder.mutation<
      { access_token: string; refresh_token?: string },
      { refresh_token: string }
    >({
      query: (body) => ({
        url: apiRoutes.auth.refreshToken,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
