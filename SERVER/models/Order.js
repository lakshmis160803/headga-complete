import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: Number,
      price: Number,
      image : String 
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["pending", "placed", "shipped", "delivered"],
    default: "placed"
  },

  
  shipping: {
    fullName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },

  paymentMethod: String,
  paymentStatus: String

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);