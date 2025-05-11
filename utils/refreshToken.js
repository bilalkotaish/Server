import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const generateRefreshToken = async (userId) => {
  const Token = await jwt.sign(
    { userId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    {
      expiresIn: "1h",
    }
  );
  const UpdateToken = await UserModel.updateOne(
    { _id: userId },
    { refresh_token: Token }
  );
  return Token;
};

export default generateRefreshToken;
