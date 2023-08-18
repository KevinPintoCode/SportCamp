import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import ExpressError from "../utilities/expressError.js";
import User from "../models/users.js";
import passport from "passport";
import { storeReturnTo } from "../utilities/isLoggedIn.js";
import { isLoggedIn } from "../utilities/isLoggedIn.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/register",
  wrapAsync(async (req, res) => {
    res.render("users/register");
  })
);

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
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
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/sportgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have signed out!");
    res.redirect("/sportgrounds");
  });
});

export default router;
