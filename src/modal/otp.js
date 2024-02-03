import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
