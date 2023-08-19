import Review from "../models/reviews.js";
import Sportground from "../models/sportgrounds.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be sign in first!");
    return res.redirect("/login");
  }
  next();
};

export const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const sportground = await Sportground.findById(id);
  if (!sportground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/sportgrounds/${id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/sportgrounds/${id}`);
  }
  next();
};
