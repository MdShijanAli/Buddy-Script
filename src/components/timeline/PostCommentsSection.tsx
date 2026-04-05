import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { toast } from "react-toastify";
import type { Comment } from "../../store/api/commentsApi";
import { useCreateCommentMutation } from "../../store/api/commentsApi";
import { useCreateReplyMutation } from "../../store/api/repliesApi";
import { getDisplayName, getRelativeTime } from "./utils";
import type { User } from "../../store/api/authApi";

interface PostCommentsSectionProps {
  postId: string;
  isLoading: boolean;
  comments: Comment[];
  currentUser: User | null;
  onCommentCreated?: () => void;
}

export default function PostCommentsSection({
  postId,
  isLoading,
  comments,
  currentUser,
  onCommentCreated,
}: PostCommentsSectionProps) {
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<
    string | null
  >(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [createReply, { isLoading: isCreatingReply }] =
    useCreateReplyMutation();

  const clearSelectedImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent && !selectedImage) {
      return;
    }

    try {
      await createComment({
        postId,
        data: {
          content: trimmedContent,
          imageFile: selectedImage,
        },
      }).unwrap();

      setContent("");
      clearSelectedImage();
      onCommentCreated?.();
      toast.success("Comment added");
    } catch {
      toast.error("Unable to add comment right now.");
    }
  };

  const openReplyComposer = (commentId: string) => {
    setActiveReplyCommentId(commentId);
    setReplyContent("");
  };

  const closeReplyComposer = () => {
    setActiveReplyCommentId(null);
    setReplyContent("");
  };

  const handleSubmitReply = async (
    event: FormEvent<HTMLFormElement>,
    commentId: string,
  ) => {
    event.preventDefault();

    const trimmedContent = replyContent.trim();
    if (!trimmedContent) {
      return;
    }

    try {
      await createReply({
        commentId,
        data: { content: trimmedContent },
      }).unwrap();

      closeReplyComposer();
      onCommentCreated?.();
      toast.success("Reply added");
    } catch {
      toast.error("Unable to add reply right now.");
    }
  };

  const handleReplyKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form
            className="_feed_inner_comment_box_form"
            onSubmit={handleSubmitComment}
          >
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                {currentUser?.profile_image || currentUser?.profileImage ? (
                  <img
                    src={currentUser.profile_image || currentUser.profileImage}
                    alt=""
                    className="_comment_img"
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
                    {currentUser?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                />
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button
                type="submit"
                className="_feed_inner_comment_box_icon_btn"
                disabled={isCreatingComment}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#000"
                    fillOpacity=".46"
                    fillRule="evenodd"
                    d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="_feed_inner_comment_box_icon_btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#000"
                    fillOpacity=".46"
                    fillRule="evenodd"
                    d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImagePick}
            />
          </form>

          {imagePreviewUrl && (
            <div
              style={{
                marginTop: "10px",
                position: "relative",
                width: "100%",
                maxWidth: "120px",
              }}
            >
              <img
                src={imagePreviewUrl}
                alt="Selected comment"
                style={{
                  width: "100%",
                  maxWidth: "120px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                className="_feed_inner_comment_box_icon_btn"
                onClick={clearSelectedImage}
                title="Remove image"
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0, 0, 0, 0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2 2l8 8M10 2L2 10"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="_timline_comment_main">
        {isLoading && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt">
              Loading comments...
            </button>
          </div>
        )}

        {!isLoading && comments.length > 0 && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt">
              View {comments.length} previous comments
            </button>
          </div>
        )}

        {!isLoading && comments.length === 0 && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt">
              No comments yet
            </button>
          </div>
        )}

        {comments.map((comment) => {
          const commentReplies = comment.replies ?? [];

          return (
            <div key={comment.id} className="_comment_main">
              <div className="_comment_image">
                <a href="#0" className="_comment_image_link">
                  {comment.author?.profile_image ? (
                    <img
                      src={comment.author?.profile_image}
                      alt=""
                      className="_comment_img1"
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
                      {comment.author?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </a>
              </div>

              <div className="_comment_area">
                <div className="_comment_details">
                  <div className="_comment_details_top">
                    <div className="_comment_name">
                      <a href="#0">
                        <h4 className="_comment_name_title">
                          {getDisplayName(
                            comment.author?.name || comment.userName,
                          )}
                        </h4>
                      </a>
                    </div>
                  </div>
                  <div className="_comment_status">
                    <p className="_comment_status_text">
                      <span>{comment.content}</span>
                    </p>
                  </div>

                  {/* <div className="_total_reactions">
                    <div className="_total_react">
                      <span className="_reaction_like">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-thumbs-up"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                      </span>
                      <span className="_reaction_heart">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-heart"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </span>
                    </div>
                    <span className="_total">{comment.likesCount ?? 0}</span>
                  </div> */}

                  <div className="_total_reactions">
                    <div className="_total_react">
                      <span className="_reaction_like">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-thumbs-up"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                      </span>
                      <span className="_reaction_heart">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-heart"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </span>
                    </div>
                    <span className="_total">198</span>
                  </div>

                  <div className="_comment_reply">
                    <div className="_comment_reply_num">
                      <ul className="_comment_reply_list">
                        <li>
                          <span>Like.</span>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="_comment_action_btn"
                            onClick={() =>
                              activeReplyCommentId === comment.id
                                ? closeReplyComposer()
                                : openReplyComposer(comment.id)
                            }
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: 0,
                              fontWeight: 600,
                              color: "#0d6efd",
                            }}
                          >
                            {activeReplyCommentId === comment.id
                              ? "Cancel reply"
                              : "Reply"}
                          </button>
                        </li>
                        <li>
                          <span>Share</span>
                        </li>
                        <li>
                          <span className="_time_link">
                            .{getRelativeTime(comment.createdAt)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {commentReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="_comment_main"
                    style={{ marginBottom: "14px" }}
                  >
                    <div className="_comment_image">
                      <a href="#0" className="_comment_image_link">
                        {reply.author?.profile_image ? (
                          <img
                            src={reply.author?.profile_image}
                            alt=""
                            className="_comment_img1"
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
                            {reply.author?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </a>
                    </div>
                    <div className="_comment_area">
                      <div className="_comment_details" style={{ margin: 0 }}>
                        <div className="_comment_details_top">
                          <div className="_comment_name">
                            <a href="#0">
                              <h4 className="_comment_name_title">
                                {getDisplayName(
                                  reply.author?.name || reply.userName,
                                )}
                              </h4>
                            </a>
                          </div>
                        </div>
                        <div className="_comment_status">
                          <p className="_comment_status_text">
                            <span>{reply.content}</span>
                          </p>
                        </div>

                        <div className="_total_reactions">
                          <div className="_total_react">
                            <span className="_reaction_like">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-thumbs-up"
                              >
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                              </svg>
                            </span>
                            <span className="_reaction_heart">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-heart"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            </span>
                          </div>
                          <span className="_total">
                            {reply.likesCount ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="_comment_reply">
                        <div className="_comment_reply_num">
                          <ul className="_comment_reply_list">
                            <li>
                              <span>Like.</span>
                            </li>
                            <li>
                              <span>Reply.</span>
                            </li>
                            <li>
                              <span>Share</span>
                            </li>
                            <li>
                              <span className="_time_link">
                                .{getRelativeTime(reply.createdAt)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {activeReplyCommentId === comment.id && (
                  <div
                    className="_feed_inner_comment_box"
                    style={{ marginBottom: "16px" }}
                  >
                    <form
                      className="_feed_inner_comment_box_form"
                      onSubmit={(event) => handleSubmitReply(event, comment.id)}
                    >
                      <div className="_feed_inner_comment_box_content">
                        <div className="_feed_inner_comment_box_content_image">
                          {currentUser?.profile_image ||
                          currentUser?.profileImage ? (
                            <img
                              src={
                                currentUser?.profile_image ||
                                currentUser?.profileImage
                              }
                              alt=""
                              className="_comment_img"
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
                              {currentUser?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="_feed_inner_comment_box_content_txt">
                          <textarea
                            className="form-control _comment_textarea"
                            placeholder="Write a reply"
                            value={replyContent}
                            onChange={(event) =>
                              setReplyContent(event.target.value)
                            }
                            onKeyDown={handleReplyKeyDown}
                          />
                        </div>
                      </div>
                      <div className="_feed_inner_comment_box_icon">
                        <button
                          type="button"
                          className="_feed_inner_comment_box_icon_btn"
                          onClick={closeReplyComposer}
                          disabled={isCreatingReply}
                          style={{ width: "auto", padding: "0 12px" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="_feed_inner_comment_box_icon_btn"
                          disabled={isCreatingReply}
                          style={{ width: "auto", padding: "0 12px" }}
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
