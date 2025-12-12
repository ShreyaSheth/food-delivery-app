import React from "react";
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { SiPhonepe, SiGooglepay } from "react-icons/si";

const PaymentMethod = ({ selectedPayment, onPaymentSelect }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Payment Method
      </h3>
      <div className="flex flex-col md:flex-row gap-3">
        {/* Cash on Delivery */}
        <button
          type="button"
          onClick={() => onPaymentSelect("COD")}
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all text-center flex-1 ${
            selectedPayment === "COD"
              ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-600"
              : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600"
          }`}
        >
          {selectedPayment === "COD" && (
            <FaCheckCircle className="absolute top-2 right-2 text-green-600 dark:text-green-400" />
          )}
          <FaMoneyBillWave
            className={`text-2xl ${
              selectedPayment === "COD"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          />
          <div>
            <div
              className={`font-medium ${
                selectedPayment === "COD"
                  ? "text-green-700 dark:text-green-300"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              Cash on Delivery
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Pay when your food arrives
            </div>
          </div>
        </button>

        {/* UPI / Credit / Debit Card */}
        <button
          type="button"
          onClick={() => onPaymentSelect("Online")}
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all text-center flex-1 ${
            selectedPayment === "Online"
              ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-600"
              : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600"
          }`}
        >
          {selectedPayment === "Online" && (
            <FaCheckCircle className="absolute top-2 right-2 text-green-600 dark:text-green-400" />
          )}
          <div className="flex items-center gap-2">
            <SiPhonepe className="text-xl text-purple-600 dark:text-purple-400" />
            <FaCreditCard className="text-xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div
              className={`font-medium ${
                selectedPayment === "Online"
                  ? "text-green-700 dark:text-green-300"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              UPI / Credit / Debit Card
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Pay securely online
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
