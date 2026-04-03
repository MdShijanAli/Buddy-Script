import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

const PrivateRoute = ({ children }: Props) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
