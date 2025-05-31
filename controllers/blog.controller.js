import blogModel from "../models/blog.model.js";
import fs from "fs";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
export async function getBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perpage = parseInt(req.query.perpage) || 10;

    const totalPosts = await blogModel.countDocuments(); // Correct model used
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const blogs = await blogModel
      .find()
      .skip((page - 1) * perpage)
      .limit(perpage);

    return res.status(200).json({
      success: true,
      data: blogs,
      total: totalPosts,
      pages: totalPages,
      page: page,
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to fetch blogs",
    });
  }
}

export async function uploadBlogImage(request, response) {
  try {
    const imageFiles = request.files;
    const uploadResults = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await imagekit.upload({
        file: fs.readFileSync(imageFiles[i].path), // Buffer or base64 string
        fileName: imageFiles[i].originalname,
        useUniqueFileName: true,
        folder: "Blog", // optional
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

export async function createBlog(req, res) {
  try {
    const blog = new blogModel({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
    });
    const result = await blog.save();
    res.status(200).json({
      success: true,
      data: result,
      message: "Blog created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to create blog",
    });
  }
}

export async function updateBlog(req, res) {
  try {
    const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: blog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to update blog",
    });
  }
}

export async function deleteBlog(req, res) {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: blog,
      message: "Blog deleted successfully",
    });
    if (Array.isArray(blog.image)) {
      for (const img of blog.image) {
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
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to delete blog",
    });
  }
}

export async function getBlog(req, res) {
  try {
    const blog = await blogModel.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: blog,
      message: "Blog fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to fetch blog",
    });
  }
}

export async function deleteblogimage(request, response) {
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
