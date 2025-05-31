import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createProduct,
  createProductRam,
  createProductSize,
  createProductWeight,
  deletebannerimage,
  deleteMultipleProduct,
  deleteProduct,
  deleteProductimage,
  deleteProductram,
  deleteProductsize,
  deleteProductweight,
  filterProducts,
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
  getProductRam,
  getProductramById,
  getProductsByPrice,
  getProductSize,
  getProductSizeById,
  getProductWeight,
  getProductweightById,
  SortProducts,
  UpdateProduct,
  UpdateProductRam,
  UpdateProductSize,
  UpdateProductWeight,
  uploadBannerImage,
  uploadProductImage,
} from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.post(
  "/uploadimage",
  auth,
  upload.array("images"),
  uploadProductImage
);
ProductRouter.post(
  "/uploadbannerimage",
  auth,
  upload.array("images"),
  uploadBannerImage
);
ProductRouter.post("/create", auth, createProduct);
ProductRouter.post("/AddRam", auth, createProductRam);
ProductRouter.post("/addSize", auth, createProductSize);
ProductRouter.post("/AddWeight", auth, createProductWeight);
ProductRouter.post("/filters", filterProducts);
ProductRouter.post("/Sort", SortProducts);

ProductRouter.get("/products", getAllProducts);
ProductRouter.get("/getRams", getProductRam);
ProductRouter.get("/getSizes", getProductSize);
ProductRouter.get("/getWeights", getProductWeight);
ProductRouter.get("/getRams/:id", getProductramById);
ProductRouter.get("/getSizes/:id", getProductSizeById);
ProductRouter.get("/getWeights/:id", getProductweightById);
ProductRouter.delete("/deleteimage", auth, deleteProductimage);
ProductRouter.delete("/deletebannerimage", auth, deletebannerimage);

ProductRouter.delete("/deleteSize/:id", deleteProductsize);
ProductRouter.delete("/deleteWeight/:id", deleteProductweight);
ProductRouter.delete("/deleteRam/:id", deleteProductram);

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
ProductRouter.delete("/deleteMultiple", deleteMultipleProduct);
ProductRouter.put("/updateProduct/:id", auth, UpdateProduct);
ProductRouter.put("/updateRams/:id", auth, UpdateProductRam);
ProductRouter.put("/updatesize/:id", auth, UpdateProductSize);
ProductRouter.put("/updateWeight/:id", auth, UpdateProductWeight);

export default ProductRouter;
