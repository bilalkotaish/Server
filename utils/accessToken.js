import jwt from "jsonwebtoken";

const generateAccessToken = async (UserId) => {
  const token = await jwt.sign(
    { id: UserId },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {
      expiresIn: "1h",
    }
  );
  return token;
};
export default generateAccessToken;
