import { useState, useCallback } from "react";

export const useMultipleDropdowns = (initialDropdowns: string[] = []) => {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleDropdown = useCallback((id: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  const openDropdown = useCallback((id: string) => {
    setOpenDropdowns((prev) => new Set(prev).add(id));
  }, []);

  const closeDropdown = useCallback((id: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns(new Set());
  }, []);

  const isDropdownOpen = useCallback(
    (id: string) => openDropdowns.has(id),
    [openDropdowns],
  );

  return {
    openDropdowns,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    closeAllDropdowns,
    isDropdownOpen,
  };
};
