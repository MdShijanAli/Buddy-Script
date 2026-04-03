const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

const createApiUrl = (endpoint: string) => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export const apiRoutes = {
  auth: {
    login: createApiUrl("auth/sign-in"),
    registration: createApiUrl("auth/sign-up"),
    logout: createApiUrl("auth/sign-out"),
    refreshToken: createApiUrl("token/refresh"),
  },

  post: {
    getAll: createApiUrl("posts"),
    myPosts: createApiUrl("posts/my-posts"),
    create: createApiUrl("posts"),
  },

  like: {
    likePost: (postId: string) => createApiUrl(`likes/post/${postId}`),
    unlike: (likeId: string) => createApiUrl(`likes/${likeId}`),
    getPostLikes: (postId: string) => createApiUrl(`likes/post/${postId}`),
    likeComment: (commentId: string) =>
      createApiUrl(`likes/comment/${commentId}`),
    getCommentLikes: (commentId: string) =>
      createApiUrl(`likes/comment/${commentId}`),
    likeReply: (replyId: string) => createApiUrl(`likes/reply/${replyId}`),
    getReplyLikes: (replyId: string) => createApiUrl(`likes/reply/${replyId}`),
  },

  comment: {
    createComment: (postId: string) => createApiUrl(`comments/${postId}`),
    getPostComments: (postId: string) => createApiUrl(`comments/${postId}`),
    updateComment: (commentId: string) => createApiUrl(`comments/${commentId}`),
    deleteComment: (commentId: string) => createApiUrl(`comments/${commentId}`),
  },

  reply: {
    createReply: (commentId: string) => createApiUrl(`replies/${commentId}`),
    getCommentReplies: (commentId: string) =>
      createApiUrl(`replies/${commentId}`),
    updateReply: (replyId: string) => createApiUrl(`replies/${replyId}`),
    deleteReply: (replyId: string) => createApiUrl(`replies/${replyId}`),
  },
};
