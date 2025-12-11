import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignUp from "./pages/signUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Cart from "./pages/Cart";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import Checkout from "./pages/Checkout";

export const serverUrl = "http://localhost:8000";
function App() {
  useGetCurrentUser();
  useGetCity();
  useGetShopByCity(); // TODO: Check if we can move this to useEffect in user dashboard page itself
  useGetItemsByCity(); // TODO: Check if we can move this to useEffect in user dashboard page itself
  const { userData, loading } = useSelector((state) => state.user);
  console.log(userData);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff9f6] dark:bg-neutral-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
      </div>
    );
  }

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
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to="/signin" />}
      />
      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to="/signin" />}
      />
      <Route
        path="/cart"
        element={userData ? <Cart /> : <Navigate to="/signin" />}
      />
      <Route
        path="/checkout"
        element={userData ? <Checkout /> : <Navigate to="/signin" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
