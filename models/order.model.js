import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    orderId: {
      type: String,
      required: [true, "Provide OrderId"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    productdetails: {
      name: String,
      image: Array,
    },
    PaymentId: {
      type: String,
      default: "",
    },
    Paymentstatus: {
      type: String,
      default: "",
    },
    deliver_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },

    SubTotal: {
      type: Number,
      default: 0,
    },
    Total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", OrderSchema);

export default OrderModel;
