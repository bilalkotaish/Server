import { request, response } from "express";
import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    let token =
      request.cookies.accesstoken ||
      request.headers.authorization?.split(" ")[1]; // ✅ split by space

    if (!token) {
      return response.status(401).json({ message: "Provide token" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    request.userId = decode.id;
    next();
  } catch (error) {
    response.status(401).json({
      message: "You Are Not Logged In",
      success: false,
      error: true,
    });
  }
};

export default auth;
