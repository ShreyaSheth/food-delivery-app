import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderPlaced = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Order Placed!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Thank you for your purchase. Your order is being prepared. You can
          track your order status in the "My Orders" section.
        </p>

        <button
          type="button"
          onClick={() => navigate("/my-orders")}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Back to my orders
        </button>
      </div>
    </div>
  );
};

export default OrderPlaced;
