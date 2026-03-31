import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/common.css";
import "./assets/css/main.css";
import "./assets/css/responsive.css";
import "./App.css";
import { useState } from "react";
import LoginPage from "./views/login/LoginPage";
import RegistrationPage from "./views/registration/RegistrationPage";
import FeedPage from "./views/feed/FeedPage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "login" | "registration" | "feed"
  >("feed");

  return (
    <>
      {currentPage === "login" ? (
        <LoginPage />
      ) : currentPage === "registration" ? (
        <RegistrationPage />
      ) : (
        <FeedPage />
      )}
    </>
  );
}

export default App;
