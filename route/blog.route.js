import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  deleteblogimage,
  getBlog,
  getBlogs,
  updateBlog,
  uploadBlogImage,
} from "../controllers/blog.controller.js";

const BlogRouter = Router();

BlogRouter.post("/upload", auth, upload.array("images"), uploadBlogImage);
BlogRouter.post("/create", auth, createBlog);
BlogRouter.get("/get", auth, getBlogs);
BlogRouter.delete("/deleteimage", auth, deleteblogimage);
BlogRouter.get("/:id", auth, getBlog);

BlogRouter.delete("/:id", auth, deleteBlog);
BlogRouter.put("/:id", auth, updateBlog);

export default BlogRouter;
