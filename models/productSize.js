import mongoose from "mongoose";

const productSizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const productSizeModel = mongoose.model("productSize", productSizeSchema);
export default productSizeModel;
