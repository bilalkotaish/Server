import { Router } from "express";
import {
  addAddress,
  DeleteAddress,
  getAddress,
  SelectedAddress,
} from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";

const AddressRouter = Router();

AddressRouter.post("/add", auth, addAddress);
AddressRouter.get("/get", auth, getAddress);
AddressRouter.put("/update/:id", auth, SelectedAddress);
AddressRouter.delete("/:id", auth, DeleteAddress);

export default AddressRouter;
