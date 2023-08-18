import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Sportground from "../models/sportgrounds.js";
import ExpressError from "../utilities/expressError.js";
import Review from "../models/reviews.js";
import { isLoggedIn } from "../utilities/isLoggedIn.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const sportgrounds = await Sportground.find({});
    res.render("sportgrounds/index", { sportgrounds });
  })
);

router.get("/new", isLoggedIn, async (req, res) => {
  res.render("sportgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const newSportground = new Sportground(req.body.sportgrounds);
    await newSportground.save();
    req.flash("success", "Successfully register a new Sportground!");
    res.redirect(`/sportgrounds/${newSportground._id}`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const sportground = await Sportground.findById(req.params.id).populate(
      "reviews"
    );
    if (!sportground) {
      req.flash("error", "Cannot find that Sportground!");
      return res.redirect("/sportgrounds");
    }
    res.render("sportgrounds/show", { sportground });
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Sportground.findByIdAndDelete(id);
    req.flash("success", "Sportground deleted!");
    res.redirect("/sportgrounds");
  })
);

export default router;
