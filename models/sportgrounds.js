import mongoose from "mongoose";
import Review from "./reviews.js";
const Schema = mongoose.Schema;

const SportgroundSchema = new Schema({
  title: String,
  sport: String,
  description: String,
  location: String,
  players: Number,
  image: String,
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
