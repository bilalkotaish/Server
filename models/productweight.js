import mongoose from "mongoose";

const productweightSchema = new mongoose.Schema(
  {
    weight: {
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

const productweightModel = mongoose.model("productWeight", productweightSchema);
export default productweightModel;
