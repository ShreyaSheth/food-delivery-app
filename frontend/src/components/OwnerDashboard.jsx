import React from "react";
import { FaUtensils } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ItemCard from "./ItemCard";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  console.log("MY SHOP DATA", myShopData);
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col item-center">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-4">
        {myShopData ? (
          <div className="w-full max-w-md flex flex-col items-stretch gap-4">
            <Card className="w-full shadow-lg overflow-hidden relative">
              {myShopData.image && (
                <img
                  src={myShopData.image}
                  alt={myShopData.name || "Restaurant"}
                  className="w-full h-48 object-cover"
                />
              )}
              <button
                type="button"
                aria-label="Edit restaurant"
                className="absolute cursor-pointer top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
                onClick={() => navigate("/create-edit-shop")}
              >
                <FiEdit size={18} className="font-bold text-amber-600" />
              </button>
              <CardHeader>
                <CardTitle className="text-amber-600">
                  {myShopData.name}
                </CardTitle>
                <CardDescription>
                  {myShopData.address}
                  {(myShopData.city || myShopData.state) && (
                    <>
                      {myShopData.address ? ", " : ""}
                      {myShopData.city}
                      {myShopData.city && myShopData.state ? ", " : ""}
                      {myShopData.state}
                    </>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            {(!myShopData.item || myShopData.item.length === 0) && (
              <Card className="w-full text-center shadow-lg gap-4 py-4">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <FaUtensils size={28} />
                  </div>
                  <CardTitle className="mt-2 text-amber-600">
                    Add Item
                  </CardTitle>
                  <CardDescription>
                    Add your first item to start selling.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Create menu items to let customers order from your
                    restaurant.
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button
                    className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => navigate("/add-item")}
                  >
                    Add item
                  </Button>
                </CardFooter>
              </Card>
            )}
            {myShopData.item &&
              myShopData.item.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
          </div>
        ) : (
          <Card className="w-full max-w-md text-center shadow-lg">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <FaUtensils size={28} />
              </div>
              <CardTitle className="mt-2 text-amber-600">
                Add Restaurant
              </CardTitle>
              <CardDescription>
                Add your first restaurant to start listing your delicious items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create a restaurant to manage menu, orders and more.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get started
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
