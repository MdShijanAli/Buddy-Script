import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import { authApi } from "./api/authApi";
import { postsApi } from "./api/postsApi";
import { commentsApi } from "./api/commentsApi";
import { repliesApi } from "./api/repliesApi";
import { likesApi } from "./api/likesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [repliesApi.reducerPath]: repliesApi.reducer,
    [likesApi.reducerPath]: likesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postsApi.middleware,
      commentsApi.middleware,
      repliesApi.middleware,
      likesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
