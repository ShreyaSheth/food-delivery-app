import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const ItemCard = ({ item, onEdit, onDelete }) => {
  const { name, image, category, foodType, price } = item || {};
  console.log("ITEM", item);
  const isVeg = String(foodType).toLowerCase() === "veg";
  const priceLabel = typeof price === "number" ? price.toFixed(2) : price ?? "";

  return (
    <Card className="w-full shadow-md overflow-hidden gap-2 py-3">
      <CardContent className="px-4 py-1">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={name || "Item"}
                className="h-20 w-20 object-cover rounded-md"
              />
            ) : (
              <div className="h-20 w-20 rounded-md bg-gray-100 dark:bg-neutral-800" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-amber-600 line-clamp-1">
                  {name}
                </CardTitle>
                <CardDescription className="line-clamp-1">
                  {category}
                </CardDescription>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isVeg
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    isVeg ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                {isVeg ? "Veg" : "Non-veg"}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-gray-500 dark:text-gray-400 text-sm">Price</div>
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                ₹ {priceLabel}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {(onEdit || onDelete) && (
        <CardFooter className="justify-end gap-2">
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer hover:bg-amber-600 hover:text-white"
              onClick={onEdit}
            >
              <FiEdit2 />
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer hover:bg-amber-600"
              onClick={onDelete}
            >
              <FiTrash2 />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ItemCard;
