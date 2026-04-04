import { createApi } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId?: string;
  authorId?: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  repliesCount?: number;
  liked?: boolean;
  author?: {
    id: string;
    email?: string;
    name?: string;
    profile_image?: string;
  };
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId?: string;
  authorId?: string;
  content: string;
  imageUrl?: string | null;
  likesCount?: number;
  createdAt: string;
  updatedAt?: string;
  userName?: string;
  userAvatar?: string;
  author?: {
    id: string;
    email?: string;
    name?: string;
    profile_image?: string;
  };
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getPostComments: builder.query<Comment[], string>({
      query: (postId) => ({
        url: apiRoutes.comment.getPostComments(postId),
        method: "GET",
      }),
      transformResponse: (response: { comments?: Comment[] }) =>
        response.comments ?? [],
      providesTags: (_result, _error, postId) => [
        { type: "Comments", id: postId },
      ],
    }),

    createComment: builder.mutation<
      Comment,
      { postId: string; data: CreateCommentRequest }
    >({
      query: ({ postId, data }) => ({
        url: apiRoutes.comment.createComment(postId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),

    updateComment: builder.mutation<
      Comment,
      { commentId: string; data: UpdateCommentRequest }
    >({
      query: ({ commentId, data }) => ({
        url: apiRoutes.comment.updateComment(commentId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({
        url: apiRoutes.comment.deleteComment(commentId),
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
