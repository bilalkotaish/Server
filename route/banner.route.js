import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createBanner,
  deleteBanner,
  deleteBannerimage,
  getBanner,
  getBannerById,
  updateBanner,
  uploadBannerImage,
} from "../controllers/homebanner.controller.js";

const BannerRouter = Router();

BannerRouter.post("/upload", auth, upload.array("images"), uploadBannerImage);
BannerRouter.post("/create", auth, createBanner);
BannerRouter.get("/get", auth, getBanner);
BannerRouter.get("/:id", auth, getBannerById);
BannerRouter.delete("/deleteimage", auth, deleteBannerimage);
BannerRouter.delete("/:id", auth, deleteBanner);
BannerRouter.put("/:id", auth, updateBanner);

export default BannerRouter;
