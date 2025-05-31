import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    ProductTitle: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: false,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    size: {
      type: [String],
      default: [],
    },
    weight: {
      type: [String],
      default: [],
    },
    ram: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model("cart", cartProductSchema);

export default cartModel;
