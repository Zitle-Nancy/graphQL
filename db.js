import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI_ENV = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI_ENV, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connection to MongoDB", error.message);
  });
