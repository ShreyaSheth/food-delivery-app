import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignUp from "./pages/signUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";

export const serverUrl = "http://localhost:8000";
function App() {
  useGetCurrentUser();
  useGetCity();
  const { userData } = useSelector((state) => state.user);
  console.log(userData);
  return (
    <Routes>
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" /> : <SignUp />}
      />
      <Route
        path="/signin"
        element={userData ? <Navigate to="/" /> : <SignIn />}
      />
      <Route
        path="/forgot-password"
        element={userData ? <Navigate to="/" /> : <ForgotPassword />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;
