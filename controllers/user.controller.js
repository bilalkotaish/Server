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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
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

export async function UploadImageController(request, response) {
  try {
    const ImageArr = [];
    const imageFiles = request.files;
    const userId = request.userId;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return response
        .status(404)
        .json({ message: "User Not Found", error: true, success: false });
    }

    const imgUrl = user.Avatar;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imgName = image.split(".")[0];

    if (imgName) {
      const result = await cloudinary.uploader.destroy(
        imgName,
        (error, result) => {}
      );
    }

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
    user.Avatar = ImageArr[0];
    await user.save();
    return response.status(200).json({
      _id: userId,
      Avatar: ImageArr[0], // Return the first image as avatar
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
    });
  }
}

export async function deleteImageController(request, response) {
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
      user: updatedUser,
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
    const { email, password, confirmPassword } = request.body;

    const user = await UserModel.findOne({ email });
    if (!email || !password || !confirmPassword) {
      return response.status(400).json({
        success: false,
        message: "Email, password and confirm password are required",
      });
    }
    if (password !== confirmPassword) {
      return response.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return response.status(200).json({
      success: true,
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
    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );
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
