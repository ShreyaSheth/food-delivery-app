import React from "react";
import { FaUtensils } from "react-icons/fa";
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

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col item-center">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-4">
        {!myShopData && (
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
              <Button className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white">
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
