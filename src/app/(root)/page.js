'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';
// import fabwoodBookletFolder from "../../public/images/FABWood-Booklet-Folder-ctc.jpg";
// import fabwoodBookletFolder from "../../public/images/FABWood-Booklet-Folder-ctc.png";
import merinoLogo from '../../../public/images/merino-logo.png';
// import futureFurnitureLogo from '../../../public/images/future-furniture-white.png';
import logoImg from '../../../public/images/background.jpg';
import ROLE from '@/config/ROLE';
import { useRouter } from "next/navigation";
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
  Utensils
} from 'lucide-react';


let user = localStorage.getItem('user')
user = JSON.parse(user)
console.log(user)

const roleBaseTime = {
  oem: {
    day1: 'Day 1, 12th Feb, 2024',
    day2: 'Day 2, 13th Feb, 2024'
  },
  distributor: {
    day1: 'Day 1, 14th Feb, 2024',
    day2: 'Day 2, 15th Feb, 2024'
  },
  dealer: {
    day1: 'Day 1, 16th Feb, 2024',
    day2: 'Day 2, 17th Feb, 2024'
  }
};

const itineraries = {
  day1: [
    {
      startTime: '12noon',
      endTime: '5:0pm',
      session: 'Arrivals & Hotel Check-in',
      icon: Hotel
    },
    {
      startTime: '7:00pm',
      endTime: '7:45pm',
      session: 'High tea @ Ballroom',
      icon: Coffee
    },
    {
      startTime: '7:45pm',
      endTime: '10:00pm',
      session: 'FABWood Launch @ Ballroom',
      icon: Rocket
    },
    {
      startTime: '10:00pm',
      endTime: 'onwards',
      session: 'Dinner',
      icon: HandPlatter
    }
  ],
  day2: [
    {
      startTime: '',
      endTime: 'By 9:15 AM',
      session: 'Room Check-out & Breakfast',
      icon: CookingPot
    },
    {
      startTime: '',
      endTime: 'By 9:30 AM',
      session: 'Departure from Hyatt Place to Merino Halol Plant',
      icon: CarTaxiFront
    },
    {
      startTime: '11:00 AM',
      endTime: '11:30 AM',
      session: 'Plantation Tour',
      icon: Split
    },
    {
      startTime: '11:30 AM',
      endTime: '12:00 PM',
      session: 'Welcome and High Tea',
      icon: Coffee
    },
    {
      startTime: '12:00 PM',
      endTime: '12:30 PM',
      session: 'Plant Briefing Session',
      icon: Sprout
    },
    {
      startTime: '12:30 PM',
      endTime: '02:00 PM',
      session: 'Guided Plant Tour',
      icon: PersonStanding
    },
    {
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      session: 'Lunch',
      icon: Utensils
    },
    {
      startTime: '03:30 PM',
      endTime: 'onward',
      session: 'Departure to airports',
      icon: PlaneTakeoff
    }
  ]
};

const Modal = ({ isOpen, toggleModal, showModal }) => {
  return (
    <>
    {isOpen &&
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-x-hidden overflow-y-auto outline-none ">
        <div className="relative my-6">
          {/* Modal content */}
          <div className="relative top-4 flex flex-col h-full w-full bg-white border rounded-lg shadow-lg outline-none p-1 overflow-y-auto max-h-screen">
            {/* Close button */}
            <button onClick={toggleModal} className="absolute top-4 right-4 text-gray-700 cursor-pointer">
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.364 5.636c-.78-.78-2.048-.78-2.828 0L12 9.172 8.464 5.636c-.78-.78-2.048-.78-2.828 0-.78.78-.78 2.048 0 2.828L9.172 12l-3.536 3.536c-.78.78-.78 2.048 0 2.828.78.78 2.048.78 2.828 0L12 14.828l3.536 3.536c.78.78 2.048.78 2.828 0 .78-.78.78-2.048 0-2.828L14.828 12l3.536-3.536c.78-.78.78-2.048 0-2.828z"/>
              </svg>
            </button>
            <div className="p-4 container mx-auto">
              {
                showModal.Event_Info ? 
                <>               
                <h2 className="my-2 text-2xl font-semibold uppercase">Itineraries</h2>
                <div className="bg-hero-ply rounded-lg shadow-lg">
                  <div className="rounded-lg grid p-4 xl:p-10 gap-5 divide-y-2 lg:divide-x-2 lg:divide-y-0 lg:grid-cols-2">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col xl:flex-row justify-center gap-1 items-center">
                        <Calendar size={30} />
                        <p>{user.eventStartDate}</p>
                      </div>
                      <div className="flex flex-col xl:flex-row justify-center gap-1 items-center">
                        <MapPin size={30} />
                        <p>Hyatt Place, Vadodara</p>
                      </div>
                      <div className="self-start">
                        <ul className="timeline max-w-md timeline-snap-icon max-md:timeline-compact timeline-vertical">
                          {itineraries?.day1?.map((itinerary) => (
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
                          <p>{user.eventEndDate}</p>
                        </div>
                        <div className="flex flex-col xl:flex-row gap-1 justify-center items-center mt-4">
                          <MapPin size={30} />
                          <p>Hyatt Place, Vadodara</p>
                        </div>
                      </div>
                      <ul className="timeline max-w-md timeline-snap-icon max-md:timeline-compact timeline-vertical">
                        {itineraries?.day2?.map((itinerary) => (
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

                : showModal.My_Qr_Code ? 
                <>
                  <div className="container mx-auto mt-10">
                    <img src={user.qrCode} alt="Your Image" className="mx-auto mt-5 mb-5" />
                  </div>
                </>
                : showModal.My_Ticket ? 
                <>
                    <div className="container flex flex-col justify-center items-center mx-auto mt-10">
                      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Flight Tickets</h1>
                      <p className="text-lg text-gray-700 mb-8 max-w-md text-center">
                        Your flight ticket booking is in progress. You will be notified as soon as it's done.
                      </p>
                      {/* You can add additional elements or design components here */}
                    </div>
                </>
                
                : showModal.Help_Desk ? 
                  <>
                    <div className="container mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
                      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Contact Us</h1>
                      <div className="flex items-center justify-center mb-4">
                        <FiPhone className="w-8 h-8 mr-2 text-gray-600" />
                        <p className="text-lg text-gray-700">123-456-7890</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <FiMail className="w-8 h-8 mr-2 text-gray-600" />
                        <p className="text-lg text-gray-700">example@example.com</p>
                      </div>
                    </div>
                  </>
                :'' 
              }
              </div>
            {/* Image */}
            {/* <img src={imageUrl} alt="Modal" className="w-full h-auto max-h-screen" /> */}

          </div>
        </div>
        {/* Overlay */}
        {/* <div onClick={toggleModal} className="fixed inset-0 bg-gray-800 opacity-50"></div> */}
      </div>
    }
  </>
  );
};

const buttons = [
  'Event_Info',
  'My_Qr_Code',
  'My_Ticket',
  'Help_Desk',
  // 'Feedback',
  // 'Order Booking',
  // 'Offers'
];


const Home = () => {
  const Router = useRouter();
  const [openModal, setOpenModal] =useState(false)
  const [isOpen, setisOpen] = useState(false)
  const [showModal, setShowModal] = useState({
    Event_Info: false,
    My_Qr_Code: false,
    My_Ticket: false,
    Help_Desk: false,
    E_catalogue: false
  });

  const modalhandler = (item) => {
    setisOpen(true)
    setShowModal((prevState) => {
      const newShowModalState = Object.fromEntries(
        Object.keys(prevState).map((key) => [key, false])
      );
      newShowModalState[item] = true;
      
      console.log(newShowModalState);
      return newShowModalState;
    });
  };

  useEffect(() => {
    let userID = localStorage.getItem('user');
    userID = JSON.parse(userID);
    if(!userID?._id){
      Router.push('/login')
    }
  },[]);
  const toggleModal=()=>{
    setisOpen(false)
  }

  return (
    <div className="">
      <Modal isOpen={isOpen} toggleModal={toggleModal} showModal={showModal}/>
      <div className='h-[65vh] w-screen'>
        <Image src={logoImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-4 flex-wrap mt-2 p-2">
        {buttons.map((item, index) => (
          <button
            className="w-[30%]  bg-[#BF3131] p-3 shadow-xl rounded-lg text-white flex items-center justify-center space-x-2 text-lg font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
            onClick={() => modalhandler(item)}
            key={index}
          >
            <span>{item.split('_').join(' ')}</span>
          </button>
        ))}
        <a
          href={'/Brochure.pdf'}
          download="your-pdf-file.pdf"
          className="w-[30%] bg-[#BF3131] p-3 shadow-xl rounded-lg text-white flex items-center justify-center space-x-2 text-lg font-semibold hover:bg-red-400 hover:text-white transition duration-300 ease-in-out"
        >
          E-catlog
        </a>
      </div>
      {/* <dialog className="modal">
        <div className="modal-box max-w-screen-2xl max-h-screen  h-[90%]">
          <form method="dialog">
            <button className="btn btn-sm xl:text-xl xl:btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>{' '}
          </form>

          <h3 className="font-bold text-lg">Brochure</h3>
          <iframe src="/Brochure.pdf" className="w-full h-[90%] mt-2" />
        </div>
      </dialog> */}
      {/* <div className="h-full md:h-[500px] bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col justify-center items-center">
        <Image src={merinoLogo} alt="" width={150} height={150} />
        <p className="my-4">Welcomes</p>
        <Image src={futureFurnitureLogo} alt="" width={400} height={400} />
      </div> */}
      {/* <div className="relative h-[50vh] max-h-[800px] bg-cover bg-center bg-hero-home">
        <div className="flex items-center justify-center h-full backdrop-brightness-50 backdrop-contrast-100">
          <div className="flex items-center justify-center flex-col  text-white">
            <Image
              src={merinoLogo}
              alt=""
              width={200}
              height={200}
              className="card-c p-4"
            />
            <p className="text-2xl font-semibold my-5">WELCOME</p>
            <Image src={futureFurnitureLogo} alt="" width={500} height={500} />
            <button></button>
          </div>
        </div>
      </div> */}

      {/* ---------------Commented By Jagdish */}
      {/* <div className="p-4 container mx-auto">
        <h2 className="my-2 text-2xl font-semibold uppercase">Flight Ticket</h2>
        <div className="card bg-white py-10 px-4 shadow-md">
          <p>
            Your flight ticket booking is in-progress. You will be notified as
            soon as it's done.
          </p>
        </div>
      </div> */}

      {/* -----------------Commented By Jagdish */}
      {/* <div className="p-4 container mx-auto">
        <h2 className="my-2 text-2xl font-semibold uppercase">Itineraries</h2>
        <div className="bg-hero-ply rounded-lg shadow-lg">
          <div className="backdrop-blur-sm rounded-lg grid p-4 xl:p-10 gap-5 divide-y-2 lg:divide-x-2 lg:divide-y-0 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col xl:flex-row justify-center gap-1 items-center">
                <Calendar size={30} />
                <p>{roleBaseTime[user?.role]?.day1}</p>
              </div>
              <div className="flex flex-col xl:flex-row justify-center gap-1 items-center">
                <MapPin size={30} />
                <p>Hyatt Place, Vadodara</p>
              </div>
              <div className="self-start">
                <ul className="timeline max-w-md timeline-snap-icon max-md:timeline-compact timeline-vertical">
                  {itineraries?.day1?.map((itinerary) => (
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
                  <p>{roleBaseTime[user?.role]?.day2}</p>
                </div>
                <div className="flex flex-col xl:flex-row gap-1 justify-center items-center mt-4">
                  <MapPin size={30} />
                  <p>Hyatt Place, Vadodara</p>
                </div>
              </div>
              <ul className="timeline max-w-md timeline-snap-icon max-md:timeline-compact timeline-vertical">
                {itineraries?.day2?.map((itinerary) => (
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
      </div> */}
    </div>
  );
};

export default Home;
