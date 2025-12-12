import { addToCart } from "@/redux/userSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaLeaf,
  FaDrumstickBite,
  FaStar,
  FaRegStar,
  FaPlus,
  FaShoppingCart,
  FaMinus,
} from "react-icons/fa";

const FoodItemCard = ({ item, onClick }) => {
  const { name, image, price, foodType, rating } = item || {};
  const isVeg = String(foodType).toLowerCase() === "veg";
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  console.log("CART ITEMS", cartItems);
  const handleDecrement = (e) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      console.log("item.shop:", item.shop);
      dispatch(
        addToCart({
          id: item._id,
          name: item.name,
          image: item.image,
          foodType: item.foodType,
          category: item.category,
          price: item.price,
          quantity: quantity,
          shopId: item.shop,
        })
      );
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-yellow-300 text-lg" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-300 text-lg" />);
      }
    }
    return stars;
  };
  return (
    <div
      className="flex-shrink-0 w-40 cursor-pointer group rounded-lg border-2 border-gray-200 dark:border-neutral-800 overflow-hidden shadow-md hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600 hover:scale-105 transition-all duration-300"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-32 overflow-hidden bg-gray-100 dark:bg-neutral-800">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-600 text-xs">
              No image
            </span>
          </div>
        )}

        {/* Veg/Non-veg Badge */}
        <div className="absolute top-2 right-2">
          {isVeg ? (
            <div className="bg-white dark:bg-neutral-900 rounded-full p-1.5 shadow-lg border-2 border-green-500">
              <FaLeaf className="text-green-600 text-sm" />
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 rounded-full p-1.5 shadow-lg border-2 border-red-500">
              <FaDrumstickBite className="text-red-600 text-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white dark:bg-neutral-900 p-3">
        <div
          className="text-sm font-semibold text-gray-800 dark:text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis mb-2"
          title={name}
        >
          {name}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(rating?.average || 0)}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({rating?.count || 0})
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-amber-600 dark:text-amber-400">
            ₹{typeof price === "number" ? price : price || "N/A"}
          </span>
          <div className="flex items-center gap-0 bg-white dark:bg-neutral-800 rounded-full border border-gray-200 dark:border-neutral-700 px-1 py-0.5">
            <button
              onClick={handleDecrement}
              disabled={quantity === 0}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-[10px]" />
            </button>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[16px] text-center px-1">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Increase quantity"
            >
              <FaPlus className="text-[10px]" />
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-neutral-600 mx-0.5" />
            <button
              onClick={handleAddToCart}
              disabled={quantity === 0}
              className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                cartItems.some((cartItem) => cartItem.id === item._id)
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : quantity === 0
                  ? "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-400 dark:text-gray-500"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
              aria-label="Add to cart"
            >
              <FaShoppingCart size={10} className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
