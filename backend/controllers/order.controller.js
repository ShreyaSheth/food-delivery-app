import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";

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
    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");
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
        deliveryAddress: order.deliveryAddress,
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

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    const shopOrder = order.shopOrders.find(
      (shopOrder) => shopOrder.shop == shopId
    );
    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }
    shopOrder.status = status;
    let deliveryBoysPayload = [];
    if (status == "out for delivery" || !shopOrder.assignment) {
      const { latitude, longitude } = order.deliveryAddress || {};
      if (!latitude || !longitude) {
        await order.save();
        return res.status(200).json({
          shopOrder,
          message:
            "Order status updated but delivery address coordinates missing",
        });
      }
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000, //takes in meters
          },
        },
      });
      const nearByDeliveryBoysIds = nearByDeliveryBoys.map(
        (deliveryBoy) => deliveryBoy._id
      );
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByDeliveryBoysIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");
      const busyIdSet = new Set(busyIds.map((id) => id.toString()));
      const availableBoys = nearByDeliveryBoys.filter(
        (boy) => !busyIdSet.has(String(boy._id))
      );
      // const availableBoys = nearByDeliveryBoysIds.filter(
      //   (id) => !busyIdSet.has(id)
      // );
      const candidates = availableBoys.map((boy) => boy._id);
      if (candidates.length == 0) {
        await order.save();
        return res.json({
          message: "Order Status Updated but No delivery boy available",
        });
      }
      const deliveryAssignment = await DeliveryAssignment.create({
        order: orderId,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });
      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableBoys.map((boy) => ({
        id: boy._id,
        firstName: boy.firstName,
        lastName: boy.lastName,
        longitude: boy.location.coordinates?.[0],
        latitude: boy.location.coordinates?.[1],
        mobile: boy.mobile,
      }));
    }
    await shopOrder.save();
    await order.save();
    const updatedShopOrder = order.shopOrders.find(
      (shopOrder) => shopOrder.shop == shopId
    );

    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "firstName lastName mobile"
    );
    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignmentId: updatedShopOrder?.assignment?._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Update order status Error: ${error}` });
  }
};
