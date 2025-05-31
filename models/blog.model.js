import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const blogModel = mongoose.model("blog", blogSchema);
export default blogModel;
