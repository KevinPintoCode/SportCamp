import mongoose from "mongoose";
import Event from "../models/event.js";
import { sports } from "./eventhelper.js";
import { descriptors } from "./eventhelper.js";
import { cities } from "./cities.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/SportCamp")
  .then(() => {
    console.log("connection open.");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];
console.log(sample(descriptors));
const seedDB = async () => {
  await Event.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const event = new Event({
      title: `${sample(descriptors)} ${sample(sports)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await event.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
