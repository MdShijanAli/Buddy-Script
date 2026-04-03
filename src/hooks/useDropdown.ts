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
      if (!dropdownRef.current) return;

      // Use composedPath to handle clicks on SVG and nested elements
      const path = event.composedPath();
      const isClickInside = path.some(
        (element) => element === dropdownRef.current,
      );

      if (!isClickInside) {
        close();
      }
    };

    if (isOpen) {
      // Use capture phase for more reliable detection
      document.addEventListener("mousedown", handleClickOutside, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside, true);
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
