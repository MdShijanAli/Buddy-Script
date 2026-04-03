import reactImage1 from "../assets/images/react_img1.png";
import reactImage2 from "../assets/images/react_img2.png";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useMultipleDropdowns } from "../hooks";
import {
  postsApi,
  useGetAllPostsQuery,
  useDeletePostMutation,
  type Post,
  type PostLike,
} from "../store/api/postsApi";
import {
  useLazyGetPostLikesQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../store/api/likesApi";
import type { RootState } from "../store/store";

// Helper function to format relative time
const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} day ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} week ago`;
  return `${Math.floor(diffInSeconds / 2592000)} month ago`;
};

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

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [getPostLikes] = useLazyGetPostLikesQuery();
  const [deletePost] = useDeletePostMutation();

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

  useEffect(() => {
    if (!posts) return;

    setReactions((prev) => {
      const next = { ...prev };
      posts.forEach((post) => {
        const current = next[post.id];
        const likedFromResponse = Boolean(
          user?.id && post.likes?.some((item) => item.userId === user.id),
        );
        const likesCountFromResponse =
          post.likes?.length ?? post.likesCount ?? 0;

        next[post.id] = {
          liked: current?.pending
            ? current.liked
            : (post.liked ?? likedFromResponse),
          likesCount: current?.pending
            ? current.likesCount
            : likesCountFromResponse,
          likeId: current?.likeId,
          pending: current?.pending ?? false,
          likePreviewUsers: current?.pending
            ? current.likePreviewUsers
            : (post.likes ?? []),
        };
      });
      return next;
    });
  }, [posts, user?.id]);

  const handleLike = async (postId: string) => {
    const current =
      reactions[postId] ??
      ({
        liked: false,
        likesCount: 0,
        likeId: undefined,
        pending: false,
        likePreviewUsers: [],
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
          (item) => item.userId === currentUserLike.userId,
        )
        ? [currentUserLike, ...current.likePreviewUsers].slice(0, 5)
        : current.likePreviewUsers
      : current.likePreviewUsers.filter((item) => item.userId !== user?.id);

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
        const postLikes = await getPostLikes(postId).unwrap();
        likeId = postLikes.find(
          (item) => item.userId === user.id && item.postId === postId,
        )?.id;
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
        const overflowLikesCount = liveLikesCount > 5 ? liveLikesCount - 5 : 0;
        const likePreviewUsers = (
          reactions[post.id]?.likePreviewUsers ??
          post.likes ??
          []
        ).slice(0, 5);

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
                      {post.authorId === user?.id && (
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
                      {likePreviewUsers.length > 0 ? (
                        likePreviewUsers.map((likeItem, index) => (
                          <img
                            key={`${post.id}-${likeItem.userId}-${index}`}
                            src={
                              likeItem.user?.profile_image ||
                              (index === 0 ? reactImage1 : reactImage2)
                            }
                            alt={likeItem.user?.name || "User"}
                            className={
                              index === 0 ? "_react_img1" : "_react_img"
                            }
                          />
                        ))
                      ) : (
                        <>
                          <img
                            src={reactImage1}
                            alt="Image"
                            className="_react_img1"
                          />
                          <img
                            src={reactImage2}
                            alt="Image"
                            className="_react_img"
                          />
                        </>
                      )}
                      {overflowLikesCount > 0 && (
                        <p className="_feed_inner_timeline_total_reacts_para">
                          {overflowLikesCount}
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

            {/* Reactions */}
            <div className="_feed_inner_timeline_reaction">
              <button
                type="button"
                className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${reactions[post.id]?.liked ? "_feed_reaction_active" : ""}`}
                onClick={() => handleLike(post.id)}
                disabled={reactions[post.id]?.pending}
              >
                <span className="_feed_inner_timeline_reaction_link">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      fill="none"
                      viewBox="0 0 19 19"
                    >
                      <path
                        fill="#FFCC4D"
                        d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
                      />
                      <path
                        fill="#664500"
                        d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
                      />
                      <path
                        fill="#fff"
                        d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
                      />
                      <path
                        fill="#664500"
                        d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
                      />
                    </svg>
                    Haha
                  </span>
                </span>
              </button>
              <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
                <span className="_feed_inner_timeline_reaction_link">
                  <span>
                    <svg
                      className="_reaction_svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      fill="none"
                      viewBox="0 0 21 21"
                    >
                      <path
                        stroke="#000"
                        d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                      />
                      <path
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.938 9.313h7.125M10.5 14.063h3.563"
                      />
                    </svg>
                    Comment
                  </span>
                </span>
              </button>
              <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                <span className="_feed_inner_timeline_reaction_link">
                  <span>
                    <svg
                      className="_reaction_svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="21"
                      fill="none"
                      viewBox="0 0 24 21"
                    >
                      <path
                        stroke="#000"
                        strokeLinejoin="round"
                        d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                      />
                    </svg>
                    Share
                  </span>
                </span>
              </button>
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleCancelDelete}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Delete Post
            </h3>
            <p
              style={{ margin: "0 0 24px 0", color: "#666", fontSize: "14px" }}
            >
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: isDeleting ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: isDeleting ? 0.6 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
