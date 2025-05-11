import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";
import ProductModel from "../models/product.modal.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
var ImageArr = [];

export async function uploadProductImage(request, response) {
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

export async function createProduct(request, response) {
  try {
    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      price: request.body.price,
      images: ImageArr,
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
    });
    product = await product.save();
    if (!product) {
      return response.status(400).json({
        message: "Product Not Found",
        error: true,
        success: false,
      });
    }
    ImageArr = [];
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

export async function UpdateProduct(request, response) {
  try {
    let product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        images: ImageArr,
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
    ImageArr = [];
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
