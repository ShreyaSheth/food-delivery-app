import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import Nav from "@/components/Nav";
import CartItemCard from "@/components/CartItemCard";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

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
            Your Cart
          </h1>
        </div>

        {/* Cart Items */}
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Your cart is empty
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Continue exploring delicious food
            </button>
          </div>
        )}

        {cartItems && cartItems.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Total
              </span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                ₹{totalAmount}
              </span>
            </div>
            <button
              className="cursor-pointer w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
