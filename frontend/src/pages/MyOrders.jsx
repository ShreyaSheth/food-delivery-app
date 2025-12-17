import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Nav from "@/components/Nav";
import UserOrderCard from "@/components/UserOrderCard";
import OwnerOrderCard from "@/components/OwnerOrderCard";

const MyOrders = () => {
  const navigate = useNavigate();
  const { userData, myOrders } = useSelector((state) => state.user);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] dark:bg-neutral-950">
      <Nav />
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowRoundBack size={28} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Orders
          </h1>
        </div>

        {/* Orders List */}
        {myOrders && myOrders.length > 0 ? (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div key={order._id}>
                {userData?.role === "user" ? (
                  <UserOrderCard order={order} />
                ) : (
                  <OwnerOrderCard order={order} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No orders found
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Start Ordering
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
