import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Sportground from "../models/sportgrounds.js";
import ExpressError from "../utilities/expressError.js";
import Review from "../models/reviews.js";
import { isLoggedIn } from "../utilities/isLoggedIn.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/edit",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const sportground = await Sportground.findById(req.params.id);
    if (!sportground) {
      req.flash("error", "Cannot find that Sportground!");
      return res.redirect("/sportgrounds");
    }
    res.render("sportgrounds/edit", { sportground });
  })
);

router.put(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const sportground = await Sportground.findByIdAndUpdate(id, {
      ...req.body.sportgrounds,
    });
    req.flash("success", "Succesfully updated Sportground!");
    res.redirect(`/sportgrounds/${sportground._id}`);
  })
);

export default router;
