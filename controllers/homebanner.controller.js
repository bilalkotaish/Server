import homebannerModel from "../models/homebanner.models.js";
import fs from "fs";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadBannerImage(request, response) {
  try {
    const imageFiles = request.files;
    const uploadResults = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await imagekit.upload({
        file: fs.readFileSync(imageFiles[i].path), // Buffer or base64 string
        fileName: imageFiles[i].originalname,
        useUniqueFileName: true,
        folder: "Banners", // optional
      });

      uploadResults.push({
        url: result.url,
        fileId: result.fileId, // <-- capture this
      });

      fs.unlinkSync(imageFiles[i].path); // cleanup
    }

    return response.status(200).json({
      message: "Images uploaded successfully",
      images: uploadResults, // array of objects with url + fileId
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}
export async function createBanner(request, response) {
  try {
    const banner = new homebannerModel(request.body);
    const savedBanner = await banner.save();
    return response.status(201).json({
      banners: savedBanner,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}

export async function deleteBannerimage(request, response) {
  try {
    const fileId = request.query.fileId;

    if (!fileId) {
      return response.status(400).json({ message: "fileId is required" });
    }

    const result = await imagekit.deleteFile(fileId);

    return response.status(200).json({
      message: "Image deleted successfully",
      result,
    });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return response.status(500).json({
      message: error.message || "Failed to delete image",
    });
  }
}

export async function deleteBanner(request, response) {
  try {
    const bannerId = request.params.id;

    if (!bannerId) {
      return response.status(400).json({
        error: true,
        message: "bannerId is required",
        success: false,
      });
    }

    const result = await homebannerModel.findByIdAndDelete(bannerId);

    if (!result) {
      return response.status(404).json({
        error: true,
        message: "Banner Not Deleted",
        success: false,
      });
    }

    return response.status(200).json({
      message: "Banner Deleted Successfully",
      result,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getBanner(request, response) {
  try {
    const banners = await homebannerModel.find();
    return response.status(200).json({
      banners,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
export async function getBannerById(request, response) {
  try {
    const bannerId = request.params.bannerId;
    const banner = await homebannerModel.findById(bannerId);
    if (!banner) {
      return response.status(404).json({
        error: true,
        message: "Banner Not Found",
        success: false,
      });
    }
    return response.status(200).json({
      banner,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
export async function updateBanner(request, response) {
  try {
    const bannerId = request.params.bannerId;
    const updatedBanner = await homebannerModel.findByIdAndUpdate(
      bannerId,
      request.body,
      { new: true }
    );
    if (!updatedBanner) {
      return response.status(404).json({
        error: true,
        message: "Banner Not Found",
        success: false,
      });
    }
    return response.status(200).json({
      updatedBanner,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
