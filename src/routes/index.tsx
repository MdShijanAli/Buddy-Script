import { Routes, Route } from "react-router-dom";
import PublicRoute from "./publicRoutes";
import LoginPage from "../views/login/LoginPage";
import PrivateRoute from "./privetRoutes";
import FeedPage from "../views/feed/FeedPage";
import RegistrationPage from "../views/registration/RegistrationPage";
import NoPageFound from "../views/NoPageFound";
import ProfilePage from "../views/profile/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
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

      <Route
        path="/"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NoPageFound />} />
    </Routes>
  );
};

export default AppRoutes;
