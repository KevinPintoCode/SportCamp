import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import ExpressError from "../utilities/expressError.js";
import User from "../models/users.js";
import passport from "passport";
import { storeReturnTo, isLoggedIn } from "../utilities/middleware.js";
import controllers from "../controllers/sportgrounds.js";

const router = express.Router({ mergeParams: true });

router.get("/register", wrapAsync(controllers.registerForm));

router.post("/register", wrapAsync(controllers.register));

router.get("/login", wrapAsync(controllers.loginForm));

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(controllers.login)
);

router.get("/logout", wrapAsync(controllers.logout));

export default router;
