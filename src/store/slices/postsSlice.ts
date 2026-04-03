import { createSlice } from "@reduxjs/toolkit";

interface Post {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  liked?: boolean;
}

interface PostsState {
  selectedPost: Post | null;
  filters: {
    sortBy: "newest" | "trending";
    searchQuery: string;
  };
}

const initialState: PostsState = {
  selectedPost: null,
  filters: {
    sortBy: "newest",
    searchQuery: "",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
});

export const { setSelectedPost, setSortBy, setSearchQuery, clearSelectedPost } =
  postsSlice.actions;

export default postsSlice.reducer;
