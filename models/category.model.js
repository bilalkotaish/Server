import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    images: [
      {
        type: String,
      },
    ],
    color: {
      type: String,
    },
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
