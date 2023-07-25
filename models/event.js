import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  sport: String,
  description: String,
  location: String,
  date: Date,
  players: Number,
  image: String,
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
