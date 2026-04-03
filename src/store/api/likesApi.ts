import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import type { RootState } from "../store";

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  replyId?: string;
}

export const likesApi = createApi({
  reducerPath: "likesApi",
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
  tagTypes: ["Likes"],
  endpoints: (builder) => ({
    getPostLikes: builder.query<Like[], string>({
      query: (postId) => ({
        url: apiRoutes.like.getPostLikes(postId),
        method: "GET",
      }),
      providesTags: (_result, _error, postId) => [
        { type: "Likes", id: `post-${postId}` },
      ],
    }),

    likePost: builder.mutation<Like, string>({
      query: (postId) => ({
        url: apiRoutes.like.likePost(postId),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Likes", id: `post-${postId}` },
      ],
    }),

    unlikePost: builder.mutation<void, string>({
      query: (likeId) => ({
        url: apiRoutes.like.unlike(likeId),
        method: "DELETE",
      }),
      invalidatesTags: ["Likes"],
    }),

    getCommentLikes: builder.query<Like[], string>({
      query: (commentId) => ({
        url: apiRoutes.like.getCommentLikes(commentId),
        method: "GET",
      }),
      providesTags: (_result, _error, commentId) => [
        { type: "Likes", id: `comment-${commentId}` },
      ],
    }),

    likeComment: builder.mutation<Like, string>({
      query: (commentId) => ({
        url: apiRoutes.like.likeComment(commentId),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, commentId) => [
        { type: "Likes", id: `comment-${commentId}` },
      ],
    }),

    getReplyLikes: builder.query<Like[], string>({
      query: (replyId) => ({
        url: apiRoutes.like.getReplyLikes(replyId),
        method: "GET",
      }),
      providesTags: (_result, _error, replyId) => [
        { type: "Likes", id: `reply-${replyId}` },
      ],
    }),

    likeReply: builder.mutation<Like, string>({
      query: (replyId) => ({
        url: apiRoutes.like.likeReply(replyId),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, replyId) => [
        { type: "Likes", id: `reply-${replyId}` },
      ],
    }),
  }),
});

export const {
  useGetPostLikesQuery,
  useLazyGetPostLikesQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetCommentLikesQuery,
  useLikeCommentMutation,
  useGetReplyLikesQuery,
  useLikeReplyMutation,
} = likesApi;
