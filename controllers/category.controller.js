import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
var ImageArr = [];
export async function uploadImage(request, response) {
  try {
    ImageArr = [];
    const imageFiles = request.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < imageFiles?.length; i++) {
      const result = await cloudinary.uploader.upload(
        imageFiles[i].path,
        options
      );

      ImageArr.push(result.secure_url);

      // Delete file from local uploads folder
      fs.unlinkSync(imageFiles[i].path);
    }
    return response.status(200).json({
      message: "Image Uploaded successfully",
      images: ImageArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
    });
  }
}
export async function CreateCategory(request, response) {
  try {
    let category = new CategoryModel({
      name: request.body.name,
      images: ImageArr,
      color: request.body.color,
      parentCatId: request.body.parentCatId,
      parentCatname: request.body.parentCatname,
    });
    if (!category) {
      return response.status(400).json({ message: "Category not created" });
    }
    category = await category.save();
    ImageArr = [];

    return response.status(200).json({
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
    const imgUrl = request.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imgName = image.split(".")[0];

    if (imgName) {
      const result = await cloudinary.uploader.destroy(
        imgName,
        (error, result) => {}
      );

      if (result) {
        return response.status(200).send(result);
      }
    }
  } catch (error) {
    return response.status(500).json({ message: error.message || error });
  }
}

export async function deletecategory(request, response) {
  try {
    const id = request.params.id;
    const category = await CategoryModel.findById(id);
    const images = category.images;
    for (const img of images) {
      const imgurl = img;
      const urlArr = imgurl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];

      if (imageName) {
        const result = await cloudinary.uploader.destroy(
          imageName,
          (error, result) => {}
        );
      }
    }
    const SubCat = await CategoryModel.find({
      parentCatId: id,
    });
    for (let i = 0; i < SubCat.length; i++) {
      const thirdsub = await CategoryModel.find({
        parentCatId: SubCat[i]._id,
      });
      for (let i = 0; i < thirdsub.length; i++) {
        const deletethird = await CategoryModel.findByIdAndDelete(
          thirdsub[i]._id
        );
      }
      const deletesubCat = await CategoryModel.findByIdAndDelete(SubCat[i]._id);
    }
    const deletecat = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      return response.status(404).json({ message: "Category not found" });
    }
    if (!deletecat) {
      return response.status(404).json({ message: "Category not found" });
    }

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
