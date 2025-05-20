import addressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";
export const addAddress = async (req, res) => {
  try {
    const { Address_line, City, State, Pincode, Country, Status, Mobile } =
      req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing from request",
        success: false,
      });
    }
    // if (
    //   !Address_line ||
    //   !City ||
    //   !State ||
    //   !Pincode ||
    //   !Country ||
    //   !Status ||
    //   !Mobile
    // ) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    const newAddress = new addressModel({
      Address_line,
      City,
      State,
      Pincode,
      Country,
      Status,
      Mobile,
      userId,
    });
    const result = await newAddress.save();
    const updateAddressUser = await UserModel.updateOne(
      { _id: userId },
      { $push: { Address_details: result._id } }
    );

    return res.status(201).json({
      message: "Address added successfully",
      data: result,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add address",
      error: error.message,
      success: false,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const address = await addressModel.find({ userId: req?.query?.userId });
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Addresses fetched successfully",
      data: address,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch addresses",
      error: error.message,
      success: false,
    });
  }
};

export const SelectedAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.userId;

    // First reset all addresses for this user to unselected
    await addressModel.updateMany(
      { UserId: userId },
      { $set: { Selected: false } }
    );

    // Then set the specific address as selected
    const updatedAddress = await addressModel.findByIdAndUpdate(
      addressId,
      { $set: { Selected: true } },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Address selection updated successfully",
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address selection:", error);
    res.status(500).json({
      message: "Failed to update address selection",
      success: false,
      error: error.message,
    });
  }
};

export const DeleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await addressModel.findByIdAndDelete(addressId);
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Address deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete address",
      success: false,
      error: error.message,
    });
  }
};
