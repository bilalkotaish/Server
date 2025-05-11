import { Router } from "express";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import {
  CreateCategory,
  deletecategory,
  deleteimage,
  getCategories,
  getCategoriesCount,
  getcategoryById,
  subCategoriesCount,
  UpdateCategory,
  uploadImage,
} from "../controllers/category.controller.js";

const CategoryRouter = Router();

CategoryRouter.post("/upload", auth, upload.array("images"), uploadImage);
CategoryRouter.post("/create", auth, CreateCategory);
CategoryRouter.get("/getcategory", auth, getCategories);
CategoryRouter.get("/getcount", auth, getCategoriesCount);
CategoryRouter.get("/getsubcount", auth, subCategoriesCount);
CategoryRouter.get("/:id", auth, getcategoryById);
CategoryRouter.delete("/deleteimage", auth, deleteimage);
CategoryRouter.delete("/:id", auth, deletecategory);
CategoryRouter.put("/:id", auth, UpdateCategory);

export default CategoryRouter;
