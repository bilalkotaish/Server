import sendEmailFun from "../Config/sendEmail.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import VerificationEmail from "../utils/VerifyEmailtemplate.js";
import UserModel from "../models/user.model.js";
import generateAccessToken from "../utils/accessToken.js";
import generateRefreshToken from "../utils/refreshToken.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { error } from "console";
import ImageKit from "imagekit";

import path from "path";
import ReviewsModel from "../models/reviews.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide email, password, and name",
        error: true,
        success: false,
      });
    }

    user = await UserModel.findOne({ email: email });
    if (user) {
      return response.json({
        message: "User is Already Registered With this Email",
        error: true,
        success: false,
      });
    }

    const verifycode = Math.floor(10000 + Math.random() * 900000).toString();
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    user = new UserModel({
      name,
      email,
      password: hashpassword,
      otp: verifycode,
      otpexpiry: Date.now() + 60000,
    });

    await user.save();

    await sendEmailFun({
      sendTo: user.email,
      subject: "Verify Your Email from Billy Ecommerce",
      text: "",
      html: VerificationEmail(name, verifycode),
    });

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    return response.status(201).json({
      success: true,
      error: false,
      message: "User Registered Successfully, Verify Your Email",
      token,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function authWithGoogleController(request, response) {
  try {
    const { name, email, Avatar, password, Mobile, Role } = request.body;
    const existinguser = await UserModel.findOne({ email: email });
    if (!existinguser) {
      const user = await UserModel.create({
        name: name,
        email: email,
        password: "null",
        Avatar: Avatar,
        Mobile: Mobile,
        Role: Role,
        Verify_email: true,
        SignUpGoogle: true,
      });
      const accesstoken = await generateAccessToken(user._id);
      const refreshToken = await generateRefreshToken(user._id);

      await UserModel.findByIdAndUpdate(user._id, {
        Last_Login: new Date(),
      });

      const cookiesoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };

      response.cookie("refreshToken", refreshToken, cookiesoptions);
      response.cookie("accessToken", accesstoken, cookiesoptions);

      return response.status(200).json({
        success: true,
        error: false,
        message: "Login Success",
        data: {
          accesstoken,
          refreshToken,
          userId: user._id,
        },
      });
    } else {
      const accesstoken = await generateAccessToken(existinguser._id);
      const refreshToken = await generateRefreshToken(existinguser._id);
      const cookiesoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      response.cookie("refreshToken", refreshToken, cookiesoptions);
      response.cookie("accessToken", accesstoken, cookiesoptions);
      return response.status(200).json({
        success: true,
        error: false,
        message: "Login Success",
        data: {
          accesstoken,
          refreshToken,
          userId: existinguser._id,
        },
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function verifyEmailController(request, response) {
  try {
    const { email, otp } = request.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User Not Found",
      });
    }
    const isCodevalid = user.otp === otp;
    const isnotxpired = user.otpexpiry > Date.now();

    if (isCodevalid && isnotxpired) {
      user.Verify_email = true;
      user.otp = null;
      user.otpexpiry = null;
      await user.save();
      return response.status(200).json({
        success: true,
        error: false,
        message: "email verified successfully",
      });
    } else if (!isCodevalid) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Invalid OTP",
      });
    } else if (!isnotxpired) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "OTP Expired",
      });
    }
  } catch {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function LoginController(request, response) {
  try {
    const { email, password } = request.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User Not Found",
      });
    }

    if (user.Status !== "Active") {
      return response.status(400).json({
        success: false,
        error: true,
        message: "User is not active",
      });
    }
    if (user.Verify_email !== true) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Email not verified",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Invalid Password",
      });
    }

    const accesstoken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, {
      Last_Login: new Date(),
    });

    const cookiesoptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("refreshToken", refreshToken, cookiesoptions);
    response.cookie("accessToken", accesstoken, cookiesoptions);

    return response.status(200).json({
      success: true,
      error: false,
      message: "Login Success",
      data: {
        accesstoken,
        refreshToken,
        userId: user._id,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function LogoutController(request, response) {
  try {
    const userid = request.userId;
    const cookiesoptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.clearCookie("refreshToken", cookiesoptions);
    response.clearCookie("accessToken", cookiesoptions);
    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return response.status(200).json({
      success: true,
      message: "Logged Out Successfully",
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

// export async function UploadImageController(request, response) {
//   try {
//     const ImageArr = [];
//     const imageFiles = request.files;
//     const userId = request.userId;
//     const user = await UserModel.findOne({ _id: userId });
//     if (!user) {
//       return response
//         .status(404)
//         .json({ message: "User Not Found", error: true, success: false });
//     }

//     const imgUrl = user.Avatar;
//     const urlArr = imgUrl.split("/");
//     const image = urlArr[urlArr.length - 1];
//     const imgName = image.split(".")[0];

//     if (imgName) {
//       const result = await cloudinary.uploader.destroy(
//         imgName,
//         (error, result) => {}
//       );
//     }

//     const options = {
//       use_filename: true,
//       unique_filename: false,
//       overwrite: false,
//     };

//     for (let i = 0; i < imageFiles?.length; i++) {
//       const result = await cloudinary.uploader.upload(
//         imageFiles[i].path,
//         options
//       );

//       ImageArr.push(result.secure_url);

//       // Delete file from local uploads folder
//       fs.unlinkSync(imageFiles[i].path);
//     }
//     user.Avatar = ImageArr[0];
//     await user.save();
//     return response.status(200).json({
//       _id: userId,
//       Avatar: ImageArr[0], // Return the first image as avatar
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//     });
//   }
// }
export async function UploadImageController(req, res) {
  try {
    const imageFiles = req.files;
    const userId = req.userId;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found", error: true, success: false });
    }

    // Optional: delete previous avatar (only if stored by fileId and you kept it)
    if (user.AvatarFileId) {
      await imagekit.deleteFile(user.AvatarFileId);
    }

    const uploadResponses = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const filePath = imageFiles[i].path;
      const fileName = path.basename(filePath);

      const result = await imagekit.upload({
        file: fs.readFileSync(filePath),
        fileName,
        folder: "user_avatars", // Optional: organize uploads
      });

      uploadResponses.push(result.url);

      fs.unlinkSync(filePath); // remove file from local uploads
    }

    // Save the first image URL to user Avatar
    user.Avatar = uploadResponses[0];
    await user.save();

    return res.status(200).json({
      _id: userId,
      Avatar: uploadResponses[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
    });
  }
}

export async function deleteImageController(request, response) {
  try {
    const imgUrl = request.query.img;
    const urlParts = imgUrl.split("/");
    const imgFileName = urlParts[urlParts.length - 1]; // e.g. abc123.jpg

    const fileId = await imagekit.listFiles({
      name: imgFileName,
    });

    if (fileId.length > 0) {
      const result = await imagekit.deleteFile(fileId[0].fileId);

      return response.status(200).json({
        success: true,
        error: false,
        message: "Image deleted successfully",
        data: result,
      });
    } else {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Image not found in ImageKit",
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId;
    const { name, email, Mobile, password } = request.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).send("User not found");
    }
    let verifycode = "";

    if (email !== user.email) {
      verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    let hashpassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashpassword = await bcryptjs.hash(password, salt);
    } else {
      hashpassword = user.password;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name: name,
        email: email,
        Mobile: Mobile,
        password: hashpassword,
        Verify_email: email !== user.email ? false : true,
        otp: verifycode !== "" ? verifycode : null,
        otpexpiry: verifycode !== "" ? Date.now() + 60000 : "",
      },
      {
        new: true,
      }
    );
    if (email !== user.email) {
      await sendEmailFun({
        sendTo: user.email,
        subject: "Verify Email from Billy Ecommerce",
        text: ` `,
        html: VerificationEmail(name, verifycode),
      });
    }
    return response.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: {
        name: updatedUser?.name,
        _id: updatedUser?._id,
        email: updatedUser?.email,
        Mobile: updatedUser?.Mobile,
        Avatar: updatedUser?.Avatar,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function forgetPassword(request, response) {
  try {
    const { email } = request.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
      otp: verifycode,
      otpexpiry: Date.now() + 60000,
    });

    await sendEmailFun({
      sendTo: user.email,
      subject: "Verify Password from Billy Ecommerce",
      text: ` `,
      html: VerificationEmail(user.name, verifycode),
    });
    return response.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
}

export async function VerifyForgetPassword(request, response) {
  try {
    const { otp, email } = request.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!email || !otp) {
      return response.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }
    if (user.otp !== otp) {
      return response.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const currentTime = Date.now().toString();
    if (user.otpexpiry < currentTime) {
      return response.status(404).json({
        success: false,
        message: "OTP Expired",
      });
    }
    user.otp = "";
    user.otpexpiry = "";
    await user.save();
    return response.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
}

export async function resetPassword(request, response) {
  try {
    const { email, oldPassword, password, confirmPassword } = request.body;

    if (!email || !password || !confirmPassword) {
      return response.status(400).json({
        success: false,
        message: "Email, password and confirm password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user?.SignUpGoogle === false) {
      // If oldPassword is provided, validate it
      if (oldPassword) {
        const isPasswordValid = await bcryptjs.compare(
          oldPassword,
          user.password
        );
        if (!isPasswordValid) {
          return response.status(400).json({
            success: false,
            error: true,
            message: "Your Old Password is incorrect",
          });
        }
      }
    }

    if (password !== confirmPassword) {
      return response.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return response.status(200).json({
      success: true,
      error: false,
      message: "Password reset successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
}

export async function refreshToken(request, response) {
  try {
    const refreshtoken =
      request.cookies.refreshToken ||
      request?.header?.authorization?.split("")[1];
    if (!refreshtoken) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const Verifytoken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!Verifytoken) {
      return response.status(401).json({
        success: false,
        message: "TOKEN EXPIRED",
      });
    }
    const userId = Verifytoken._id;
    const newaccesstoken = await generateAccessToken(userId);
    const cookiesoptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accesstoken", newaccesstoken, cookiesoptions);
    return response.status(200).json({
      success: true,
      message: "Refresh token successfully",
      data: {
        accesstoken: newaccesstoken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
    });
  }
}

export async function UserDetails(request, response) {
  try {
    const userId = request.userId;
    const user = await UserModel.findById(userId)
      .populate("Address_details")
      .select("-password -refresh_token");
    return response.status(200).json({
      success: true,
      message: "User details successfully",
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
    });
  }
}

export async function AddUserReviews(request, response) {
  try {
    const { image, userName, review, rating, userId, productId } = request.body;
    const Review = new ReviewsModel({
      image: image,
      userName: userName,
      review: review,
      rating: rating,
      userId: userId,
      productId: productId,
    });
    await Review.save();
    return response.status(200).json({
      success: true,
      message: "Review added successfully",
      data: Review,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getallUserReviews(request, response) {
  try {
    const reviews = await ReviewsModel.find()
      .populate("productId")
      .select("-productId");
    return response.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getUserReviews(request, response) {
  try {
    const { productId } = request.query; // ✅ fix: get from query

    const reviews = await ReviewsModel.find({ productId })
      .populate("productId")
      .select("-productId");

    if (!reviews || reviews.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No reviews found for this product.",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
