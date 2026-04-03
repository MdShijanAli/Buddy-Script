import { Routes, Route } from "react-router-dom";
import PublicRoute from "./publicRoutes";
import LoginPage from "../views/login/LoginPage";
import PrivateRoute from "./privetRoutes";
import FeedPage from "../views/feed/FeedPage";
import RegistrationPage from "../views/registration/RegistrationPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/registration"
        element={
          <PublicRoute>
            <RegistrationPage />
          </PublicRoute>
        }
      />

      {/* Private */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
