import Sportground from "../models/sportgrounds.js";
import Review from "../models/reviews.js";
import User from "../models/users.js";
import { cloudinary } from "../cloudinary/index.js";

const controllers = {
  //Sportgrounds showpage, details and new
  ///////////////////////////////////////
  showpage: async (req, res, next) => {
    const sportground = await Sportground.find({});
    res.render("sportgrounds/index", { sportground });
  },
  newSportgroundForm: async (req, res) => {
    res.render("sportgrounds/new");
  },
  newSportground: async (req, res, next) => {
    const sportground = new Sportground(req.body.sportgrounds);
    sportground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    sportground.author = req.user._id;
    await sportground.save();
    req.flash("success", "Successfully register a new Sportground!");
    res.redirect(`/sportgrounds/${sportground._id}`);
  },
  showSportground: async (req, res, next) => {
    const sportground = await Sportground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("author");
    if (!sportground) {
      req.flash("error", "Cannot find that Sportground!");
      return res.redirect("/sportgrounds");
    }
    res.render("sportgrounds/show", { sportground });
  },
  //Delete Sportground
  ///////////////////////////////////////
  deleteSportground: async (req, res, next) => {
    const { id } = req.params;
    await Sportground.findByIdAndDelete(id);
    req.flash("success", "Sportground deleted!");
    res.redirect("/sportgrounds");
  },
  //Edit, review and update
  ///////////////////////////////////////
  editForm: async (req, res, next) => {
    const sportground = await Sportground.findById(req.params.id);
    if (!sportground) {
      req.flash("error", "Cannot find that Sportground!");
      return res.redirect("/sportgrounds");
    }
    res.render("sportgrounds/edit", { sportground });
  },
  updateForm: async (req, res, next) => {
    const { id } = req.params;
    const sportground = await Sportground.findByIdAndUpdate(id, {
      ...req.body.sportgrounds,
    });
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    sportground.images.push(...imgs);
    await sportground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await sportground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Succesfully updated Sportground!");
    res.redirect(`/sportgrounds/${sportground._id}`);
  },
  newReview: async (req, res) => {
    const sportground = await Sportground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    sportground.reviews.push(review);
    await review.save();
    await sportground.save();
    req.flash("success", "New review added to the Sportground!");
    res.redirect(`/sportgrounds/${sportground._id}`);
  },
  deleteReview: async (req, res) => {
    const { id, reviewId } = req.params;
    await Sportground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/sportgrounds/${id}`);
  },
  //Users
  ///////////////////////////////////////
  registerForm: async (req, res) => {
    res.render("users/register");
  },
  register: async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next();
        req.flash("success", "Welcome to Sportground!");
        res.redirect("/sportgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  },
  loginForm: async (req, res) => {
    res.render("users/login");
  },
  login: async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/sportgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  },
  logout: async (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have signed out!");
      res.redirect("/sportgrounds");
    });
  },
};

export default controllers;
