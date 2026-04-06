import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import PostForm from "../../components/PostForm";
import TimeLinePosts from "../../components/TimeLinePosts";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../store/api/authApi";
import { updateUser } from "../../store/slices/authSlice";
import type { RootState } from "../../store/store";
import "./profile.css";

type ProfileFormState = {
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  location: string;
};

const emptyProfile: ProfileFormState = {
  name: "",
  first_name: "",
  last_name: "",
  phone: "",
  bio: "",
  location: "",
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showPosts, setShowPosts] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formState, setFormState] = useState<ProfileFormState>(emptyProfile);

  const { data: profileData, isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profileUser = useMemo(() => {
    return profileData?.user || profileData?.data || user;
  }, [profileData?.data, profileData?.user, user]);

  const profileName =
    profileUser?.name ||
    [
      profileUser?.firstName || profileUser?.first_name,
      profileUser?.lastName || profileUser?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "User";

  const profileImage =
    profileUser?.profile_image || profileUser?.profileImage || null;

  useEffect(() => {
    if (!profileUser) return;

    setFormState({
      name: profileUser.name || "",
      first_name: profileUser.first_name || profileUser.firstName || "",
      last_name: profileUser.last_name || profileUser.lastName || "",
      phone: profileUser.phone || "",
      bio: profileUser.bio || "",
      location: profileUser.location || "",
    });
  }, [profileUser]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      const payload = {
        name: formState.name.trim(),
        first_name: formState.first_name.trim(),
        last_name: formState.last_name.trim(),
        phone: formState.phone.trim(),
        bio: formState.bio.trim(),
        location: formState.location.trim(),
      };

      const response = await updateProfile(payload).unwrap();
      const updated = response?.user || response?.data || payload;

      dispatch(
        updateUser({
          name: updated.name,
          firstName: payload.first_name,
          lastName: payload.last_name,
          first_name: updated.first_name || payload.first_name,
          last_name: updated.last_name || payload.last_name,
          phone: updated.phone || payload.phone,
          bio: updated.bio || payload.bio,
          location: updated.location || payload.location,
        }),
      );

      toast.success("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (error: any) {
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Failed to update profile.";
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    if (profileUser) {
      setFormState({
        name: profileUser.name || "",
        first_name: profileUser.first_name || profileUser.firstName || "",
        last_name: profileUser.last_name || profileUser.lastName || "",
        phone: profileUser.phone || "",
        bio: profileUser.bio || "",
        location: profileUser.location || "",
      });
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="profile_page_wrap">
      <Header />

      <div className="container _custom_container">
        <div className="profile_grid">
          <aside className="profile_sidebar_card">
            <div className="profile_cover" />
            <div className="profile_avatar_wrap">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profileName}
                  className="profile_avatar"
                />
              ) : (
                <div className="profile_avatar_placeholder">
                  {profileName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile_identity">
              <h2>{profileName}</h2>
              <p>{formState.bio || "Tell people about yourself."}</p>
            </div>

            <div className="profile_meta">
              <p>
                <strong>Phone</strong>
                <span>{formState.phone || "Not added"}</span>
              </p>
              <p>
                <strong>Location</strong>
                <span>{formState.location || "Not added"}</span>
              </p>
            </div>
          </aside>

          <section className="profile_content_area">
            <div className="profile_editor_card">
              <div className="profile_editor_header">
                <h3>Profile Details</h3>
                <div className="profile_editor_actions">
                  {!isEditingProfile && (
                    <button
                      type="button"
                      className="profile_edit_btn"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    type="button"
                    className="profile_posts_toggle"
                    onClick={() => setShowPosts((prev) => !prev)}
                  >
                    {showPosts ? "Hide Posts" : "Show My Posts"}
                  </button>
                </div>
              </div>

              {isEditingProfile ? (
                <form className="profile_form" onSubmit={handleProfileUpdate}>
                  <div className="profile_form_row">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder="Md Shijan Ali"
                      disabled={isUpdating || isFetching}
                    />
                  </div>

                  <div className="profile_form_split">
                    <div className="profile_form_row">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        id="first_name"
                        name="first_name"
                        value={formState.first_name}
                        onChange={handleInputChange}
                        placeholder="Md"
                        disabled={isUpdating || isFetching}
                      />
                    </div>
                    <div className="profile_form_row">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        id="last_name"
                        name="last_name"
                        value={formState.last_name}
                        onChange={handleInputChange}
                        placeholder="Shijan"
                        disabled={isUpdating || isFetching}
                      />
                    </div>
                  </div>

                  <div className="profile_form_split">
                    <div className="profile_form_row">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleInputChange}
                        placeholder="+8801712345678"
                        disabled={isUpdating || isFetching}
                      />
                    </div>
                    <div className="profile_form_row">
                      <label htmlFor="location">Location</label>
                      <input
                        id="location"
                        name="location"
                        value={formState.location}
                        onChange={handleInputChange}
                        placeholder="Dhaka, Bangladesh"
                        disabled={isUpdating || isFetching}
                      />
                    </div>
                  </div>

                  <div className="profile_form_row">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formState.bio}
                      onChange={handleInputChange}
                      placeholder="Backend developer, TypeScript + Prisma."
                      disabled={isUpdating || isFetching}
                    />
                  </div>

                  <div className="profile_form_action">
                    <button
                      type="button"
                      className="profile_cancel_btn"
                      onClick={handleCancelEdit}
                      disabled={isUpdating || isFetching}
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={isUpdating || isFetching}>
                      {isUpdating ? "Updating..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile_readonly">
                  <div className="profile_readonly_row">
                    <span>Full Name</span>
                    <strong>{formState.name || "Not added"}</strong>
                  </div>
                  <div className="profile_readonly_row">
                    <span>First Name</span>
                    <strong>{formState.first_name || "Not added"}</strong>
                  </div>
                  <div className="profile_readonly_row">
                    <span>Last Name</span>
                    <strong>{formState.last_name || "Not added"}</strong>
                  </div>
                  <div className="profile_readonly_row">
                    <span>Phone</span>
                    <strong>{formState.phone || "Not added"}</strong>
                  </div>
                  <div className="profile_readonly_row">
                    <span>Location</span>
                    <strong>{formState.location || "Not added"}</strong>
                  </div>
                  <div className="profile_readonly_row profile_readonly_bio">
                    <span>Bio</span>
                    <strong>{formState.bio || "Not added"}</strong>
                  </div>
                </div>
              )}
            </div>

            {showPosts && (
              <>
                <div className="profile_section_title">Create a Post</div>
                <PostForm />

                <div className="profile_section_title">My Posts</div>
                <TimeLinePosts variant="mine" />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
