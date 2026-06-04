import Wishlist from "../models/wishlist.js";
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Wishlist.find({ user: userId })
      .populate("product");

    console.log("FOUND ITEMS:", items);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: userId,
      product: productId
    });

    if (exists) {
      return res.json({ msg: "Already exists" });
    }

    const item = await Wishlist.create({
      user: userId,
      product: productId
    });

    const populated = await Wishlist.findById(item._id)
      .populate("product");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ msg: "Removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};