import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import express, { response } from "express";
const app = express();
import ejsMate from "ejs-mate";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
import Sportground from "./models/sportgrounds.js";
import wrapAsync from "./utilities/wrapAsync.js";
import ExpressError from "./utilities/expressError.js";
import Review from "./models/review.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/SportCamp")
  .then(() => {
    console.log("connection open.");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/sportgrounds",
  wrapAsync(async (req, res, next) => {
    const sportgrounds = await Sportground.find({});
    res.render("sportgrounds/index", { sportgrounds });
  })
);

app.get("/sportgrounds/new", async (req, res) => {
  res.render("sportgrounds/new");
});

app.post(
  "/sportgrounds",
  wrapAsync(async (req, res, next) => {
    const newSportground = new Sportground(req.body.sportgrounds);
    await newSportground.save();
    res.redirect(`/sportgrounds/${newSportground._id}`);
  })
);

app.get(
  "/sportgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const sportground = await Sportground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("sportgrounds/show", { sportground });
  })
);

app.get(
  "/sportgrounds/:id/edit",
  wrapAsync(async (req, res, next) => {
    const sportground = await Sportground.findById(req.params.id);
    res.render("sportgrounds/edit", { sportground });
  })
);

app.put(
  "/sportgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const editSportground = await Sportground.findByIdAndUpdate(id, {
      ...req.body.sportgrounds,
    });
    res.redirect(`/sportgrounds/${editSportground._id}`);
  })
);

app.delete(
  "/sportgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Sportground.findByIdAndDelete(id);
    res.redirect("/sportgrounds");
  })
);

app.post(
  "/sportgrounds/:id/reviews",
  wrapAsync(async (req, res) => {
    const sportground = await Sportground.findById(req.params.id);
    const review = new Review(req.body.review);
    sportground.reviews.push(review);
    await review.save();
    await sportground.save();
    res.redirect(`/sportgrounds/${sportground._id}`);
  })
);

app.delete(
  "/sportgrounds/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Sportground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/sportgrounds/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Somethin went wrong";
  res.status(statusCode).render("error.ejs", { err });
});
app.listen(3000, (req, res) => {
  console.log("Server Up");
});
