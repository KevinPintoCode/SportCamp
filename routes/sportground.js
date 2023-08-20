import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import { isAuthor, isLoggedIn } from "../utilities/middleware.js";
import controllers from "../controllers/sportgrounds.js";
import { storage } from "../cloudinary/index.js";
import multer from "multer";

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: storage });

router.get("/", wrapAsync(controllers.showpage));

router.get("/new", isLoggedIn, wrapAsync(controllers.newSportgroundForm));

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  wrapAsync(controllers.newSportground)
);

router.get("/:id", wrapAsync(controllers.showSportground));

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(controllers.deleteSportground)
);

export default router;
