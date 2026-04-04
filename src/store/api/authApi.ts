import { createApi } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

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
  baseQuery: baseQueryWithReauth,
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
