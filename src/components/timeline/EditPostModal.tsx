import { useState, useEffect } from "react";
import type { Post } from "../../store/api/postsApi";

interface EditPostModalProps {
  post: Post | null;
  isEditing: boolean;
  onCancel: () => void;
  onSave: (
    content: string,
    imageFile: File | null,
    removeImage?: boolean,
  ) => Promise<void>;
}

export default function EditPostModal({
  post,
  isEditing,
  onCancel,
  onSave,
}: EditPostModalProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setPreviewImage(post.imageUrl || "");
      setOriginalImageUrl(post.imageUrl || "");
      setImageFile(null);
    }
  }, [post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setImageFile(null);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    const removeImage = originalImageUrl !== "" && previewImage === "";

    setIsSaving(true);
    try {
      await onSave(content, imageFile, removeImage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing || !post) return null;

  return (
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
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
              color: "#000",
            }}
          >
            Edit Post
          </h2>
          <button
            onClick={onCancel}
            disabled={isSaving}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: isSaving ? "not-allowed" : "pointer",
              color: "#999",
              padding: "0",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Textarea */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Post Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
            placeholder="What's on your mind?"
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
              cursor: isSaving ? "not-allowed" : "text",
              opacity: isSaving ? 0.6 : 1,
              transition: "all 0.3s ease",
            }}
          />
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Current Image
            </label>
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isSaving}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#ff4d4f",
                  border: "none",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s ease",
                  opacity: isSaving ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = "#ff7875";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(255, 77, 79, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = "#ff4d4f";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.15)";
                  }
                }}
                title="Delete image"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Change Image (Optional)
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              border: "2px dashed #1890ff",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              cursor: isSaving ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: isSaving ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "#f0f7ff";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
              }
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSaving}
              style={{
                display: "none",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#1890ff"
                viewBox="0 0 24 24"
                style={{ marginBottom: "8px" }}
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#1890ff",
                  fontSize: "14px",
                }}
              >
                {imageFile ? "Change Image" : "Upload Image"}
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#999",
                  fontSize: "12px",
                }}
              >
                Click to browse or drag and drop
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            paddingTop: "24px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <button
            onClick={onCancel}
            disabled={isSaving}
            style={{
              padding: "10px 24px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isSaving ? "not-allowed" : "pointer",
              color: "#333",
              transition: "all 0.3s ease",
              opacity: isSaving ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "#fafafa";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "10px 24px",
              backgroundColor: "#1890ff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isSaving ? "not-allowed" : "pointer",
              color: "white",
              transition: "all 0.3s ease",
              opacity: isSaving ? 0.8 : 1,
              minWidth: "100px",
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "#0050b3";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "#1890ff";
              }
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
