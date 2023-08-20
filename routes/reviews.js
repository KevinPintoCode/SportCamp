import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import { isLoggedIn, isReviewAuthor } from "../utilities/middleware.js";
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
