import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Sportground from "../models/sportgrounds.js";
import ExpressError from "../utilities/expressError.js";
import Review from "../models/reviews.js";
import { isAuthor, isLoggedIn } from "../utilities/middleware.js";
import controllers from "../controllers/sportgrounds.js";

const router = express.Router({ mergeParams: true });

router.get("/edit", isLoggedIn, isAuthor, wrapAsync(controllers.editForm));

router.put("/", isLoggedIn, isAuthor, wrapAsync(controllers.updateForm));

export default router;
