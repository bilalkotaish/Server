import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

import ProductModel from "../models/product.modal.js";
import fs from "fs";
import ImageKit from "imagekit";
import productRAMModel from "../models/productRAMS.model.js";
import productSizeModel from "../models/productSize.js";
import productweightModel from "../models/productweight.js";
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

export async function uploadProductImage(request, response) {
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

export async function createProduct(request, response) {
  try {
    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      price: request.body.price,
      images: request.body.images,
      brand: request.body.brand,
      oldprice: request.body.oldprice,
      rating: request.body.rating,
      category: request.body.category,
      catname: request.body.catname,
      catId: request.body.catId,
      subcatname: request.body.subcatname,
      subcatId: request.body.subcatId,
      thirdsubname: request.body.thirdsubname,
      thirdsubcatId: request.body.thirdsubcatId,
      countInStock: request.body.countInStock,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productweight: request.body.productweight,
    });
    product = await product.save();
    if (!product) {
      return response.status(400).json({
        message: "Product Not Found",
        error: true,
        success: false,
      });
    }

    response.status(200).json({
      message: "Product Created Successfully",
      error: false,
      success: true,
      product: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
    });
  }
}

export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductByCategory(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catId: request.params.id })
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductByCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catname: request.query.catname })
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductBySubCategory(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subcatId: request.params.id })
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductBySubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      subcatname: request.query.subcatname,
    })
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function getProductByThirdSubCategory(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubcatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductByThirdSubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubname: request.query.subcatname,
    })
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductsByPrice(request, response) {
  try {
    let Productlist = [];
    if (request.query.catId !== "" && request.query.catId !== undefined) {
      const ProductlistArr = await ProductModel.find({
        catId: request.query.catId,
      }).populate("category");
      Productlist = ProductlistArr;
    }
    if (request.query.subcatId !== "" && request.query.subcatId !== undefined) {
      const ProductlistArr = await ProductModel.find({
        subcatId: request.query.subcatId,
      }).populate("category");
      Productlist = ProductlistArr;
    }

    if (
      request.query.thirdsubcatId !== "" &&
      request.query.thirdsubcatId !== undefined
    ) {
      const ProductlistArr = await ProductModel.find({
        thirdsubcatId: request.query.thirdsubcatId,
      }).populate("category");
      Productlist = ProductlistArr;
    }

    const FilteredProducts = Productlist.filter((product) => {
      if (
        request.query.minPrice &&
        product.price < parseInt(+request.query.minPrice)
      ) {
        return false;
      } else if (
        request.query.maxPrice &&
        product.price > parseInt(+request.query.maxPrice)
      ) {
        return false;
      }
      return true;
    });

    return response.status(200).json({
      product: FilteredProducts,
      totalPages: 0,
      page: 0,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perpage = parseInt(request.query.perpage) || 10;

    const query = {};

    if (request.query.rating) {
      query.rating = request.query.rating;
    }

    if (request.query.catId) {
      query.catId = request.query.catId;
    }

    console.log(request.query.subcatId);
    if (request.query.subcatId) {
      query.subcatId = request.query.subcatId;
    }
    console.log(request.query.thirdsubcatId);
    if (request.query.thirdsubcatId) {
      query.thirdsubcatId = request.query.thirdsubcatId;
    }

    const totalPosts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages && totalPages > 0) {
      return response.status(400).json({
        message: "Page Not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find(query)
      .populate("category")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductCount(request, response) {
  try {
    const ProductCount = await ProductModel.countDocuments();
    if (!ProductCount) {
      response.status(400).json({
        error: true,
        success: false,
      });
    }
    response.status(200).json({
      error: false,
      success: true,
      ProductCount: ProductCount,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getFeaturedProduct(request, response) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "Products Not Found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products Found",
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );
    if (!product) {
      return response.status(404).json({
        error: true,
        message: "Product Not Found",
        success: false,
      });
    }

    const images = product.images;

    for (const img of images) {
      const fileId = img.fileId; // Make sure fileId is saved in DB
      if (fileId) {
        await imagekit.deleteFile(fileId);
      }
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(
      request.params.id
    );
    if (!deletedProduct) {
      return response.status(404).json({
        error: true,
        message: "Product Not Deleted",
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      message: "Product Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function deleteMultipleProduct(request, response) {
  try {
    const ids = request.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response.status(400).json({
        error: true,
        message: "No valid Product IDs provided",
        success: false,
      });
    }

    // Validate each ID
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return response.status(400).json({
        error: true,
        message: "No valid ObjectIds provided",
        success: false,
      });
    }

    const products = await ProductModel.find({ _id: { $in: validIds } });

    if (!products || products.length === 0) {
      return response.status(404).json({
        error: true,
        message: "Products Not Found",
        success: false,
      });
    }

    for (const product of products) {
      const images = product.images || [];
      for (const img of images) {
        const fileId = img.fileId;
        if (fileId) {
          await imagekit.deleteFile(fileId);
        }
      }
    }

    await ProductModel.deleteMany({ _id: { $in: validIds } });

    return response.status(200).json({
      error: false,
      message: "Products Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );
    if (!product) {
      return response.status(404).json({
        error: true,
        message: "Product Not Found",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      data: product,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function deleteProductimage(request, response) {
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

export async function UpdateProduct(request, response) {
  try {
    let product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        images: request.body.images,
        brand: request.body.brand,
        oldprice: request.body.oldprice,
        rating: request.body.rating,
        catname: request.body.catname,
        catId: request.body.catId,
        subcatname: request.body.subcatname,
        subcatId: request.body.subcatId,
        thirdsubname: request.body.thirdsubname,
        thirdsubcatId: request.body.thirdsubcatId,
        countInStock: request.body.countInStock,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,
        productRam: request.body.productRam,
        size: request.body.size,
        productweight: request.body.productweight,
      },
      {
        new: true,
      }
    );
    if (!product) {
      return response.status(404).json({
        error: true,
        message: "Product Not Found",
        success: false,
      });
    }
    const images = product.images;
    return response.status(200).json({
      error: false,
      message: "Product Updated Successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function createProductRam(request, response) {
  try {
    const product = new productRAMModel(request.body); // Create instance
    await product.save(); // Save to DB

    return response.status(201).json({
      error: false,
      success: true,
      message: "Product Created Successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating RAM product:", error);
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
export async function createProductSize(request, response) {
  try {
    const product = await productSizeModel.create(request.body);
    return response.status(201).json({
      error: false,
      message: "Product Created Successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function createProductWeight(request, response) {
  try {
    const product = await productweightModel.create(request.body);
    return response.status(201).json({
      error: false,
      message: "Product Created Successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UpdateProductRam(request, response) {
  try {
    const productRam = await productRAMModel.findByIdAndUpdate(
      request.params.id,
      { ram: request.body.ram },
      { new: true }
    );

    if (!productRam) {
      return response.status(404).json({
        error: true,
        message: "Product RAM Not Found",
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      message: "Product RAM Updated Successfully",
      success: true,
      data: productRam,
    });
  } catch (error) {
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

export async function UpdateProductWeight(request, response) {
  try {
    const productWeight = await productweightModel.findByIdAndUpdate(
      request.params.id,
      { weight: request.body.weight },
      { new: true }
    );

    if (!productWeight) {
      return response.status(404).json({
        error: true,
        message: "Product Weight Not Found",
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      message: "Product Weight Updated Successfully",
      success: true,
      data: productWeight,
    });
  } catch (error) {
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

export async function UpdateProductSize(request, response) {
  try {
    const { size } = request.body;

    if (!size || typeof size !== "string") {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invalid or missing 'name' in request body",
      });
    }

    const productSize = await productSizeModel.findByIdAndUpdate(
      request.params.id,
      { size },
      { new: true, runValidators: true }
    );

    if (!productSize) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product Size Not Found",
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      message: "Product Size Updated Successfully",
      data: productSize,
    });
  } catch (error) {
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

export async function getProductSize(request, response) {
  try {
    const productSizes = await productSizeModel.find(); // Fetch all product sizes

    return response.status(200).json({
      error: false,
      success: true,
      data: productSizes,
    });
  } catch (error) {
    console.error("Error fetching product sizes:", error);
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

export async function getProductSizeById(request, response) {
  try {
    const productsize = await productSizeModel.findById(request.params.id);
    if (!productsize) {
      return response.status(404).json({
        error: true,
        message: "Product Size Not Found",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      data: productsize,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductRam(request, response) {
  try {
    const products = await productRAMModel.find(); // Fetch all documents

    return response.status(200).json({
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching RAM products:", error);
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

export async function getProductramById(request, response) {
  try {
    const productram = await productRAMModel.findById(request.params.id);
    if (!productram) {
      return response.status(404).json({
        error: true,
        message: "Product Size Not Found",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      data: productram,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function getProductWeight(request, response) {
  try {
    const productWeights = await productweightModel.find();

    return response.status(200).json({
      error: false,
      success: true,
      data: productWeights,
    });
  } catch (error) {
    console.error("Error fetching product weights:", error);
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

export async function getProductweightById(request, response) {
  try {
    const productweight = await productweightModel.findById(request.params.id);
    if (!productweight) {
      return response.status(404).json({
        error: true,
        message: "Product Size Not Found",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      data: productweight,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteProductram(request, response) {
  try {
    const productram = await productRAMModel.findByIdAndDelete(
      request.params.id
    );
    if (!productram) {
      return response.status(404).json({
        error: true,
        message: "Product Ram Not Deleted",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      message: "Product Ram Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function deleteProductsize(request, response) {
  try {
    const productsize = await productSizeModel.findByIdAndDelete(
      request.params.id
    );
    if (!productsize) {
      return response.status(404).json({
        error: true,
        message: "Product Size Not Deleted",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      message: "Product Size Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function deleteProductweight(request, response) {
  try {
    const productweight = await productweightModel.findByIdAndDelete(
      request.params.id
    );
    if (!productweight) {
      return response.status(404).json({
        error: true,
        message: "Product Weight Not Deleted",
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      message: "Product weight Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
