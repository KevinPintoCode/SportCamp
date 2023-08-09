import mongoose from "mongoose";
import Sportground from "../models/sportgrounds.js";
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
const seedDB = async () => {
  await Sportground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPlayers = Math.floor(Math.random() * 22) + 2;
    const sportground = new Sportground({
      title: `${sample(descriptors)} ${sample(sports)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "https://source.unsplash.com/collection/345761/800x600",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      date: "12/5/2023",
      players: randomPlayers,
    });
    await sportground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
