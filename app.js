import "dotenv/config";
//Dependencies Config
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import express, { response } from "express";
const app = express();
import ejsMate from "ejs-mate";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoSanitize from "express-mongo-sanitize";
import sanitizeHtml from "sanitize-html";

//Models
import Sportground from "./models/sportgrounds.js";
import Review from "./models/reviews.js";
import User from "./models/users.js";

//App.use config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static("public"));
app.use(mongoSanitize());

//Helmet

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

//Session
const sessionConfig = {
  name: "Sportgrounds",
  secret: "cuqui",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: +1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//Passport(Need to be done after session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Functions and Utilities
import wrapAsync from "./utilities/wrapAsync.js";
import ExpressError from "./utilities/expressError.js";
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Routes
import sportgroundsRoutes from "./routes/sportground.js";
import reviewsRoutes from "./routes/reviews.js";
import editRoutes from "./routes/edit.js";
import usersRoutes from "./routes/users.js";

//Moongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/SportCamp")
  .then(() => {
    console.log("connection open.");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

//Routes use
app.use("/sportgrounds", sportgroundsRoutes);
app.use("/sportgrounds/:id/reviews", reviewsRoutes);
app.use("/sportgrounds/:id", editRoutes);
app.use("/", usersRoutes);

//App
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Somethin went wrong";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, (req, res) => {
  console.log("Server Up");
});
