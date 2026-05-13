import Cart from "../models/Cart.js";
import mongoose from "mongoose";


export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: 1 }]
      });
    } else {
      const existingItem = await Cart.findOne({
        user: userId,
        "items.product": productId
      });

      if (existingItem) {
        await Cart.updateOne(
          { user: userId, "items.product": productId },
          { $inc: { "items.$.quantity": 1 } }
        );
      } else {
        await Cart.updateOne(
          { user: userId },
          { $push: { items: { product: productId, quantity: 1 } } }
        );
      }
    }

    const updated = await Cart.findOne({ user: userId }).populate("items.product");
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.body;

    await Cart.updateOne(
      { _id: cartId },
      { $pull: { items: { product: productId } } }
    );

    const updated = await Cart.findById(cartId).populate("items.product");
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { cartId, productId, action } = req.body;

    const update =
      action === "inc"
        ? { $inc: { "items.$.quantity": 1 } }
        : { $inc: { "items.$.quantity": -1 } };

    await Cart.updateOne(
      {
        _id: cartId,
        "items.product": productId,
        ...(action === "dec" && { "items.quantity": { $gt: 1 } })
      },
      update
    );

    const updated = await Cart.findById(cartId).populate("items.product");
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );

    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};