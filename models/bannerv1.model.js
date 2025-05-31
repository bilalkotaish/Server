import mongoose from "mongoose";

const bannerV1Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    catId: {
      type: String,
      required: true,
    },
    subcatId: {
      type: String,
      required: true,
    },
    thirdsubcatId: {
      type: String,
      required: true,
    },

    image: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    info: {
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
const BannerV1Model = mongoose.model("BannerV1", bannerV1Schema);
export default BannerV1Model;
