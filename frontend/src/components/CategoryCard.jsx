import React from "react";

const CategoryCard = ({ name, image, onClick }) => {
  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border-2 border-amber-100 dark:border-neutral-800 group-hover:border-amber-500 dark:group-hover:border-amber-500 group-hover:shadow-xl group-hover:border-4 transition-all duration-300">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        {name}
      </span>
    </div>
  );
};

export default CategoryCard;
