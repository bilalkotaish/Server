import mongoose from "mongoose";

const productRAMSchema = new mongoose.Schema(
  {
    ram: {
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

const productRAMModel = mongoose.model("productRAM", productRAMSchema);
export default productRAMModel;
