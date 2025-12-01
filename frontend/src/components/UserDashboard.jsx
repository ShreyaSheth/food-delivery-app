import React, { useEffect, useRef, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import Nav from "./Nav";
import CategoryCard from "./CategoryCard";
import { CATEGORY_OPTIONS, CATEGORY_IMAGES } from "@/constants/categories";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const scrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const { shopsInCity, currentCity } = useSelector((state) => state.user);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [showLeftShopsBtn, setShowLeftShopsBtn] = useState(false);
  const [showRightShopsBtn, setShowRightShopsBtn] = useState(false);

  const handleCategoryClick = (category) => {
    console.log("Selected category:", category);
  };

  const updateBtnVisibility = (ref, showLeft, showRight) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      showLeft(scrollLeft > 0);
      showRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      updateBtnVisibility(scrollRef, setShowLeftBtn, setShowRightBtn);
      scrollRef.current.addEventListener("scroll", () => {
        updateBtnVisibility(scrollRef, setShowLeftBtn, setShowRightBtn);
      });
    }
    if (shopScrollRef.current) {
      updateBtnVisibility(
        shopScrollRef,
        setShowLeftShopsBtn,
        setShowRightShopsBtn
      );
      shopScrollRef.current.addEventListener("scroll", () => {
        updateBtnVisibility(
          shopScrollRef,
          setShowLeftShopsBtn,
          setShowRightShopsBtn
        );
      });
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", () => {
          updateBtnVisibility(scrollRef, setShowLeftBtn, setShowRightBtn);
        });
      }
      if (shopScrollRef.current) {
        shopScrollRef.current.removeEventListener("scroll", () => {
          updateBtnVisibility(
            shopScrollRef,
            setShowLeftShopsBtn,
            setShowRightShopsBtn
          );
        });
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] dark:bg-neutral-950">
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            What's on your mind?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Explore delicious food by category
          </p>
        </div>

        <div className="relative">
          {showLeftBtn && (
            <button
              onClick={() => scrollHandler(scrollRef, "left")}
              className="cursor-pointer absolute left-0 top-12 z-10 bg-white dark:bg-neutral-800 shadow-lg rounded-full p-2 hover:bg-amber-50 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Scroll left"
            >
              <FaCircleChevronLeft className="text-amber-600 dark:text-amber-400 text-xl" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex gap-6 min-w-max px-12">
              {CATEGORY_OPTIONS.map((category) => (
                <CategoryCard
                  key={category}
                  name={category}
                  image={CATEGORY_IMAGES[category]}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          </div>

          {showRightBtn && (
            <button
              onClick={() => scrollHandler(scrollRef, "right")}
              className="cursor-pointer absolute -right-2 top-12 z-10 bg-white dark:bg-neutral-800 shadow-lg rounded-full p-2 hover:bg-amber-50 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Scroll right"
            >
              <FaCircleChevronRight className="text-amber-600 dark:text-amber-400 text-xl" />
            </button>
          )}
        </div>
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Best shops in {currentCity}
          </p>
        </div>
        <div className="relative">
          {showLeftShopsBtn && (
            <button
              onClick={() => scrollHandler(shopScrollRef, "left")}
              className="cursor-pointer absolute left-0 top-12 z-10 bg-white dark:bg-neutral-800 shadow-lg rounded-full p-2 hover:bg-amber-50 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Scroll left"
            >
              <FaCircleChevronLeft className="text-amber-600 dark:text-amber-400 text-xl" />
            </button>
          )}

          <div
            ref={shopScrollRef}
            className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex gap-6 min-w-max px-12">
              {shopsInCity.map((shop) => (
                <CategoryCard
                  key={shop}
                  name={shop.name}
                  image={shop.image}
                  onClick={() => handleCategoryClick(shop)}
                />
              ))}
            </div>
          </div>

          {showRightShopsBtn && (
            <button
              onClick={() => scrollHandler(shopScrollRef, "right")}
              className="cursor-pointer absolute -right-2 top-12 z-10 bg-white dark:bg-neutral-800 shadow-lg rounded-full p-2 hover:bg-amber-50 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Scroll right"
            >
              <FaCircleChevronRight className="text-amber-600 dark:text-amber-400 text-xl" />
            </button>
          )}
        </div>
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Suggested Food Items
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
