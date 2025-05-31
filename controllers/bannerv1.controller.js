import BannerV1Model from "../models/bannerv1.model.js";

import fs from "fs";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
export async function getBannerV1(req, res) {
  try {
    const bannerv1 = await BannerV1Model.find();
    res.status(200).json({
      success: true,
      data: bannerv1,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
export async function getBannerV1ById(req, res) {
  try {
    const bannerv1 = await BannerV1Model.findById(req.params.id);
    res.status(200).json({ success: true, data: bannerv1, error: false });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
export async function uploadBannerv1Image(request, response) {
  try {
    const imageFiles = request.files;
    const uploadResults = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await imagekit.upload({
        file: fs.readFileSync(imageFiles[i].path), // Buffer or base64 string
        fileName: imageFiles[i].originalname,
        useUniqueFileName: true,
        folder: "bannerv1", // optional
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
export async function createBannerV1(req, res) {
  try {
    const bannerv1 = new BannerV1Model({
      title: req.body.title,
      image: req.body.image,
      price: req.body.price,
      info: req.body.info,
      subcatId: req.body.subcatId,
      thirdsubcatId: req.body.thirdsubcatId,
      catId: req.body.catId,
    });
    const result = await bannerv1.save();
    res.status(200).json({
      success: true,
      data: result,
      error: false,
      message: "Banner created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create banner",
    });
  }
}

export async function updateBannerv1(req, res) {
  try {
    const bannerv1 = await BannerV1Model.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: bannerv1,
      error: false,
      message: "Banner updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update banner",
    });
  }
}
export async function deletebannerv1image(request, response) {
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
export async function deletebannerv1(req, res) {
  try {
    const bannerv1 = await BannerV1Model.findById(req.params.id);

    if (!bannerv1) {
      return res.status(404).json({
        success: false,
        error: "Banner not found",
      });
    }

    // Delete all associated images from ImageKit
    if (Array.isArray(bannerv1.image)) {
      for (const img of bannerv1.image) {
        if (img.fileId) {
          try {
            await imagekit.deleteFile(img.fileId);
          } catch (imageKitError) {
            console.error(
              "Failed to delete image from ImageKit:",
              imageKitError
            );
          }
        }
      }
    }

    // Delete banner from MongoDB
    await BannerV1Model.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: bannerv1,
      error: false,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete banner",
    });
  }
}
