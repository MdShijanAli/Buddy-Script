import { useState, useCallback, useRef, useEffect } from "react";

export const useDropdown = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, close]);

  return {
    isOpen,
    toggle,
    open,
    close,
    dropdownRef,
  };
};
