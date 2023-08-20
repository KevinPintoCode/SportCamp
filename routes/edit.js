import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import { isAuthor, isLoggedIn } from "../utilities/middleware.js";
import controllers from "../controllers/sportgrounds.js";
import { storage } from "../cloudinary/index.js";
import multer from "multer";

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: storage });

router.put(
  "/",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  wrapAsync(controllers.updateForm)
);

router.get("/edit", isLoggedIn, isAuthor, wrapAsync(controllers.editForm));

export default router;
