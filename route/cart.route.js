import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  AddtoCart,
  getCartItems,
  removecartItem,
  updateCartQty,
} from "../controllers/cart.contoller.js";

const cartRouter = Router();

cartRouter.post("/add", auth, AddtoCart);
cartRouter.get("/getCart", auth, getCartItems);
cartRouter.put("/updateCart", auth, updateCartQty);
cartRouter.delete("/deleteCart", auth, removecartItem);

export default cartRouter;
