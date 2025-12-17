import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, deliveryAddress, paymentMethod } = req.body;
    if (cartItems.length === 0 || !cartItems)
      return res.status(400).json({ message: "Cart is empty" });
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    )
      return res
        .status(400)
        .json({ message: "Please enter complete delivery address" });

    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shopId;
      if (!shopId || shopId === "undefined") {
        console.error("Item missing shopId:", item);
        return; // Skip items without shopId
      }
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });
    console.log("groupItemsByShop", groupItemsByShop);
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ message: "Shop not found" });
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (sum, item) => item.price * item.quantity + sum,
          0
        );
        console.log("subTotal", shop._id, shop.owner._id, subTotal);
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: items.map((item) => ({
            item: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        };
      })
    );
    const newOrder = await Order.create({
      user: req.userId,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      shopOrders,
    });
    return res
      .status(201)
      .json({ message: "Order placed successfully", newOrder });
  } catch (error) {
    return res.status(500).json({ message: `Place order Error: ${error}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({
          createdAt: -1,
        })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price");
      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find(
          (shopOrder) => shopOrder.owner._id == req.userId
        ),
        createdAt: order.createdAt,
      }));
      return res.status(200).json(filteredOrders);
    } else if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({
          createdAt: -1,
        })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    }
  } catch (error) {
    return res.status(500).json({ message: `Get user orders Error: ${error}` });
  }
};
