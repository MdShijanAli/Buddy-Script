import { useMemo } from "react";

export { useDarkMode } from "./useDarkMode";
export { useDropdown } from "./useDropdown";
export { useMultipleDropdowns } from "./useMultipleDropdowns";
export { useForm } from "./useForm";

export const useUserInitial = (user: any) => {
  return useMemo(() => {
    const source = user?.name || user?.firstName || "";
    return source.trim().charAt(0).toUpperCase() || "U";
  }, [user?.name, user?.firstName]);
};
