import React from "react";

const OrderSummary = ({ cartItems, subtotal, deliveryFee, total }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Order Summary
      </h3>
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 space-y-3">
        {/* Items List */}
        <div className="space-y-2">
          {cartItems &&
            cartItems.length > 0 &&
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </span>
              </div>
            ))}
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-700 pt-3 space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              ₹{subtotal?.toFixed(2)}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Fee
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              ₹{deliveryFee?.toFixed(2) || "40.00"}
            </span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-neutral-700">
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Total
            </span>
            <span className="text-xl font-bold text-red-600 dark:text-red-400">
              ₹{total?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
