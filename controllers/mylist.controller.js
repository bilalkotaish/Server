import { response } from "express";
import myListModel from "../models/myList.model.js";
import cartModel from "../models/cart.model.js";

export const addToMyList = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      productId,
      brand,
      discount,
      oldprice,
      price,
      rating,
      image,
      productTitle,
    } = request.body;

    // Validate required fields
    if (!productId) {
      return response.status(400).json({
        message: "ProductId is required",
        success: false,
        error: true,
      });
    }

    // Check if the item already exists in the list
    const existingItem = await myListModel.findOne({ userId, productId });

    if (existingItem) {
      return response.status(409).json({
        message: "Product already exists in your list",
        success: false,
        error: true,
      });
    }

    // Create and save new item
    const newItem = new myListModel({
      userId,
      productId,
      brand,
      discount,
      oldprice,
      price,
      rating,
      image,
      productTitle,
    });

    await newItem.save();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Product added to your list successfully",
      data: newItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const deleteMyList = async (request, response) => {
  try {
    const mylistitem = await myListModel.findById(request.params.id);
    if (!mylistitem) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "My list item Not Found",
      });
    }

    const deleteItems = await myListModel.findByIdAndDelete(request.params.id);
    if (!deleteItems) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Item Not Found",
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      message: "Product Deleted from your list successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getMyList = async (request, response) => {
  try {
    const userId = request.userId;
    const MyList = await myListModel.find({
      userId: userId,
    });

    return response.status(200).json({
      error: false,
      success: true,
      data: MyList,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
