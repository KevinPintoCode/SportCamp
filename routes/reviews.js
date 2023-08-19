import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Sportground from "../models/sportgrounds.js";
import ExpressError from "../utilities/expressError.js";
import Review from "../models/reviews.js";
import {
  isLoggedIn,
  isAuthor,
  isReviewAuthor,
} from "../utilities/middleware.js";
import controllers from "../controllers/sportgrounds.js";

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, wrapAsync(controllers.newReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(controllers.deleteReview)
);

export default router;
