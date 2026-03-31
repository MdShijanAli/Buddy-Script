import { useState, useCallback, useEffect } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Persist dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("_dark_wrapper");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("_dark_wrapper");
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const enableDarkMode = useCallback(() => {
    setIsDarkMode(true);
  }, []);

  const disableDarkMode = useCallback(() => {
    setIsDarkMode(false);
  }, []);

  return {
    isDarkMode,
    toggleDarkMode,
    enableDarkMode,
    disableDarkMode,
  };
};
