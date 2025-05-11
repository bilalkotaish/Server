import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    Address_line: {
      type: String,
      default: "",
    },
    City: {
      type: String,
      default: "",
    },
    State: {
      type: String,
      default: "",
    },
    Pincode: {
      type: String,
    },
    Country: {
      type: String,
    },
    Mobile: {
      type: Number,
      default: null,
    },
    Status: {
      type: Boolean,
      default: true,
    },
    UserId: {
      type: mongoose.Schema.ObjectId,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;
