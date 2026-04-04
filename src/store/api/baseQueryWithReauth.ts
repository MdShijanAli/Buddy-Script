import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import { apiRoutes } from "../../api/apiRoutes";
import { logout, setTokens } from "../slices/authSlice";

const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

const getRequestUrl = (args: string | FetchArgs): string =>
  typeof args === "string" ? args : args.url;

const isUnauthorized = (error?: FetchBaseQueryError): boolean =>
  !!error && error.status === 401;

const isRefreshRequest = (args: string | FetchArgs): boolean => {
  const url = getRequestUrl(args);
  return url.includes("/token/refresh");
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

const refreshAccessToken = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const state = api.getState() as RootState;
    const refreshToken =
      state.auth.refreshToken || localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return null;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: apiRoutes.auth.refreshToken,
        method: "POST",
        body: { refreshToken: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.error) {
      return null;
    }

    const data = refreshResult.data as {
      success?: boolean;
      message?: string;
      data?: {
        accessToken?: string;
        refreshToken?: string;
        access_token?: string;
        refresh_token?: string;
      };
      access_token?: string;
      token?: string;
      refresh_token?: string;
      tokens?: {
        accessToken?: string;
        refreshToken?: string;
      };
    };

    const nextAccessToken =
      data?.data?.accessToken ||
      data?.data?.access_token ||
      data?.access_token ||
      data?.token ||
      data?.tokens?.accessToken ||
      null;
    const nextRefreshToken =
      data?.data?.refreshToken ||
      data?.data?.refresh_token ||
      data?.refresh_token ||
      data?.tokens?.refreshToken ||
      undefined;

    if (!nextAccessToken) {
      return null;
    }

    api.dispatch(
      setTokens({
        token: nextAccessToken,
        refreshToken: nextRefreshToken,
      }),
    );

    return nextAccessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (isUnauthorized(result.error) && !isRefreshRequest(args)) {
    const newAccessToken = await refreshAccessToken(api, extraOptions);

    if (newAccessToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    }

    if (!newAccessToken || isUnauthorized(result.error)) {
      api.dispatch(logout());
      redirectToLogin();
    }
  }

  return result;
};
