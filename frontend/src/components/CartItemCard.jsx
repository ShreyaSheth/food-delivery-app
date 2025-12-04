import React from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "@/redux/userSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const { id, name, image, price, quantity } = item || {};

  const handleIncrement = () => {
    dispatch(
      updateCartItemQuantity({
        id,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(
        updateCartItemQuantity({
          id,
          quantity: quantity - 1,
        })
      );
    }
  };

  const handleDelete = () => {
    dispatch(removeFromCart({ id }));
  };

  const totalPrice = (price || 0) * quantity;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-4 flex items-center gap-4">
      {/* Item Image */}
      <div className="flex-shrink-0">
        <img
          src={image || "/placeholder-food.jpg"}
          alt={name}
          className="w-20 h-20 rounded-lg object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          ₹{price || 0} x {quantity}
        </p>
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
          ₹{totalPrice}
        </p>
      </div>

      {/* Quantity Controls and Delete */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <FaMinus className="text-xs" />
          </button>
          <span className="text-base font-medium text-gray-900 dark:text-gray-100 min-w-[24px] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
            aria-label="Increase quantity"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          aria-label="Delete item"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
