import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide username"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Provide Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
    },
    Avatar: {
      type: String,
      default: "",
    },
    Mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    access_token: {
      type: String,
      default: "",
    },
    Verify_email: {
      type: Boolean,
      default: false,
    },
    Last_Login: {
      type: Date,
      default: null,
    },
    Status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    Address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
      },
    ],
    Shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cart",
      },
    ],
    Orderhistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    otp: {
      type: String,
    },
    otpexpiry: {
      type: Date,
    },
    Role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
