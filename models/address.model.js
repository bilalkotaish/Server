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
      default: "",
    },
    Country: {
      type: String,
      default: "",
    },
    Mobile: {
      type: String,
      default: null,
    },
    Status: {
      type: Boolean,
      default: true,
    },
    Selected: {
      type: Boolean,
      default: false,
    },
    UserId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;
