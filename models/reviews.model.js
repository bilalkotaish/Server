import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewsModel = mongoose.model("reviews", ReviewsSchema);
export default ReviewsModel;
