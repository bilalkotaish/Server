import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createBannerV1,
  deletebannerv1,
  deletebannerv1image,
  getBannerV1,
  getBannerV1ById,
  updateBannerv1,
  uploadBannerv1Image,
} from "../controllers/bannerv1.controller.js";

const BannerRouterV1 = Router();

BannerRouterV1.post(
  "/upload",
  auth,
  upload.array("images"),
  uploadBannerv1Image
);
BannerRouterV1.post("/create", auth, createBannerV1);
BannerRouterV1.get("/get", auth, getBannerV1);
BannerRouterV1.get("/:id", auth, getBannerV1ById);
BannerRouterV1.delete("/deleteimage", auth, deletebannerv1image);
BannerRouterV1.delete("/:id", auth, deletebannerv1);
BannerRouterV1.put("/:id", auth, updateBannerv1);

export default BannerRouterV1;
