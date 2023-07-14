import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import express, { response } from "express";
const app = express();
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
import Event from "./models/event.js";

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/events", async (req, res) => {
  const events = await Event.find({});
  res.render("events/index", { events });
});

app.get("/events/new", async (req, res) => {
  res.render("events/new");
});

app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body.events);
  await newEvent.save();
  res.redirect(`/events/${newEvent._id}`);
});

app.get("/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("events/show", { event });
});

app.get("/events/:id/edit", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("events/edit", { event });
});

app.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const editEvent = await Event.findByIdAndUpdate(id, { ...req.body.events });
  res.redirect(`/events/${editEvent._id}`);
});

app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  res.redirect("/events");
});

app.listen(3000, (req, res) => {
  console.log("Server Up");
});
