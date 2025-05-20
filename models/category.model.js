import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    parentCatname: {
      type: String,
    },
    parentCatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const CategoryModel = mongoose.model("category", CategorySchema);
export default CategoryModel;
