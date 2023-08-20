import dotenv from "dotenv";
import { createRequire } from "module";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const require = createRequire(import.meta.url);
export const cloudinary = require("cloudinary").v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";

export const cloudConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Sportground",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});
