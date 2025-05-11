import { request, response } from "express";
import cartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";

export const AddtoCart = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId } = request.body;

    if (!productId) {
      return response.status(404).json({
        error: true,
        message: "Product Id Not Provided",
        success: false,
      });
    }
    const checkItemCart = await cartModel.findOne({
      userId: userId,
      productId: productId,
    });
    if (checkItemCart) {
      return response.send(200).json({
        message: "Item Already in Cart",
      });
    }
    const cartItem = new cartModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();
    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          Shopping_cart: productId,
        },
      }
    );
    return response.status(200).json({
      data: save,
      message: "Item Added Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getCartItems = async (request, response) => {
  try {
    const userId = request.userId;
    const cartItem = await cartModel
      .find({
        userId: userId,
      })
      .populate("productId");

    return response.status(200).json({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateCartQty = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, qty } = request.body;
    if (!_id || !qty) {
      return response.status(404).json({
        message: "Provide id ,qty",
      });
    }
    const UpdatecartItem = await cartModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );
    return response.status(200).json({
      message: "Cart Updated",
      success: true,
      error: false,
      data: UpdatecartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const removecartItem = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, productId } = request.body;
    if (!_id) {
      return response.status(404).json({
        message: "Provide id ",
      });
    }
    const deleteItems = await cartModel.deleteOne({
      _id: _id,
      userId: userId,
    });
    if (!deleteItems) {
      return response.status(404).json({
        message: "Invalid Item to Delete ",
      });
    }

    const user = await UserModel.findOne({
      _id: userId,
    });

    const cartItems = user?.Shopping_cart;

    const updatedUserCart = [
      ...cartItems.slice(0, cartItems.indexOf(productId)),
      ...cartItems.slice(cartItems.indexOf(productId) + 1),
    ];

    user.Shopping_cart = updatedUserCart;
    await user.save();

    return response.status(200).json({
      message: "Cart Deleted Successfully",
      success: true,
      error: false,
      data: deleteItems,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
