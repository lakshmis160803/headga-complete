import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {

  try {

    console.log(req.file);

    const {
      title,
      price,
      stock,
      description,
      category
    } = req.body;

    let imageUrl = "";

    if (req.file) {

      const base64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result =
        await cloudinary.uploader.upload(
          base64,
          {
            folder: "products",
          }
        );

      imageUrl = result.secure_url;
    }

    const product =
      await Product.create({
        title,
        price: Number(price),
        stock: Number(stock),
        description,
        category,
        image: imageUrl,
      });

    res.status(201).json(product);

  } catch (err) {

    console.error("ADD PRODUCT ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }

};
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({
      msg: "Product updated",
      data: updated
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ msg: "Update failed" });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({
      msg: "Product deleted"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};