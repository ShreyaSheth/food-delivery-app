import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemSchema],
  },
  { timestamps: true }
);
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    deliveryAddress: {
      text: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrders: [shopOrderSchema],
  },
  { timestamps: true }
);
export default mongoose.model("Order", orderSchema);
