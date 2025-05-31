import { request, response } from "express";
import cartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";

export const AddtoCart = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      productId,
      quantity,
      price,
      subTotal,
      countInStock,
      rating,
      image,
      ProductTitle,
      size,
      weight,
      ram,
    } = request.body;

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
      return response.status(400).json({
        message: "Item Already in Cart",
        error: true,
        success: false,
      });
    }
    const cartItem = new cartModel({
      quantity: quantity,
      userId: userId,
      price: price,
      subTotal: subTotal,
      countInStock: countInStock,
      rating: rating,
      image: image,
      ProductTitle: ProductTitle,
      productId: productId,
      size: size,
      weight: weight,
      ram: ram,
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
    const { _id, qty, subTotal, countInStock, size, weight, ram } =
      request.body;

    if (!_id || qty === undefined) {
      return response.status(400).json({
        message: "Provide cart item ID and quantity",
        success: false,
        error: true,
      });
    }

    if (qty <= 0) {
      return response.status(400).json({
        message: "Quantity must be at least 1",
        success: false,
        error: true,
      });
    }

    // Update cart item
    const updatedItem = await cartModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
        subTotal: subTotal,
        countInStock: countInStock,
        size: size,
        weight: weight,
        ram: ram,
      },
      {
        new: true,
      }
    );

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $pull: {
          Shopping_cart: _id,
        },
      }
    );

    return response.status(200).json({
      message: "Cart updated successfully",
      success: true,
      error: false,
      data: updatedItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};

// export const removecartItem = async (request, response) => {
//   try {
//     const userId = request.userId;
//     const { id } = request.params;
//     console.log(id);
//     if (!id) {
//       return response.status(404).json({
//         message: "Provide id",
//       });
//     }
//     const UpdatecartItem = await cartModel.deleteOne({
//       _id: id,
//       userId: userId,
//     });
//     const updateCartUser = await UserModel.updateOne(
//       { _id: userId },
//       {
//         $pull: {
//           Shopping_cart: productId,
//         },
//       }
//     );

//     return response.status(200).json({
//       message: "Cart Updated Successfully",
//       success: true,
//       error: false,
//       data: UpdatecartItem,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };
export const removecartItem = async (request, response) => {
  try {
    const userId = request.userId;
    const { id } = request.params;

    if (!id) {
      return response.status(404).json({
        message: "Provide cart item id",
      });
    }

    // Step 1: Get the cart item to access productId
    const cartItem = await cartModel.findOne({ _id: id, userId });

    if (!cartItem) {
      return response.status(404).json({
        message: "Cart item not found",
      });
    }

    const productId = cartItem.productId;

    // Step 2: Delete the cart item
    const UpdatecartItem = await cartModel.deleteOne({
      _id: id,
      userId: userId,
    });

    // Step 3: Update user's Shopping_cart
    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $pull: {
          Shopping_cart: productId,
        },
      }
    );

    return response.status(200).json({
      message: "Cart item removed successfully",
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
