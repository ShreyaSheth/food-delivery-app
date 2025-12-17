import React, { useState, useRef, useEffect } from "react";
import { FiPhone } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { serverUrl } from "@/App";

const OwnerOrderCard = ({ order }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const dropdownRef = useRef(null);

  // shopOrders is now a single object (not an array) from the backend
  const shopOrder = order?.shopOrders;
  console.log("shopOrder===>>", shopOrder);
  console.log("items===>>", shopOrder.shopOrderItems);
  // Set initial status
  useEffect(() => {
    if (shopOrder?.status) {
      setCurrentStatus(shopOrder.status);
    }
  }, [shopOrder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = [
    "pending",
    "preparing",
    "out for delivery",
    "delivered",
  ];

  const handleStatusChange = async (newStatus) => {
    try {
      // TODO: Implement API endpoint for updating order status
      // await axios.patch(`${serverUrl}/api/order/update-status`, {
      //   orderId: order._id,
      //   shopOrderId: shopOrder._id,
      //   status: newStatus,
      // });

      setCurrentStatus(newStatus);
      setShowStatusDropdown(false);
      // Optionally refresh orders after status update
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatStatus = (status) => {
    return status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const customerName = order?.user
    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
    : "Customer";

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 mb-6">
      {/* Customer Information Section */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {customerName}
        </h2>

        <div className="space-y-3">
          {/* Email */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order?.user?.email || "N/A"}
          </p>

          {/* Phone Number */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiPhone className="text-gray-500 dark:text-gray-400" />
            <span>{order?.user?.mobile || "N/A"}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <IoLocationSharp className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <span>
              {order?.deliveryAddress?.text || "Address not available"}
            </span>
          </div>

          {/* Coordinates */}
          {order?.deliveryAddress?.latitude &&
            order?.deliveryAddress?.longitude && (
              <p className="text-xs text-gray-500 dark:text-gray-500 ml-6">
                Lat: {order.deliveryAddress.latitude}, Lon:{" "}
                {order.deliveryAddress.longitude}
              </p>
            )}
        </div>
      </div>
      {console.log("==>>shopOrder outside", shopOrder)}

      {/* Ordered Items Section */}
      {shopOrder?.shopOrderItems?.length > 0 && (
        <div className="mb-6">
          <div className="space-y-4">
            {console.log("==>>shopOrder", shopOrder)}
            {console.log("shopOrder shoporderitems", shopOrder.shopOrderItems)}
            {shopOrder.shopOrderItems.map((orderItem, itemIndex) => {
              const itemImage = orderItem?.item?.image;
              const itemName = orderItem?.item?.name || orderItem?.name;
              const itemPrice = orderItem?.item?.price || orderItem?.price;
              const quantity = orderItem?.quantity;
              console.log("orderItem", orderItem);

              return (
                <div
                  key={itemIndex}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        itemImage?.startsWith("http")
                          ? itemImage
                          : itemImage
                          ? `${serverUrl}/${itemImage}`
                          : "/placeholder-food.jpg"
                      }
                      alt={itemName}
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-food.jpg";
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-base">
                      {itemName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {quantity} x ₹{itemPrice}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status and Total Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-neutral-700">
        {/* Status with Change Button */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              status:{" "}
              {formatStatus(currentStatus || shopOrder?.status || "pending")}
            </span>
          </div>

          {/* Change Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-1 px-3 py-1.5 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
            >
              Change
              <IoIosArrowDown
                className={`transition-transform ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 min-w-[180px]">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      currentStatus === status ||
                      (!currentStatus && status === shopOrder?.status)
                        ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {formatStatus(status)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total Amount */}
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Total: ₹{shopOrder?.subTotal || 0}
        </p>
      </div>
    </div>
  );
};

export default OwnerOrderCard;
