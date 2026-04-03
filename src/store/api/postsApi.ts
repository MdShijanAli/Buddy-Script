import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import type { RootState } from "../store";

export interface Post {
  id: string;
  title?: string;
  content: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  liked?: boolean;
}

export interface CreatePostRequest {
  content: string;
  title?: string;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Posts", "MyPosts"],
  endpoints: (builder) => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => ({
        url: apiRoutes.post.getAll,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    getMyPosts: builder.query<Post[], void>({
      query: () => ({
        url: apiRoutes.post.myPosts,
        method: "GET",
      }),
      providesTags: ["MyPosts"],
    }),

    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (body) => ({
        url: apiRoutes.post.create,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts", "MyPosts"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetMyPostsQuery,
  useCreatePostMutation,
} = postsApi;
