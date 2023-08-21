import mongoose from "mongoose";
import Review from "./reviews.js";
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  filename: String,
  url: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_180");
});
const SportgroundSchema = new Schema({
  title: String,
  sport: String,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  players: Number,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

SportgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
const Sportground = mongoose.model("Sportground", SportgroundSchema);

export default Sportground;
