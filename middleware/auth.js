import { request, response } from "express";
import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    var token =
      request.cookies.accessToken ||
      request?.header?.authorization?.split("")[1];

    if (!token) {
      token = request.query.token;
    }

    if (!token) return response.status(401).json({ message: "Provide token" });
    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    if (!decode) {
      return response
        .status(401)
        .json({ message: "Unauthorized", error: true, success: false });
    }
    request.userId = decode.id;
    next();
  } catch (error) {
    response.status(401).json({
      message: "Your Are Not Logged In",
      success: false,
      error: true,
    });
  }
};

export default auth;
