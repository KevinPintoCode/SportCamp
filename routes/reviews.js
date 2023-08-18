import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Sportground from "../models/sportgrounds.js";
import ExpressError from "../utilities/expressError.js";
import Review from "../models/reviews.js";
import { isLoggedIn } from "../utilities/isLoggedIn.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const sportground = await Sportground.findById(req.params.id);
    const review = new Review(req.body.review);
    sportground.reviews.push(review);
    await review.save();
    await sportground.save();
    req.flash("success", "New review added to the Sportground!");
    res.redirect(`/sportgrounds/${sportground._id}`);
  })
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Sportground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/sportgrounds/${id}`);
  })
);

export default router;
