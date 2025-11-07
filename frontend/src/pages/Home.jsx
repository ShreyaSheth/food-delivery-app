import DeliveryBoyDashboard from "@/components/DeliveryBoyDashboard";
import OwnerDashboard from "@/components/OwnerDashboard";
import UserDashboard from "@/components/UserDashboard";
import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  console.log("home", userData);
  return (
    <div>
      {userData.role === "deliveryBoy" ? (
        <DeliveryBoyDashboard />
      ) : userData.role === "owner" ? (
        <OwnerDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};

export default Home;
