import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import type { RootState } from "../store";

export interface Author {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string;
  userId: string;
  authorId?: string;
  userName?: string;
  profile_image?: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  liked?: boolean;
  visibility?: string;
  isPublished?: boolean;
  author?: Author;
}

export interface CreatePostRequest {
  content: string;
  imageFile: File;
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
      transformResponse: (response: any) => response.posts || [],
      providesTags: ["Posts"],
    }),

    getMyPosts: builder.query<Post[], void>({
      query: () => ({
        url: apiRoutes.post.myPosts,
        method: "GET",
      }),
      transformResponse: (response: any) => response.posts || [],
      providesTags: ["MyPosts"],
    }),

    createPost: builder.mutation<Post, CreatePostRequest>({
      query: ({ content, imageFile }) => {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("imageUrl", imageFile);
        return {
          url: apiRoutes.post.create,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Posts", "MyPosts"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetMyPostsQuery,
  useCreatePostMutation,
} = postsApi;
