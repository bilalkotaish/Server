import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    oldprice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      //   required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    catname: {
      type: String,
      default: "",
    },
    catId: {
      type: String,
      default: "",
    },
    subcatname: {
      type: String,
      default: "",
    },

    subcatId: {
      type: String,
      default: "",
    },
    thirdsubname: {
      type: String,
      default: "",
    },
    thirdsubcatId: {
      type: String,
      default: "",
    },
    countInStock: {
      type: Number,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
    sale: {
      type: Number,
      default: 0,
    },
    productRam: [
      {
        type: String,
        default: null,
      },
    ],
    size: [
      {
        type: String,
        default: null,
      },
    ],
    productweight: [
      {
        type: String,
        default: null,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
