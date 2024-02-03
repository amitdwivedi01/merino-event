import ROLE from '@/config/ROLE';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  islogin:{
    type: String,
    default: 'false'
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Account already exists'],
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: true,
    unique: [true, 'Account already exists'],
    validate: [validator.isMobilePhone, 'Please enter a valid mobile number']
  },
  city: {
    type: String,
    require: true
  },
  role: {
    type: String
  },
  aadhaar_front: {
    type: String
  },
  aadhaar_back: {
    type: String
  },

  qrCode: {
    type: String
  },
  flightTicketToEvent: {
    type: String
  },
  flightTicketToHome: {
    type: String
  },
  hotelCheckedIn: {
    type: Boolean,
    default: false
  },
  eventCheckedIn: {
    type: Boolean,
    default: false
  },
  otp: {
    code: Number,
    time: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
