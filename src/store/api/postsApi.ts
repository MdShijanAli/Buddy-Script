import { createApi } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface Author {
  id: string;
  email: string;
  name: string;
  profile_image?: string | null;
}

export interface PostLike {
  id?: string;
  userId: string;
  postId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    profile_image?: string | null;
  };
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string;
  userId: string;
  authorId?: string;
  userName?: string;
  profile_image?: string | null;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  liked?: boolean;
  visibility?: string;
  isPublished?: boolean;
  author?: Author;
  likes?: PostLike[];
}

export interface CreatePostRequest {
  content: string;
  imageFile: File;
}

export interface UpdatePostRequest {
  postId: string;
  content: string;
  imageFile?: File | null;
  removeImage?: boolean;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: baseQueryWithReauth,
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

    deletePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: apiRoutes.post.delete(postId),
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "MyPosts"],
    }),

    updatePost: builder.mutation<Post, UpdatePostRequest>({
      query: ({ postId, content, imageFile, removeImage }) => {
        const formData = new FormData();
        formData.append("content", content);
        if (removeImage) {
          formData.append("removeImage", "true");
        } else if (imageFile) {
          formData.append("imageUrl", imageFile);
        }
        return {
          url: apiRoutes.post.update(postId),
          method: "PUT",
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
  useDeletePostMutation,
  useUpdatePostMutation,
} = postsApi;
