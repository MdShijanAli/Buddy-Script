import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/common.css";
import "./assets/css/main.css";
import "./assets/css/responsive.css";
import "./App.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import LoginPage from "./views/login/LoginPage";
import RegistrationPage from "./views/registration/RegistrationPage";
import FeedPage from "./views/feed/FeedPage";
import { ToastContainer } from "react-toastify";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "login" | "registration" | "feed"
  >("login");

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // Auto-navigate to feed if authenticated, otherwise to login
  if (isAuthenticated && currentPage === "login") {
    // This will happen on app reload if token exists
  }

  return (
    <>
      {currentPage === "login" ? (
        <LoginPage onNavigate={setCurrentPage} />
      ) : currentPage === "registration" ? (
        <RegistrationPage onNavigate={setCurrentPage} />
      ) : (
        <FeedPage onNavigate={setCurrentPage} />
      )}

      <ToastContainer />
    </>
  );
}

export default App;
