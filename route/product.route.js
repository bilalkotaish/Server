import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createProduct,
  deleteProduct,
  deleteProductimage,
  getAllProducts,
  getFeaturedProduct,
  getProduct,
  getProductByCategory,
  getProductByCatName,
  getProductByRating,
  getProductBySubCategory,
  getProductBySubCatName,
  getProductByThirdSubCategory,
  getProductByThirdSubCatName,
  getProductCount,
  getProductsByPrice,
  UpdateProduct,
  uploadProductImage,
} from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.post(
  "/uploadimage",
  auth,
  upload.array("images"),
  uploadProductImage
);

ProductRouter.post("/create", auth, createProduct);
ProductRouter.get("/products", getAllProducts);
ProductRouter.get("/products/:id", getProductByCategory);
ProductRouter.get("/productsbyCatname", getProductByCatName);
ProductRouter.get("/productSub/:id", getProductBySubCategory);
ProductRouter.get("/productsbySubCatname", getProductBySubCatName);
ProductRouter.get("/productthirdSub/:id", getProductByThirdSubCategory);
ProductRouter.get("/productsbythirdSubCatname", getProductByThirdSubCatName);
ProductRouter.get("/productsByPrice", getProductsByPrice);
ProductRouter.get("/productsByRating", getProductByRating);
ProductRouter.get("/productsCount", getProductCount);
ProductRouter.get("/isFeatured", getFeaturedProduct);
ProductRouter.delete("/:id", deleteProduct);
ProductRouter.get("/:id", getProduct);
ProductRouter.delete("/deleteimage", auth, deleteProductimage);
ProductRouter.put("/updateProduct/:id", auth, UpdateProduct);

export default ProductRouter;
