export const getRelativeTime = (date: string | Date): string => {
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

export const getDisplayName = (name?: string, fallback = "Anonymous") =>
  (name && name.trim()) || fallback;

export const getAvatar = (
  avatar: string | null | undefined,
  fallbackAvatar: string,
) => (avatar && avatar.trim() ? avatar : fallbackAvatar);
