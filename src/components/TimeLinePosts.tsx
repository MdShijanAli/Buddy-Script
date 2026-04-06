import reactImage1 from "../assets/images/react_img1.png";
import reactImage2 from "../assets/images/react_img2.png";
import reactImage3 from "../assets/images/react_img3.png";
import reactImage4 from "../assets/images/react_img4.png";
import reactImage5 from "../assets/images/react_img5.png";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useMultipleDropdowns } from "../hooks";
import {
  postsApi,
  useGetAllPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  type Post,
  type PostLike,
} from "../store/api/postsApi";
import {
  useLazyGetPostLikesQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../store/api/likesApi";
import {
  useLazyGetPostCommentsQuery,
  type Comment,
} from "../store/api/commentsApi";
import type { RootState } from "../store/store";
import DeletePostModal from "./timeline/DeletePostModal";
import EditPostModal from "./timeline/EditPostModal";
import PostCommentsSection from "./timeline/PostCommentsSection";
import PostReactionsBar from "./timeline/PostReactionsBar";
import { getRelativeTime } from "./timeline/utils";

export default function TimeLinePosts() {
  const { toggleDropdown, isDropdownOpen, closeAllDropdowns } =
    useMultipleDropdowns();
  const [reactions, setReactions] = useState<
    Record<
      string,
      {
        liked: boolean;
        likesCount: number;
        likeId?: string;
        pending: boolean;
        likePreviewUsers: PostLike[];
      }
    >
  >({});
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedCommentsByPost, setExpandedCommentsByPost] = useState<
    Record<string, boolean>
  >({});
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, Comment[]>
  >({});
  const [commentsLoadingByPost, setCommentsLoadingByPost] = useState<
    Record<string, boolean>
  >({});

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [getPostLikes] = useLazyGetPostLikesQuery();
  const [getPostComments] = useLazyGetPostCommentsQuery();
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const { data: posts, isLoading, isError } = useGetAllPostsQuery();

  const currentUserLike = useMemo<PostLike | null>(() => {
    if (!user?.id) return null;

    return {
      userId: user.id,
      user: {
        id: user.id,
        email: user.email || "",
        name: user.name || user.firstName || "You",
        profile_image: user.profile_image || user.profileImage || null,
      },
    };
  }, [user]);

  const getLikeUserId = (like: PostLike) => like.userId || like.user?.id || "";
  const getLikeDisplayName = (like: PostLike) => {
    const likeUserId = getLikeUserId(like);
    if (user?.id && likeUserId === user.id) {
      return user.name || user.firstName || "You";
    }

    return like.user?.name || "User";
  };
  const getCurrentUserPostLikeId = (likes?: PostLike[]) =>
    user?.id
      ? likes?.find((item) => getLikeUserId(item) === user.id)?.id
      : undefined;

  useEffect(() => {
    if (!posts) return;

    setReactions((prev) => {
      const next = { ...prev };
      posts.forEach((post) => {
        const current = next[post.id];
        const likeUsersFromResponse = post.likes ?? [];
        const likedFromLikesList = Boolean(
          user?.id &&
          likeUsersFromResponse.some((item) => getLikeUserId(item) === user.id),
        );
        const likedFromResponse = Boolean(post.liked || likedFromLikesList);
        const likesCountFromResponse =
          post.likes?.length ?? post.likesCount ?? 0;
        const mergedPreviewUsers = [...likeUsersFromResponse];

        if (
          likedFromResponse &&
          currentUserLike &&
          !mergedPreviewUsers.some(
            (item) => getLikeUserId(item) === getLikeUserId(currentUserLike),
          )
        ) {
          mergedPreviewUsers.unshift(currentUserLike);
        }

        next[post.id] = {
          liked: current?.pending ? current.liked : likedFromResponse,
          likesCount: current?.pending
            ? current.likesCount
            : likesCountFromResponse,
          likeId:
            current?.likeId ?? getCurrentUserPostLikeId(likeUsersFromResponse),
          pending: current?.pending ?? false,
          likePreviewUsers: current?.pending
            ? current.likePreviewUsers
            : mergedPreviewUsers.slice(0, 5),
        };
      });
      return next;
    });
  }, [posts, user?.id, currentUserLike]);

  const handleLike = async (postId: string) => {
    const postFromData = posts?.find((item) => item.id === postId);

    const current =
      reactions[postId] ??
      ({
        liked: Boolean(
          user?.id &&
          postFromData?.likes?.some((item) => getLikeUserId(item) === user.id),
        ),
        likesCount:
          postFromData?.likes?.length ?? postFromData?.likesCount ?? 0,
        likeId: getCurrentUserPostLikeId(postFromData?.likes),
        pending: false,
        likePreviewUsers: postFromData?.likes ?? [],
      } as {
        liked: boolean;
        likesCount: number;
        likeId?: string;
        pending: boolean;
        likePreviewUsers: PostLike[];
      });

    if (current.pending) return;

    const willLike = !current.liked;
    const rollbackState = current;
    const nextPreviewUsers = willLike
      ? currentUserLike &&
        !current.likePreviewUsers.some(
          (item) => getLikeUserId(item) === getLikeUserId(currentUserLike),
        )
        ? [currentUserLike, ...current.likePreviewUsers].slice(0, 5)
        : current.likePreviewUsers
      : current.likePreviewUsers.filter(
          (item) => getLikeUserId(item) !== user?.id,
        );

    setReactions((prev) => ({
      ...prev,
      [postId]: {
        ...current,
        liked: willLike,
        likesCount: willLike
          ? current.likesCount + 1
          : Math.max(0, current.likesCount - 1),
        pending: true,
        likePreviewUsers: nextPreviewUsers,
      },
    }));

    try {
      if (willLike) {
        const createdLike = await likePost(postId).unwrap();
        setReactions((prev) => ({
          ...prev,
          [postId]: {
            ...(prev[postId] ?? current),
            liked: true,
            likeId: createdLike.id,
            pending: false,
          },
        }));
        dispatch(postsApi.util.invalidateTags(["Posts", "MyPosts"]));
        return;
      }

      let likeId = current.likeId;
      if (!likeId && user?.id) {
        const postLikesResponse = await getPostLikes(postId).unwrap();
        const postLikes = Array.isArray(postLikesResponse)
          ? postLikesResponse
          : ((
              postLikesResponse as {
                likes?: Array<{ id: string; userId: string; postId?: string }>;
              }
            ).likes ?? []);
        likeId = postLikes.find((item) => item.userId === user.id)?.id;
      }

      if (!likeId) {
        throw new Error("Unable to find like record for unlike");
      }

      await unlikePost(likeId).unwrap();
      setReactions((prev) => ({
        ...prev,
        [postId]: {
          ...(prev[postId] ?? current),
          liked: false,
          likeId: undefined,
          pending: false,
        },
      }));
      dispatch(postsApi.util.invalidateTags(["Posts", "MyPosts"]));
    } catch {
      setReactions((prev) => ({
        ...prev,
        [postId]: {
          ...rollbackState,
          pending: false,
        },
      }));
      toast.error("Unable to update like right now.");
    }
  };

  const handleDropdownToggle = (
    event: React.MouseEvent<HTMLButtonElement>,
    postId: string,
  ) => {
    event.stopPropagation();
    toggleDropdown(`drop_${postId}`);
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    postId: string,
  ) => {
    event.preventDefault();
    setDeletePostId(postId);
    closeAllDropdowns();
  };

  const handleConfirmDelete = async () => {
    if (!deletePostId) return;

    setIsDeleting(true);
    try {
      await deletePost(deletePostId).unwrap();
      toast.success("Post deleted successfully");
      setDeletePostId(null);
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      toast.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          "Failed to delete post",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletePostId(null);
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    postId: string,
  ) => {
    event.preventDefault();
    setEditPostId(postId);
    setIsEditModalOpen(true);
    closeAllDropdowns();
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditPostId(null);
  };

  const handleSaveEdit = async (content: string, imageFile: File | null, removeImage: boolean = false) => {
    if (!editPostId) return;

    try {
      await updatePost({
        postId: editPostId,
        content,
        imageFile,
        removeImage,
      }).unwrap();
      toast.success("Post updated successfully");
      setIsEditModalOpen(false);
      setEditPostId(null);
    } catch (err: any) {
      console.error("Failed to update post:", err);
      toast.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          "Failed to update post",
      );
    }
  };

  const getEditingPost = () => {
    return posts?.find((post) => post.id === editPostId) || null;
  };

  const loadCommentsAndReplies = async (postId: string) => {
    setCommentsLoadingByPost((prev) => ({ ...prev, [postId]: true }));
    try {
      const fetchedComments = await getPostComments(postId).unwrap();
      setCommentsByPost((prev) => ({ ...prev, [postId]: fetchedComments }));
    } catch {
      toast.error("Unable to load comments right now.");
    } finally {
      setCommentsLoadingByPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleComments = (postId: string) => {
    const willExpand = !expandedCommentsByPost[postId];

    setExpandedCommentsByPost((prev) => ({
      ...prev,
      [postId]: willExpand,
    }));

    if (
      willExpand &&
      !commentsByPost[postId] &&
      !commentsLoadingByPost[postId]
    ) {
      void loadCommentsAndReplies(postId);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("._feed_inner_timeline_post_box_dropdown")) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeAllDropdowns]);

  if (isLoading) {
    return (
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (isError || !posts) {
    return (
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
          <p>Failed to load posts. Please try again.</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
          <p>No posts available.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {posts.map((post: Post) => {
        const baseLikesCount = post.likes?.length ?? post.likesCount ?? 0;
        const liveLikesCount = reactions[post.id]?.likesCount ?? baseLikesCount;
        const reactionIcons = [
          reactImage1,
          reactImage2,
          reactImage3,
          reactImage4,
          reactImage5,
        ];
        const liveLikePreviewUsers =
          reactions[post.id]?.likePreviewUsers ?? post.likes ?? [];
        const visibleReactionCount = Math.min(
          liveLikesCount,
          Math.max(liveLikePreviewUsers.length, reactionIcons.length),
        );
        const visibleReactionUsers = liveLikePreviewUsers.slice(
          0,
          visibleReactionCount,
        );

        return (
          <div
            key={post.id}
            className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
          >
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
              <div className="_feed_inner_timeline_post_top">
                <div className="_feed_inner_timeline_post_box">
                  <div className="_feed_inner_timeline_post_box_image">
                    {post.author?.profile_image ? (
                      <img
                        src={post.author.profile_image}
                        alt={post.author.name}
                        className="_post_img"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    ) : (
                      <div
                        className="_post_img"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#e0e0e0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#666",
                        }}
                      >
                        {post.author?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="_feed_inner_timeline_post_box_txt">
                    <h4 className="_feed_inner_timeline_post_box_title">
                      {post.author?.name || "Anonymous"}
                    </h4>
                    <p className="_feed_inner_timeline_post_box_para">
                      {getRelativeTime(post.createdAt)} .
                      <a href="#0">{post.visibility || "Public"}</a>
                    </p>
                  </div>
                </div>

                <div className="_feed_inner_timeline_post_box_dropdown">
                  <div className="_feed_timeline_post_dropdown">
                    <button
                      type="button"
                      className="_feed_timeline_post_dropdown_link"
                      onClick={(event) => handleDropdownToggle(event, post.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="4"
                        height="17"
                        fill="none"
                        viewBox="0 0 4 17"
                      >
                        <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                        <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                        <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                      </svg>
                    </button>
                  </div>

                  {/* Dropdown */}
                  <div
                    className={`_feed_timeline_dropdown _timeline_dropdown ${
                      isDropdownOpen(`drop_${post.id}`) ? "show" : ""
                    }`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ul className="_feed_timeline_dropdown_list">
                      <li className="_feed_timeline_dropdown_item">
                        <a
                          href="#0"
                          className="_feed_timeline_dropdown_link"
                          onClick={(e) => {
                            e.preventDefault();
                            closeAllDropdowns();
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="#1890FF"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.2"
                                d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
                              />
                            </svg>
                          </span>
                          Save Post
                        </a>
                      </li>
                      <li className="_feed_timeline_dropdown_item">
                        <a
                          href="#0"
                          className="_feed_timeline_dropdown_link"
                          onClick={(e) => {
                            e.preventDefault();
                            closeAllDropdowns();
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="22"
                              fill="none"
                              viewBox="0 0 20 22"
                            >
                              <path
                                fill="#377DFF"
                                fillRule="evenodd"
                                d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          Turn On Notification
                        </a>
                      </li>
                      <li className="_feed_timeline_dropdown_item">
                        <a
                          href="#0"
                          className="_feed_timeline_dropdown_link"
                          onClick={(e) => {
                            e.preventDefault();
                            closeAllDropdowns();
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="#1890FF"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.2"
                                d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"
                              />
                            </svg>
                          </span>
                          Hide
                        </a>
                      </li>
                      {post.authorId === user?.id && (
                        <>
                          <li className="_feed_timeline_dropdown_item">
                            <a
                              href="#0"
                              className="_feed_timeline_dropdown_link"
                              onClick={(e) => handleEditClick(e, post.id)}
                            >
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="#1890FF"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.2"
                                    d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
                                  />
                                  <path
                                    stroke="#1890FF"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.2"
                                    d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
                                  />
                                </svg>
                              </span>
                              Edit Post
                            </a>
                          </li>
                          <li className="_feed_timeline_dropdown_item">
                            <a
                              href="#0"
                              className="_feed_timeline_dropdown_link"
                              onClick={(e) => handleDeleteClick(e, post.id)}
                            >
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="#1890FF"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.2"
                                    d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
                                  />
                                </svg>
                              </span>
                              Delete Post
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <h4 className="_feed_inner_timeline_post_title">
                {post.content}
              </h4>
              {post.imageUrl && (
                <div className="_feed_inner_timeline_image">
                  <img src={post.imageUrl} alt="Post" className="_time_img" />
                </div>
              )}
            </div>

            {/* Likes and comments count */}
            {liveLikesCount > 0 || (post.commentsCount ?? 0) > 0 ? (
              <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image">
                  {liveLikesCount > 0 && (
                    <>
                      {Array.from({ length: visibleReactionCount }).map(
                        (_, index) => {
                          const likeUser = visibleReactionUsers[index];
                          const likeUserId = likeUser
                            ? getLikeUserId(likeUser)
                            : "";
                          const likeUserName = likeUser
                            ? getLikeDisplayName(likeUser)
                            : "User";
                          const likeUserAvatar =
                            likeUser?.user?.profile_image || null;

                          return likeUserAvatar ? (
                            <img
                              key={`${post.id}-reaction-${likeUserId || index}`}
                              src={likeUserAvatar}
                              alt={likeUserName}
                              className={
                                index === 0
                                  ? "_react_img1"
                                  : index >= 2
                                    ? "_react_img _rect_img_mbl_none"
                                    : "_react_img"
                              }
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                objectPosition: "top",
                              }}
                            />
                          ) : (
                            <div
                              key={`${post.id}-reaction-${likeUserId || index}`}
                              className={
                                index === 0
                                  ? "_react_img1"
                                  : index >= 2
                                    ? "_react_img _rect_img_mbl_none"
                                    : "_react_img"
                              }
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: "#dbeafe",
                                color: "#1e3a8a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                              }}
                              title={likeUserName}
                            >
                              {likeUserName[0]?.toUpperCase() || "U"}
                            </div>
                          );
                        },
                      )}
                      {liveLikesCount > 5 && (
                        <p className="_feed_inner_timeline_total_reacts_para">
                          {liveLikesCount > 5
                            ? `${liveLikesCount}+`
                            : liveLikesCount}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                  {(post.commentsCount ?? 0) > 0 && (
                    <p className="_feed_inner_timeline_total_reacts_para1">
                      <a href="#0">
                        <span>{post.commentsCount ?? 0}</span> Comment
                      </a>
                    </p>
                  )}
                  <p className="_feed_inner_timeline_total_reacts_para2">
                    <span>0</span> Share
                  </p>
                </div>
              </div>
            ) : null}

            <PostReactionsBar
              liked={!!reactions[post.id]?.liked}
              pending={!!reactions[post.id]?.pending}
              commentsExpanded={!!expandedCommentsByPost[post.id]}
              onLike={() => handleLike(post.id)}
              onToggleComments={() => handleToggleComments(post.id)}
            />

            {expandedCommentsByPost[post.id] && (
              <PostCommentsSection
                postId={post.id}
                isLoading={!!commentsLoadingByPost[post.id]}
                comments={commentsByPost[post.id] ?? []}
                currentUser={user}
                onCommentCreated={() => {
                  void loadCommentsAndReplies(post.id);
                }}
              />
            )}
          </div>
        );
      })}

      {deletePostId && (
        <DeletePostModal
          isDeleting={isDeleting}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isEditModalOpen && editPostId && (
        <EditPostModal
          post={getEditingPost()}
          isEditing={isEditModalOpen}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
