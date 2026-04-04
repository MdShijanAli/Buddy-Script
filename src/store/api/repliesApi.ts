import { createApi } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../../api/apiRoutes";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface Reply {
  id: string;
  content: string;
  commentId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  liked?: boolean;
}

export interface CreateReplyRequest {
  content: string;
}

export interface UpdateReplyRequest {
  content: string;
}

export const repliesApi = createApi({
  reducerPath: "repliesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Replies"],
  endpoints: (builder) => ({
    getCommentReplies: builder.query<Reply[], string>({
      query: (commentId) => ({
        url: apiRoutes.reply.getCommentReplies(commentId),
        method: "GET",
      }),
      providesTags: (_result, _error, commentId) => [
        { type: "Replies", id: commentId },
      ],
    }),

    createReply: builder.mutation<
      Reply,
      { commentId: string; data: CreateReplyRequest }
    >({
      query: ({ commentId, data }) => ({
        url: apiRoutes.reply.createReply(commentId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { commentId }) => [
        { type: "Replies", id: commentId },
      ],
    }),

    deleteReply: builder.mutation<void, string>({
      query: (replyId) => ({
        url: apiRoutes.reply.deleteReply(replyId),
        method: "DELETE",
      }),
      invalidatesTags: ["Replies"],
    }),
  }),
});

export const {
  useGetCommentRepliesQuery,
  useCreateReplyMutation,
  useDeleteReplyMutation,
} = repliesApi;
