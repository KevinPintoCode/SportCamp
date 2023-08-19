import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
