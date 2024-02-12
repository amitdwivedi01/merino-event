"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import { SlEvent } from "react-icons/sl";
import { BsQrCode } from "react-icons/bs";
import { IoTicketSharp } from "react-icons/io5";
import { GrContactInfo } from "react-icons/gr";
import { LuUserCircle2 } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { MdOutlineFlight } from "react-icons/md";
import { TbReorder } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { BiSolidOffer } from "react-icons/bi";
import { GrCatalog } from "react-icons/gr";
import merinoLogo from "../../../public/images/bg_image1.png";
import logoImg from "../../../public/images/Rev Home Page Bg (2).jpg";
import logo from "../../../public/images/merino-logo.png";
import { useRouter } from "next/navigation";
import { Popover } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { addFeedback, addOrder } from "../server";
import {
  Calendar,
  CarTaxiFront,
  Coffee,
  CookingPot,
  HandPlatter,
  Hotel,
  MapPin,
  PersonStanding,
  PlaneTakeoff,
  Rocket,
  Split,
  Sprout,
  Utensils,
} from "lucide-react";
import { getUserById } from "../server";
import { useFormState } from "react-dom";
import PDFViewer from "./PDFViewer";

let user;
if (typeof window !== "undefined") {
  user = localStorage.getItem("user");
  user = JSON.parse(user);
  console.log(user);
  try {
    let user = localStorage.getItem("user") || "";
    user = JSON.parse(user);
    // console.log(user);
  } catch (error) {
    console.log("error at user fetching from localstorage", error);
  }
}


const roleBaseTime = {
  oem: {
    day1: "Day 1, 12th Feb, 2024",
    day2: "Day 2, 13th Feb, 2024",
  },
  distributor: {
    day1: "Day 1, 14th Feb, 2024",
    day2: "Day 2, 15th Feb, 2024",
  },
  dealer: {
    day1: "Day 1, 16th Feb, 2024",
    day2: "Day 2, 17th Feb, 2024",
  },
};

const Itinerary = {
  day1: [
    {
      startTime: "12:00 PM",
      endTime: "05:00 PM",
      session: "Arrivals & Hotel Check-in",
      icon: Hotel,
    },
    {
      startTime: "07:00pm",
      endTime: "07:45pm",
      session: "High tea @ Ballroom",
      icon: Coffee,
    },
    {
      startTime: "07:45pm",
      endTime: "10:00pm",
      session: "FABWood Launch @ Ballroom",
      icon: Rocket,
    },
    {
      startTime: "10:00pm",
      endTime: "Onwards",
      session: "Dinner",
      icon: HandPlatter,
    },
  ],
  day2: [
    {
      startTime: "",
      endTime: "By 08:00 AM",
      session: "Room Check-out & Breakfast",
      icon: CookingPot,
    },
    {
      startTime: "",
      endTime: "By 08:45 AM",
      session: "Departure from Hyatt Place to Merino Halol Plant",
      icon: CarTaxiFront,
    },
    {
      startTime: "10:15 AM",
      endTime: "10:45 AM",
      session: "Welcome and High Tea @ Merino Halol Plant",
      icon: Split,
    },
    {
      startTime: "10:45 AM",
      endTime: "11:15 AM",
      session: "Plant Briefing Session",
      icon: Coffee,
    },
    {
      startTime: "11:15 AM",
      endTime: "12:30 PM",
      session: "Guided Plant Tour",
      icon: Sprout,
    },
    {
      startTime: "12:30 PM",
      endTime: "01:30 PM",
      session: "Lunch and sapling plantation",
      icon: PersonStanding,
    },
    {
      startTime: "1:30 PM",
      endTime: "2:30 PM",
      session: "Tour of eucalyptus farms",
      icon: Utensils,
    },
    {
      startTime: "2:30 PM",
      endTime: "Onwards",
      session: "Departure to airports",
      icon: PlaneTakeoff,
    },
  ],
};

const Modal = ({ isOpen, toggleModal, showModal }) => {
  const [userState, setUserState] = useState(user);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [images, setImages] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  // console.log(user?._id)
  const [state, formAction] = useFormState(getUserById);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleFileUpload = async (file, setImageUrl) => {
    // const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jksuem3q");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/depzzdss5/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleImageChange = (event) => {
    const { name } = event.target;
    const selectedImage = event.target.files[0]; // Assuming only one file is selected

    setImages((prevImages) => ({
      ...prevImages,
      [name]: selectedImage,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Your submission logic goes here
    setIsLoader(true);
    const formData = new FormData();
    // Append the rating, review, and other data to the FormData object
    formData.append("Rating", rating);
    formData.append("Review", review);
    if (images.image1) {
      const Image1Url = await handleFileUpload(images.image1);
      formData.append("image1", Image1Url);
    }
    if (images.image2) {
      const Image2Url = await handleFileUpload(images.image2);
      formData.append("image2", Image2Url);
    }
    if (images.image3) {
      const Image3Url = await handleFileUpload(images.image3);
      formData.append("image3", Image3Url);
    }

    formData.append("name", userState.name);
    formData.append("email", userState.email);
    formData.append("mobile", userState.mobile);
    formData.append("id", userState._id);

    const response = await addFeedback(formData);
    if (response?.success) {
      toast.success(
        "Thank you. Your Feedback have been successfully updated.",
        {
          duration: 4000,
        }
      );
      setIsLoader(false);
      setRating("");
      setReview("");
      setImages({
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
      });
    } else {
      toast.error("Please try again, some internal problem arises");
    }
  };

  //ordering
  const handleBoardSelect = (boardNumber) => {
    setSelectedBoard(boardNumber);
    setModalOpen(true);
  };

  const handleAgreeTerms = async() => {
    setAgreeTerms(true);
    const formData = new FormData();
    formData.append("Order", selectedBoard)
    formData.append("id", userState._id)
    const response = await addOrder(formData);
    if(response.success){
      toast.success(
        "Thank you. Your Order is Placed.",
        {
          duration: 4000,
        }
      );
    }else{
        toast.error("Please Try Again, Some error occurred!",
          {
            duration:4000,
          }
        );
      }
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBoard(null);
  };

  useEffect(() => {
    console.log({ id: user?._id });
    formAction(user?._id);
    // const response = await getUserById(user?._id);
    // console.log(response);
    // setUserState(response)
  }, []);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen w-screen bg-[#00000077] overflow-x-hidden overflow-y-auto outline-none transition ease-in-out">
          <div className="relative my-6">
            {/* Modal content */}
            <div className="relative top-4 flex flex-col h-full w-full bg-white border rounded-lg shadow-lg outline-none p-1 overflow-y-auto max-h-screen">
              {/* Close button */}
              <button
                onClick={toggleModal}
                className="absolute top-4 right-4 text-gray-700 cursor-pointer"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.364 5.636c-.78-.78-2.048-.78-2.828 0L12 9.172 8.464 5.636c-.78-.78-2.048-.78-2.828 0-.78.78-.78 2.048 0 2.828L9.172 12l-3.536 3.536c-.78.78-.78 2.048 0 2.828.78.78 2.048.78 2.828 0L12 14.828l3.536 3.536c.78.78 2.048.78 2.828 0 .78-.78.78-2.048 0-2.828L14.828 12l3.536-3.536c.78-.78.78-2.048 0-2.828z" />
                </svg>
              </button>
              <div className="p-4 container mx-auto">
                {showModal.Itinerary ? (
                  <>
                    <h2 className="my-2 text-3xl font-semibold">Itinerary</h2>
                    <div className="bg-hero-ply rounded-lg shadow-lg max-h-[70vh] w-[80vw] overflow-auto">
                      <div className="rounded-lg grid p-4 xl:p-10 gap-5 divide-y-2 lg:divide-x-2 lg:divide-y-0 lg:grid-cols-2">
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col xl:flex-row justify-center gap-1 items-center">
                            <Calendar size={30} />
                            <p>{userState?.eventStartDate}</p>
                          </div>
                          <div className="flex flex-col xl:flex-row justify-center gap-1 items-center">
                            <MapPin size={30} />
                            <p>Hyatt Place, Vadodara</p>
                          </div>
                          <div className="self-start">
                            <ul className="timeline max-w-md timeline-snap-icon max-md:timeline-compact timeline-vertical">
                              {Itinerary?.day1?.map((itinerary) => (
                                <>
                                  <li className="peer">
                                    <div className="timeline-middle bg-white rounded-full p-1">
                                      <itinerary.icon />
                                    </div>
                                    <div className="timeline-end timeline-box">
                                      <p className="flex gap-1 items-center">
                                        <span>{itinerary?.startTime}</span> -
                                        <span>{itinerary?.endTime}</span>
                                      </p>
                                      <span>{itinerary?.session}</span>
                                    </div>
                                    <hr className="bg-white peer-last:hidden" />
                                  </li>
                                </>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex flex-col gap-5 pt-5 lg:pt-0">
                          <div className="">
                            <div className="flex flex-col xl:flex-row gap-1 justify-center items-center">
                              <Calendar size={30} />
                              <p>{userState?.eventEndDate}</p>
                            </div>
                            <div className="flex flex-col xl:flex-row gap-1 justify-center items-center mt-4">
                              <MapPin size={30} />
                              <p>Hyatt Place, Vadodara</p>
                            </div>
                          </div>
                          <ul className="timeline max-w-md timeline-snap-icon max-md:timeline-compact timeline-vertical">
                            {Itinerary?.day2?.map((itinerary) => (
                              <li className="peer">
                                <div className="timeline-middle bg-white rounded-full p-1">
                                  <itinerary.icon />
                                </div>
                                <div className="timeline-end timeline-box">
                                  <p className="flex gap-1 items-center">
                                    <span>{itinerary?.startTime}</span> -
                                    <span>{itinerary?.endTime}</span>
                                  </p>
                                  <span>{itinerary?.session}</span>
                                </div>
                                <hr className="bg-white peer-last:hidden" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : showModal.QR_Code ? (
                  <>
                    <div className="container mx-auto mt-10 max-h-[70vh] w-[80vw] overflow-auto pb-5 flex flex-col justify-center items-center">
                      <h1 className="text-2xl text-center font-semibold">
                        Merino <span className="text-[#BF3131]">FAB</span>WOOD
                        Event Gatepass
                      </h1>
                      <img
                        src={userState?.qrCode}
                        alt="Your Image"
                        className="mx-auto mt-5 mb-5"
                      />
                      <p className="text-center">
                        Scan this QR Code for a seamless check-in experience at
                        the hotel.
                      </p>
                    </div>
                  </>
                ) : showModal.Flight_Ticket ? (
                  <>
                    <div className="container flex flex-col max-h-[70vh] w-[80vw] overflow-auto justify-center items-center mx-auto mt-10">
                      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        Flight Tickets
                      </h1>
                      {state?.flightTicketToHome ? (
                        <div className="grid gap-4">
                          <div className="flex gap-4 justify-end items-center">
                            <h1 className="text-xl font-bold text-center text-gray-900">
                              Flight To Event
                            </h1>
                            <a
                              href={state?.flightTicketToEvent}
                              download="your-pdf-file.pdf"
                              className="bg-[#BF3131] py-4 px-3 shadow-xl rounded-md text-white font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
                            >
                              Download Ticket
                            </a>
                          </div>
                          <div className="flex gap-4 justify-end items-center">
                            <h1 className="text-xl font-bold text-center text-gray-900">
                              Flight To Home
                            </h1>
                            <a
                              href={state?.flightTicketToHome}
                              download="your-pdf-file.pdf"
                              className="bg-[#BF3131] py-4 px-3 shadow-xl rounded-md text-white font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
                            >
                              Download Ticket
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg text-gray-700 mb-8 max-w-md text-center">
                          Your flight booking is currently in progress. We will
                          notify you once the tickets are successfully booked.
                          Thank you for your patience.
                        </p>
                      )}
                    </div>
                  </>
                ) : showModal.Help_Desk ? (
                  <>
                    <div className="container mx-auto max-h-[70vh] w-[80vw] overflow-auto py-6">
                      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        Contact Us
                      </h1>
                      <h1 className="text-xl font-bold text-center text-gray-600 mb-4">
                        Contact Time : 10AM - 6PM
                      </h1>

                      <div className="flex flex-col items-center justify-center mb-4 space-y-4">
                        <a
                          href="tel:+919625567552"
                          className="bg-[#BF3131] p-3 shadow-xl rounded-lg text-white flex items-center justify-center space-x-2 text-lg font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
                        >
                          <FiPhone className="w-8 h-8 mr-2" />
                          <p className="text-lg">+91 9625567552</p>
                        </a>
                        <a
                          href="mailto:merinofabwood@gmail.com"
                          className="bg-[#BF3131] p-3 shadow-xl rounded-lg text-white flex items-center justify-center space-x-2 text-lg font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
                        >
                          <FiMail className="w-8 h-8 mr-2" />
                          <p className="text-lg">merinofabwood@gmail.com</p>
                        </a>
                      </div>
                    </div>
                  </>
                ) : showModal.Offers ? (
                  <div className="flex justify-center">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-xs">
                      <h2 className="text-3xl font-bold mb-8 text-center">
                        Special Offers
                      </h2>
                      <Image src={logo} alt="Offer" className="mx-auto mb-4" />
                    </div>
                  </div>
                ) : showModal.feedback ? (
                  <>
                    <div className="container mx-auto">
                      <div className="max-w-lg mx-auto">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                          <h2 className="text-3xl font-bold mb-4 text-center">
                            Event Feedback Form
                          </h2>
                          <div className="mb-4">
                            <label className="block text-xl text-gray-700 font-bold mb-2">
                              Overall Experience:
                            </label>
                            <div>
                              <label className="inline-flex items-center mr-4">
                                <input
                                  type="radio"
                                  value="Poor"
                                  checked={rating === "Poor"}
                                  onChange={handleRatingChange}
                                  className="form-radio text-red-500"
                                />
                                <span className="ml-2 text-lg">Poor</span>
                              </label>
                              <label className="inline-flex items-center mr-4">
                                <input
                                  type="radio"
                                  value="Good"
                                  checked={rating === "Good"}
                                  onChange={handleRatingChange}
                                  className="form-radio text-red-500"
                                />
                                <span className="ml-2 text-lg">Good</span>
                              </label>
                              <label className="inline-flex items-center mr-4">
                                <input
                                  type="radio"
                                  value="Very Good"
                                  checked={rating === "Very Good"}
                                  onChange={handleRatingChange}
                                  className="form-radio text-red-500"
                                />
                                <span className="ml-2 text-lg">Very Good</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  value="Excellent"
                                  checked={rating === "Excellent"}
                                  onChange={handleRatingChange}
                                  className="form-radio text-red-500"
                                />
                                <span className="ml-2 text-lg">Excellent</span>
                              </label>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="review"
                              className="block text-gray-700 font-bold text-xl mb-2"
                            >
                              Review:
                            </label>
                            <textarea
                              id="review"
                              value={review}
                              onChange={handleReviewChange}
                              className="resize-none block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              rows="5"
                            ></textarea>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="images"
                              className="block text-gray-700 text-xl font-bold mb-2"
                            >
                              Upload Images:
                            </label>
                            <div className="flex">
                              <input
                                type="file"
                                id="images"
                                accept="image/*"
                                name="image1"
                                onChange={handleImageChange}
                                className="block w-full"
                              />
                            </div>
                            <div className="flex flex-wrap -mx-2">
                              <div className="w-1/3 px-2 mb-4">
                                {/* {
                                      images.image1 ?
                                      <img
                                        src={images?.image1}
                                        alt={`Preview `}
                                        className="w-full h-auto rounded-lg shadow-md"
                                      /> : ''
                                    } */}
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex">
                              <input
                                type="file"
                                id="images"
                                accept="image/*"
                                name="image2"
                                onChange={handleImageChange}
                                className="block w-full"
                              />
                            </div>
                            <div className="flex flex-wrap -mx-2">
                              <div className="w-1/3 px-2 mb-4">
                                {/* {
                                      images.image2 ?
                                      <img
                                        src={images?.image2}
                                        alt={`Preview `}
                                        className="w-full h-auto rounded-lg shadow-md"
                                      /> : ''
                                    } */}
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex">
                              <input
                                type="file"
                                id="images"
                                accept="image/*"
                                name="image3"
                                onChange={handleImageChange}
                                className="block w-full"
                              />
                            </div>
                            <div className="flex flex-wrap -mx-2">
                              <div className="w-1/3 px-2 mb-4">
                                {/* {
                                      images.image3 ?
                                      <img
                                        src={images?.image3}
                                        alt={`Preview `}
                                        className="w-full h-auto rounded-lg shadow-md"
                                      /> : ''
                                    } */}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleSubmit}
                            disabled={isLoader}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline mt-6"
                            style={{ backgroundColor: "#BF3131" }}
                          >
                            {isLoader && (
                              <span className="loading loading-spinner loading-md text-center"></span>
                            )}
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : showModal.Place_Order ? (
                  <>
                    <div className="container mx-auto mt-10">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center">
                          <h2 className="text-3xl font-bold mb-4">Slabs</h2>
                          {[1, 2, 3, 4, 5].map((slabNumber) => (
                            <div
                              key={`slab-${slabNumber}`}
                              className="flex items-center mb-2"
                            >
                              <span className="mr-2">Slab {slabNumber}</span>                              
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col items-center">
                          <h2 className="text-3xl font-bold mb-4">Boards</h2>
                          <span className="mr-2 mb-2">500</span>
                          <span className="mr-2 mb-2">1100</span>
                          <span className="mr-2 mb-2">2100</span>
                          <span className="mr-2 mb-2">5100</span>
                          <span className="mr-2">11000</span>
                        </div>
                        <div className="flex flex-col items-center mt-[3rem]">                          
                          {[1, 2, 3, 4, 5].map((boardNumber) => (
                            <div
                              key={`board-${boardNumber}`}
                              className="flex items-center mb-2"
                            >
                              <span className="mr-2 mb-[1px]">Board {boardNumber}</span>
                              <input
                                type="radio"
                                id={`board-${boardNumber}`}
                                name="selectedBoard"
                                checked={selectedBoard === boardNumber}
                                onChange={() => handleBoardSelect(boardNumber)}
                                className="form-radio text-red-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {modalOpen && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                          <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4">
                              Terms and Conditions
                            </h2>
                            <p className="mb-4">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit.
                            </p>
                            <label className="inline-flex items-center mb-4">
                              <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={() => setAgreeTerms(!agreeTerms)}
                                className="form-checkbox text-red-500"
                              />
                              <span className="ml-2">
                                I agree to the terms and conditions
                              </span>
                            </label>
                            <div className="flex justify-between">
                              <button
                                onClick={handleAgreeTerms}
                                disabled={!agreeTerms}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                              >
                                I Agree
                              </button>
                              <button
                                onClick={handleCloseModal}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Home = () => {
  const Router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [userData, setUserData] = useState(user);
  const [isAfterFeb13, setIsAfterFeb13] = useState(false)
  const [showModal, setShowModal] = useState({
    Itinerary: false,
    QR_Code: false,
    Flight_Ticket: false,
    Help_Desk: false,
    E_catalogue: false,
    Place_Order: false,
    Offers: false,
    feedback: false,
  });

  useEffect(()=>{
    const currentDate = new Date();
    
    // Extract the day and month from the current date
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1 to get the actual month
    
    // Check if the current date is 13th of February or later
    const date = currentMonth === 2 && currentDay >= +userData?.eventStartDate.slice(0,2);
    if(date){
      setIsAfterFeb13(true)
    }
  },[])

  const modalhandler = (item) => {
    setisOpen(true);
    setShowModal((prevState) => {
      const newShowModalState = Object.fromEntries(
        Object.keys(prevState).map((key) => [key, false])
      );
      newShowModalState[item] = true;
      return newShowModalState;
    });
  };

  const logoutHandler = () => {
    localStorage.clear();
    Router.push("/login");
  };

  // useEffect(() => {
  //   let userID = localStorage.getItem('user');
  //   userID = JSON.parse(userID);
  //   if (!userID?._id) {
  //     Router.push('/login');
  //   }
  // }, []);
  const toggleModal = () => {
    setisOpen(false);
  };

  return (
    <div className="relative h-screen overflow-hidden w-screen bg-gray-100">
      <Modal isOpen={isOpen} toggleModal={toggleModal} showModal={showModal} />
      <div className="flex justify-end absolute items-center w-full p-2">
        {/* <Image src={merinoLogo} height={55} /> */}
        <Popover className="">
          <Popover.Button className=" text-white bg-[#BF3131] rounded-full border-none outline-none">
            <FaUserCircle className="text-[40px]" />
          </Popover.Button>

          <Popover.Panel className="border absolute z-10 mt-1 bg-white w-[90vw] max-w-[400px] right-2 p-3 rounded-lg shadow-lg">
            <div>
              <div class="flex flex-col items-center py-5 shadow mb-3 bg-gray-100 rounded-lg">
                <div className="flex gap-2 justify-center items-center">
                  <LuUserCircle2 className="text-[35px] text-gray-700" />
                  <h1 className="text-xl">Profile Details</h1>
                </div>
                <h5 class="mb-1 text-xl font-medium text-gray-900">
                  {user?.name}
                </h5>
                <span class="text-sm text-gray-500">{user?.email}</span>
                <span class="text-sm text-gray-500">{user?.mobile}</span>
              </div>
              <button
                className="w-full bg-[#BF3131] p-3 shadow-xl rounded-lg text-white flex items-center justify-center space-x-2 text-md font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
                onClick={() => logoutHandler()}
              >
                Logout
              </button>
            </div>
          </Popover.Panel>
        </Popover>
      </div>

      <div className="h-[100vh]">
        <Image src={logoImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-[50px]">
        <div className="flex w-screen justify-between px-3 mt-2">
          <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("Itinerary")}
          >
            <SlEvent className="text-3xl" />
            Itinerary
          </button>
          <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("QR_Code")}
          >
            <BsQrCode className="text-3xl" />
            Qr Code
          </button>
          <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("Flight_Ticket")}
          >
            <MdOutlineFlight className="text-3xl" />
            Tickets
          </button>
        </div>
        <div className="flex w-screen gap-[1.5rem] p-3 mt-2">
          {
            isAfterFeb13 ? 
          <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("feedback")}
          >
            <VscFeedback className="text-[2.5rem]" />
            Feedback
          </button> : ('')
          }
          <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("Help_Desk")}
          >
            <BiSupport className="text-3xl" />
            Help Desk
          </button>
          {
            isAfterFeb13 ?
          <a
            href={"/Brochure.pdf"}
            download="your-pdf-file.pdf"
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
          >
            <GrCatalog className="text-3xl" />
            E-catalog
          </a> : ( '')
          }
        </div>
        {/* <div className="flex w-screen justify-between px-3 mt-2">
        <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("Offers")}
          >
            <BiSolidOffer className="text-[2.5rem]" />
            Offers
          </button>
          <button
            className="w-[30%] max-w-[120px] bg-white py-4 px-3 shadow-xl rounded-md text-[#BF3131] flex flex-col gap-4 items-center justify-center font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler("Place_Order")}
          >
            <TbReorder className="text-[2.5rem]" />
            Ordering
          </button>
          
        </div> */}
      </div>
    </div>
  );
};

export default Home;
