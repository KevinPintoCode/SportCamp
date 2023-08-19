import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Sportground from "../models/sportgrounds.js";
import ExpressError from "../utilities/expressError.js";
import Review from "../models/reviews.js";
import { isAuthor, isLoggedIn } from "../utilities/middleware.js";
import controllers from "../controllers/sportgrounds.js";

const router = express.Router({ mergeParams: true });

router.get("/", wrapAsync(controllers.showpage));

router.get("/new", isLoggedIn, wrapAsync(controllers.newSportgroundForm));

router.post("/", isLoggedIn, wrapAsync(controllers.newSportground));

router.get("/:id", wrapAsync(controllers.showSportground));

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(controllers.deleteSportground)
);

export default router;
