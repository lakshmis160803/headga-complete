import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    let orders;

    // if (req.user.role === "admin") {
    //   orders = await Order.find()
    //     .populate("user", "name email")
    //     .populate("items.product", "title image");
    // } else {
      orders = await Order.find({ user: req.user.id })
        .populate("items.product", "title image");
    // }

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching orders" });
  }
};


export const getOrdersadmin = async (req, res) => {
  try {
    let orders;

 
      orders = await Order.find()
        .populate("items.product", "title image");
   

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching orders" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shipping
    } = req.body;

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      status: "placed",
      paymentMethod,
      paymentStatus,
      shipping
    });

    const populated = await Order.findById(order._id)
      .populate("items.product");

    res.status(201).json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Not authorized" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ msg: "Order not found" });

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Not authorized" });

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order)
      return res.status(404).json({ msg: "Order not found" });

    res.json({ msg: "Order deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};