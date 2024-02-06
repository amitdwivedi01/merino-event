"use server";
import dbConnect from "@/config/db";
import User from "@/modal/user";
import Otp from "@/modal/otp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TwilioSDK from "twilio";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { clearCookie } from "../../utils/commonUtils";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from 'body-parser';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const base_url = process.env.BASE_URL;
const admin_mobile = process.env.ADMIN_MOBILE;
const expiredInTime = 60 * 10;

const client = TwilioSDK(accountSid, authToken);

export const verifyOTP = async ({ mobile, otpCode }) => {
  await dbConnect();
  const otp = await Otp.findOne({ mobile });
  if (!otp || !otp.code) throw new Error("Invalid OTP");
  const time_diff = (new Date() - new Date(otp.time)) / 1000;
  if (time_diff > expiredInTime) throw new Error("OTP Expired");
  const isValid = otp.code === otpCode;
  if (isValid) await Otp.findOneAndDelete({ mobile });
  return isValid;
};

function generateOTP(length = 4) {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
const getOTP = async ({ mobile }) => {
  const code = generateOTP();
  await dbConnect();
  await Otp.findOneAndUpdate(
    { mobile },
    {
      code,
      time: new Date(),
    },
    {
      upsert: true,
    }
  );
  return code;
};

const sendOTP = async ({ mobile }) => {
  const otp = await getOTP({ mobile });
  const body = ` Your Key for verification is: ${otp}. Please use it to verify your Merino Fabwood account. Thank you.`;
  await client.messages.create({
    from: process.env.ADMIN_SMS_MOBILE,
    to: "+91" + mobile,
    body,
  });
  await client.messages.create({
    from: `whatsapp:${process.env.ADMIN_WHATSAPP_MOBILE}`,
    to: `whatsapp:+91${mobile}`,
    body,
  });
};

const sendMessage = async ({ to, mediaUrl }) => {
  const res = await client.messages.create({
    from: `whatsapp:${process.env.ADMIN_WHATSAPP_MOBILE}`,
    body: 'Your entry pass for the launch of the "The Future of Furniture" by "Merino Laminates" is attached.',
    to: `whatsapp:+91${to}`,
    mediaUrl,
  });
  return res;
};

const sendEmail = ({ to, subject, body, attachments }) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.ADMIN_EMAIL,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  // Email details
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: to,
    subject: subject,
    html: body,
    attachments,
  };

  // Send email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error({ error });
        reject({
          success: false,
          message: "Error in sending email",
        });
      } else {
        resolve({
          success: true,
          message: info.response,
        });
      }
    });
  });
};

/**@param {FormData} formData */
export async function sendOTPToUser(prevState, formData) {
  const user = Object.fromEntries(formData);
  try {
    await dbConnect();
    // await User.create(user);

    const existingUser = await User.findOne({ mobile: user?.mobile });
    console.log(existingUser);
    if (existingUser.islogin == "true") {
      return {
        success: false,
        message: "user",
        user: existingUser,
      };
    } else if (existingUser) {
      await sendOTP({ mobile: user?.mobile });

      return {
        success: true,
        message: `OTP sent to your mobile number`,
        user: user,
      };
    }
    throw new Error("Please enter a register mobile number.");
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: error.toString(),
    };
  }
}

// /**@param {FormData} formData */
export async function updateUserDeatils(prevState, formData) {
  try {
    await dbConnect();
    const existingUser = await User.findOne({ mobile: formData.mobile });

    if (existingUser) {
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        formData,
        {
          new: true,
          runValidators: true, // Ensure validation rules are enforced
        }
      );
      if (updatedUser) {
        const data = {
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
        };

        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          message: "Failed to update user details",
        };
      }
    } else {
      return {
        success: false,
        message: "User not found",
      };
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

const uploadImageAndGetDataURL = async (imageBase64) => {
  try {
    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(imageBase64);

    // Return the data URL of the uploaded image
    return uploadedImage.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};

export async function updateUserDocuments(prevState, formData) {
  try {
    const user = Object.fromEntries(formData);

    await dbConnect();

    const existingUser = await User.findOne({ mobile: Number(user?.mobile) });

    if (existingUser) {
      const aadhaar_front_array_buffer = await user.aadhaar_front.arrayBuffer();
      const aadhaar_back_array_buffer = await user.aadhaar_back.arrayBuffer();

      const aadhaar_front_url = await uploadImageAndGetDataURL(
        `data:${user.aadhaar_front.type};base64,${Buffer.from(
          aadhaar_front_array_buffer
        ).toString("base64")}`
      );

      const aadhaar_back_url = await uploadImageAndGetDataURL(
        `data:${user.aadhaar_back.type};base64,${Buffer.from(
          aadhaar_back_array_buffer
        ).toString("base64")}`
      );

      user.aadhaar_front = aadhaar_front_url;
      user.aadhaar_back = aadhaar_back_url;

      const updatedUser = await User.findByIdAndUpdate(
        existingUser?._id,
        user,
        { new: true }
      );

      // Generate QR Code
      const qrCode = await QRCode.toDataURL(
        JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          id: updatedUser._id,
        })
      );
      const MediaUrl = await uploadImageAndGetDataURL(qrCode);
      updatedUser.qrCode = MediaUrl;
      updatedUser.islogin = "true";

      // Save updated user
      await updatedUser.save();

      // Send messages and emails
      // await sendMessage({
      //   mediaUrl: updatedUser.qrCode,
      //   to: updatedUser.mobile,
      // });

      if (updatedUser.email) {
        sendEmail({
          to: updatedUser.email,
          subject: "Event QR Code",
          attachments: [
            { filename: "event-pass.png", path: updatedUser.qrCode },
          ],
        });
      }

      // Return updated user data
      return { success: true, data: JSON.stringify(updatedUser) };
    } else {
      return { success: false, data: "User not found" };
    }
  } catch (error) {
    console.error("Error updating user documents:", error);
    return { success: false, data: error.message };
  }
}

export async function login(prevState, formData) {
  const user = Object.fromEntries(formData);
  try {
    await dbConnect();
    const existingUser = await User.findOne({ mobile: user?.mobile });
    console.log(existingUser);

    if (existingUser) {
      cookies().set("user", existingUser._id);
      // console.log('Existing: ', existingUser);
      return {
        success: true,
        data: existingUser,
      };
    }
    throw new Error("Please enter valid mobile");
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      data: error.message,
    };
  }
}

export const verifyUserOTP = async (user, otp) => {
  // console.log('got here', user);

  const checkAndCreateUser = async () => {
    try {
      const verification_check = await verifyOTP({
        mobile: user?.mobile,
        otpCode: otp,
      });
      if (verification_check) {
        // const qrCode = await QRCode.toDataURL(
        //   JSON.stringify({ name: user.name, email: user.email, id: user._id })
        // );
        // user.qrCode = qrCode;
        // user.role = '';
        // await dbConnect();
        // const created_user = await User.create(user);

        // const res = await sendMessage({
        //   mediaUrl: `${base_url}/api/qr/${created_user?._id}.png`,
        //   to: created_user.mobile
        // });
        // console.log({ res });

        // sendEmail({
        //   to: created_user?.email,
        //   subject: 'Event QR Code',
        //   attachments: [
        //     {
        //       filename: 'event-pass.png',
        //       path: user.qrCode
        //     }
        //   ]
        // });

        const existingUser = await User.findOne(
          { mobile: user?.mobile },
          "name email city mobile eventStartDate eventEndDate companyName role -_id"
        );
        if (existingUser) {
          return {
            success: true,
            data: existingUser,
          };
        }
      }
      throw new Error("Please enter valid otp");
    } catch (error) {
      console.log({ error });
      return {
        success: false,
        message: error.toString(),
      };
    }
  };
  // const { success, error } = await checkAndCreateUser();
  const { success, data } = await checkAndCreateUser();
  if (success) {
    const dummy = {
      success: true,
      message: "find",
      // verifyOTP: true,
      data: data._doc,
    };
    return dummy;
  }
};

export const logoutUser = () => {
  clearCookie();
  redirect("/login");
};

export const updateHotelAndEventCheckInStatus = async (prevData, data) => {
  try {
    const { user, type } = data;
    await dbConnect();
    const existingUser = await User.findOne({ email: user?.email });
    if (existingUser) {
      if (existingUser[type]) {
        return {
          success: false,
          message: "User already Checked-in",
          data: { name: existingUser.name },
        };
      }
      existingUser[type] = true;
      await existingUser.save();
      revalidatePath("/admin");
      return {
        success: true,
        message: "Successful",
        data: { name: existingUser.name },
      };
    }
    throw new Error("User not found. Please try again!");
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      message: error.toString(),
      data: {},
    };
  }
};

export const uploadFlightTicket = async (prevState, inputData) => {
  try {
    const data = Object.fromEntries(inputData);

    const { id, flightTicketToEvent, flightTicketToHome } = data;
    if (
      !flightTicketToEvent?.name ||
      !flightTicketToEvent?.size ||
      !flightTicketToHome?.name ||
      !flightTicketToHome?.size
    ) {
      throw new Error("Please select file!");
    }
    const flightTicketToEventBuffer = await flightTicketToEvent.arrayBuffer();
    const flightTicketToHomeBuffer = await flightTicketToHome.arrayBuffer();
    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Unable to fetch User. Please try again!");
    }
    user.flightTicketToEvent = `data:${
      flightTicketToEvent.type
    };base64,${Buffer.from(flightTicketToEventBuffer).toString("base64")}`;

    user.flightTicketToHome = `data:${
      flightTicketToHome.type
    };base64,${Buffer.from(flightTicketToHomeBuffer).toString("base64")}`;

    await user.save();
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: "Flight Tickets Booking Confirmation",
        body:`
        <p>Dear Sir/Madam,</p>
        <p>Your flight tickets have been successfully booked.</p>
        <p>Please login to our website to review your flights: <a href="https://merinofabwood.vercel.app/login">Review Flights</a></p>
        <p>Best Regards,<br/>Merino Team</p>`,
        // attachments: [
        //   { filename: "event-pass.png", path: user.qrCode },
        // ],
      });
    }
    revalidatePath("/admin");
    return {
      success: true,
      message: "Ticket uploaded successfully!",
    };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      message: error.toString(),
    };
  }
};

export const getUserById = async (prevState, id) => {
  try {
    await dbConnect();
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log({ error });
  }
};
