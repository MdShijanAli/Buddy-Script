import reactImage1 from "../assets/images/react_img1.png";
import reactImage2 from "../assets/images/react_img2.png";
import { useState } from "react";
import { useMultipleDropdowns } from "../hooks";
import { useGetAllPostsQuery, type Post } from "../store/api/postsApi";

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
  const { toggleDropdown, isDropdownOpen } = useMultipleDropdowns();
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const { data: posts, isLoading, isError } = useGetAllPostsQuery();

  const handleLike = (postId: string) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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
      {posts.map((post: Post) => (
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
                    className="_feed_timeline_post_dropdown_link"
                    onClick={() => toggleDropdown(`drop_${post.id}`)}
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
                {isDropdownOpen(`drop_${post.id}`) && (
                  <div className="_feed_timeline_dropdown _timeline_dropdown">
                    <ul className="_feed_timeline_dropdown_list">
                      <li className="_feed_timeline_dropdown_item">
                        <a href="#0" className="_feed_timeline_dropdown_link">
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
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
            {post.imageUrl && (
              <div className="_feed_inner_timeline_image">
                <img src={post.imageUrl} alt="Post" className="_time_img" />
              </div>
            )}
          </div>

          {/* Likes and comments count */}
          {(post.likesCount ?? 0) > 0 || (post.commentsCount ?? 0) > 0 ? (
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
              <div className="_feed_inner_timeline_total_reacts_image">
                {(post.likesCount ?? 0) > 0 && (
                  <>
                    <img
                      src={reactImage1}
                      alt="Image"
                      className="_react_img1"
                    />
                    <img src={reactImage2} alt="Image" className="_react_img" />
                    <p className="_feed_inner_timeline_total_reacts_para">
                      {(post.likesCount ?? 0) > 9
                        ? "9+"
                        : (post.likesCount ?? 0)}
                    </p>
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
              className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${likes[post.id] ? "_feed_reaction_active" : ""}`}
              onClick={() => handleLike(post.id)}
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
      ))}
    </>
  );
}
