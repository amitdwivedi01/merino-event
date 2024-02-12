import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  Review: {
    type: String,
   
  },
  name: String,
  email: String,
  mobile: String,
  id: String,
  Rating: {
    type: String,

  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  image3: {
    type: String,
  },
});

export default mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);