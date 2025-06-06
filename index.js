import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./Config/connectdb.js";
import userRouter from "./route/userroute.js";
import CategoryRouter from "./route/category.route.js";
import ProductRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/myList.route.js";
import AddressRouter from "./route/address.route.js";
import BannerRouter from "./route/banner.route.js";
import BannerRouterV1 from "./route/bannerv1.route.js";
import BlogRouter from "./route/blog.route.js";

const app = express();

app.use(cors());
// app.options("*", cors());
app.use(express.json());
app.use(cookieParser()); // ✅ Correct
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use("/api/user", userRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/mylist", myListRouter);
app.use("/api/address", AddressRouter);
app.use("/api/homebanner", BannerRouter);
app.use("/api/bannerv1", BannerRouterV1);
app.use("/api/blog", BlogRouter);

app.get("/", (request, response) => {
  response.json({
    message: "Server is running:" + process.env.PORT,
  });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
  });
});
