import { Router } from "express";
import {
  AddUserReviews,
  authWithGoogleController,
  deleteImageController,
  forgetPassword,
  getUserReviews,
  LoginController,
  LogoutController,
  refreshToken,
  registerUserController,
  resetPassword,
  updateUserDetails,
  UploadImageController,
  UserDetails,
  verifyEmailController,
  VerifyForgetPassword,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify", verifyEmailController);
userRouter.post("/login", LoginController);
userRouter.post("/googleauth", authWithGoogleController);

userRouter.get("/Logout", auth, LogoutController);
userRouter.put(
  "/user-avatar",
  auth,
  upload.array("Avatar"),
  UploadImageController
);

userRouter.delete("/deleteimage", auth, deleteImageController);
userRouter.put("/:id", auth, updateUserDetails);
userRouter.post("/forgetpassword", forgetPassword);
userRouter.post("/verify-forgetpassword", VerifyForgetPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/userdetails", auth, UserDetails);
userRouter.post("/addReview", auth, AddUserReviews);
userRouter.get("/Reviews", auth, getUserReviews);

export default userRouter;
