import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoLocationSharp } from "react-icons/io5";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "@/App";
import { setUserData } from "@/redux/userSlice";
import { FaPlus } from "react-icons/fa";

const Nav = () => {
  const dispatch = useDispatch();
  const { userData, currentCity } = useSelector((state) => state?.user);
  const { myShopData } = useSelector((state) => state?.owner);
  const firstNameInitial = (userData?.firstName || "A")
    .slice(0, 1)
    .toUpperCase();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signout`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) dispatch(setUserData(null));
    } catch (error) {
      console.error("Signout error:", error.response?.data || error.message);
    }
  };
  return (
    <header className="w-full border-b bg-amber-50/60 backdrop-blur supports-[backdrop-filter]:bg-amber-50/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <div className="text-2xl font-bold tracking-tight text-amber-600 select-none">
          Craveo
        </div>

        {userData.role === "user" && (
          <div className="hidden w-full max-w-2xl items-center justify-center px-4 md:flex">
            <div className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center gap-1 text-amber-600">
                <IoLocationSharp className="h-5 w-5" />
                <Input
                  value={currentCity}
                  // onChange={(e) => setLocation(e.target.value)}
                  className="h-8 w-28 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
              <span className="h-6 w-px bg-gray-200" />
              <div className="flex w-full items-center gap-2">
                <FiSearch className="h-4 w-4 text-amber-600" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search delicious food..."
                  className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 shrink-0 border-amber-200 text-amber-600 hover:bg-amber-50"
                onClick={() => {}}
              >
                Search
              </Button>
            </div>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {userData.role === "owner" ? (
            <>
              <Button
                type="button"
                variant="secondary"
                className="relative cursor-pointer h-9 p-0 bg-amber-600/40 text-amber-700 hover:text-amber-600 hover:bg-amber-600/50"
                disabled={!myShopData}
              >
                <FaPlus className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-600">
                  Add Food Item
                </span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="relative hidden cursor-pointer bg-amber-600/40 text-amber-600 hover:text-amber-600 hover:bg-amber-600/50 md:inline-flex"
                disabled={!myShopData}
              >
                My Orders
                <span className="absolute -right-2 -top-2 bg-amber-600 text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                className="relative h-9 w-9 p-0 text-amber-600 hover:bg-amber-100"
              >
                <FiShoppingCart className="h-5 w-5" />
              </Button>

              {/* My Orders visible on md+ */}
              <Button
                type="button"
                variant="link"
                className="hidden cursor-pointer text-amber-700 hover:text-amber-600 md:inline-flex"
              >
                My Orders
              </Button>
            </>
          )}
          {/* Avatar + Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              onClick={() => setIsMenuOpen((p) => !p)}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <span className="text-sm font-semibold">{firstNameInitial}</span>
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                {/* On small screens include My Orders inside the menu */}
                <div className="block md:hidden">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                    My Orders
                  </button>
                  <div className="mx-2 my-1 h-px bg-gray-100" />
                </div>

                {/* Common options */}
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                  Settings
                </button>
                <div className="mx-2 my-1 h-px bg-gray-100" />
                <button
                  className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {userData.role === "user" && (
        <div className="px-4 pb-3 md:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-1 text-amber-600">
              <IoLocationSharp className="h-5 w-5" />
              <Input
                value={currentCity}
                //   onChange={(e) => setLocation(e.target.value)}
                className="h-8 w-24 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <span className="h-6 w-px bg-gray-200" />
            <div className="flex w-full items-center gap-2">
              <FiSearch className="h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search delicious food..."
                className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
