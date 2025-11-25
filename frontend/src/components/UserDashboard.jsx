import React from "react";
import Nav from "./Nav";
import CategoryCard from "./CategoryCard";
import { CATEGORY_OPTIONS, CATEGORY_IMAGES } from "@/constants/categories";

const UserDashboard = () => {
  const handleCategoryClick = (category) => {
    console.log("Selected category:", category);
    // TODO: Filter items by category
  };

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

        <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-6 min-w-max">
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
      </div>
    </div>
  );
};

export default UserDashboard;
