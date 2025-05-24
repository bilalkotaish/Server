import mongoose from "mongoose";

const homebannerSchema = new mongoose.Schema(
  {
    image: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const homebannerModel = mongoose.model("homebanner", homebannerSchema);
export default homebannerModel;
