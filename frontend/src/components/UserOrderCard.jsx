import React from "react";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ order }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const orderNumber = order?._id?.slice(-6);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Order #{orderNumber || ""}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Date: {formatDate(order?.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {order?.paymentMethod}
          </p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 capitalize">
            {order?.shopOrders?.[0]?.status}
          </span>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {order?.shopOrders?.map((shopOrder, shopIndex) => (
          <div
            key={shopIndex}
            className="border-b border-gray-200 dark:border-neutral-700 pb-6 last:border-b-0 last:pb-0"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {shopOrder?.shop?.name || "Restaurant"}
            </h3>

            <div className="space-y-4 mb-4">
              {shopOrder?.shopOrderItems?.map((orderItem, itemIndex) => {
                const itemImage = orderItem?.item?.image;
                const itemName = orderItem?.item?.name;
                const itemPrice = orderItem?.item?.price;
                const quantity = orderItem?.quantity || 0;

                return (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-food.jpg";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
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

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                Subtotal: ₹{shopOrder?.subTotal || 0}
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 capitalize">
                {shopOrder?.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300 dark:border-neutral-600">
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Total: ₹{order?.totalAmount || 0}
        </p>
        <button
          onClick={() => navigate(`/track-order/${order?._id}`)}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
