import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";
import ImageKit from "imagekit";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

var ImageArr = [];
export async function uploadImage(request, response) {
  try {
    const imageFiles = request.files;
    const uploadResults = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await imagekit.upload({
        file: fs.readFileSync(imageFiles[i].path), // Buffer or base64 string
        fileName: imageFiles[i].originalname,
        useUniqueFileName: true,
        folder: "uploads", // optional
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
export async function CreateCategory(request, response) {
  try {
    let category = new CategoryModel({
      name: request.body.name,
      images: request.body.images,
      color: request.body.color,
      parentCatId: request.body.parentCatId,
      parentCatname: request.body.parentCatname,
    });

    category = await category.save();

    return response.status(200).json({
      message: "Category created successfully",
      category: category,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function getCategories(request, response) {
  try {
    const Categories = await CategoryModel.find();
    const CategoryMap = {};
    Categories.forEach((cat) => {
      CategoryMap[cat._id] = { ...cat._doc, children: [] };
    });
    const rootCategories = [];
    Categories.forEach((cat) => {
      if (cat.parentCatId) {
        CategoryMap[cat.parentCatId].children.push(CategoryMap[cat._id]);
      } else {
        rootCategories.push(CategoryMap[cat._id]);
      }
    });
    return response.status(200).json({
      categories: rootCategories,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function getCategoriesCount(request, response) {
  try {
    const count = await CategoryModel.countDocuments({
      parentCatId: undefined,
    });
    if (!count) {
      return response.status(200).json({
        success: false,
      });
    }

    return response.status(200).json({
      count: count,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function subCategoriesCount(request, response) {
  try {
    const count = await CategoryModel.find();
    const SubCat = [];
    if (!count) {
      return response.status(200).json({
        success: false,
      });
    } else {
      for (let categories of count) {
        if (categories.parentCatId) {
          SubCat.push(categories);
        }
      }
    }
    return response.status(200).json({
      count: SubCat.length,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function getcategoryById(request, response) {
  try {
    const id = request.params.id;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return response.status(404).json({ message: "Category not found" });
    }
    return response.status(200).json(category);
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function deleteimage(request, response) {
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
export async function deletecategory(request, response) {
  try {
    const id = request.params.id;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return response.status(404).json({ message: "Category not found" });
    }

    // Delete images from ImageKit
    for (const img of category.images) {
      if (img.fileId) {
        await imagekit.deleteFile(img.fileId);
      }
    }

    // Handle subcategories
    const SubCat = await CategoryModel.find({ parentCatId: id });
    for (let sub of SubCat) {
      const thirdLevelSub = await CategoryModel.find({ parentCatId: sub._id });
      for (let third of thirdLevelSub) {
        await CategoryModel.findByIdAndDelete(third._id);
      }
      await CategoryModel.findByIdAndDelete(sub._id);
    }

    // Delete the main category
    await CategoryModel.findByIdAndDelete(id);

    return response
      .status(200)
      .json({ message: "Category deleted successfully" });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function UpdateCategory(request, response) {
  try {
    const id = request.params.id;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name: request.body.name,
        images: ImageArr.length > 0 ? ImageArr[0] : request.body.images,
        color: request.body.color,
        parentCatId: request.body.parentCatId,
        parentCatname: request.body.parentCatname,
      },
      {
        new: true,
      }
    );
    if (!category) {
      return response.status(404).json({ message: "Category not found" });
    }
    ImageArr = [];
    return response.status(200).json({
      message: "Category updated successfully",
      category: category,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}
