import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";

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
            item: item._id,
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
