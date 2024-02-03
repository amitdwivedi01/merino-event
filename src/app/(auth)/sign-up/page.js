'use client';

import { useRef, useState, useEffect } from 'react';
import { sendOTPToUser, verifyUserOTP, updateUserDeatils } from '../../server';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from "next/navigation";
// import OtpInput from 'react-otp-input';
import Image from 'next/image';
// import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SignUp() {
  
  // const [state, formAction] = useFormState(updateUserDeatils);
  // // const [otp, setOtp] = useState('');
  // // const mobileRef = useRef(null);
  // const searchParam = useSearchParams();
  // const role = searchParam.get('role');
  // useEffect(() => {
  //   // Retrieve data from localStorage
  //   const userData = localStorage.getItem('user');
  //   if (userData) {
  //     // Parse the JSON string and update the state with the retrieved data
  //     const userDataObj = JSON.parse(userData);
  //     formAction(userDataObj);
  //   }
  // }, []);

  const [userDataObj, setUserDataObj] = useState(null); // Initialize state to hold user data
  const [state, formAction] = useFormState(updateUserDeatils); // Update function for form action
  const [formData, setFormData] = useState({});
  const Router = useRouter();

  // const searchParam = useSearchParams();
  // const role = searchParam.get('role');
  useEffect(() => {
    let userID = localStorage.getItem('user');
    userID = JSON.parse(userID);
    if(userID?._id){
      Router.push('/')
    }
    else if(!userID?.message) {
      Router.push('/login')
    }
  },[]);

  useEffect(() => {
    // Retrieve data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      // Parse the JSON string and update the state with the retrieved data
      const parsedUserData = JSON.parse(userData);
      setUserDataObj(parsedUserData.data);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call updateUserDetails with the previous state and the updated form data
    console.log(userDataObj,"formData")
    const response = await updateUserDeatils(state, userDataObj);
    if(response?.success){
      localStorage.setItem('user', JSON.stringify(response?.data));
      Router.push('/upload')
    }
  };

  // Function to handle changes in form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDataObj({ ...userDataObj, [name]: value });
  };

  if (state?.success) {
    // localStorage.setItem('user', JSON.stringify(state?.data));
    console.log(state?.data)
    Router.push('/');
  }
  return (
    <div className="max-w-sm mx-auto p-4">
      {state?.success && (
        <div role="alert" className="alert alert-success mb-2">
          <span>{state?.message}</span>
        </div>
      )}
      {!state?.success && state?.message && (
        <div role="alert" className="alert alert-error mb-2">
          <ErrorIcon />
          <span>{state?.message}</span>
        </div>
      )}
      <article className="card bg-white shadow-lg border border-gray-200 rounded-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="relative w-full max-w-sm mx-auto h-[60px] mb-6">
              <Image fill src="/images/future-furniture-logo.png" />
            </div>
            <div className={state?.success && 'hidden'}>
              <header className="card-title">Register</header>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Name <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name || userDataObj?.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={`input input-bordered w-full`}
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Email <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  value={userDataObj?.email}
                  placeholder="Enter your email"
                  className={`input input-bordered w-full`}
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Company Name <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="text"
                  required
                  name="companyName"
                  value={userDataObj?.companyName}
                  placeholder="Enter your company Name"
                  className={`input input-bordered w-full`}
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Mobile <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  // ref={mobileRef}
                  name="mobile"
                  value={userDataObj?.mobile}
                  // pattern="[0,9]{10}"
                  placeholder="Enter your mobile number"
                  className={`input input-bordered w-full`}
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Email <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="email"
                  required
                  // ref={mobileRef}
                  name="email"
                  value={userDataObj?.email}
                  // pattern="[0,9]{10}"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full`}
                />
              </label>
              {/* <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Aadhaar Front Image <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="file"
                  name="aadhaar_front"
                  required
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Aadhaar Back Image <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="file"
                  name="aadhaar_back"
                  required
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label> */}
              {/* <footer className="card-actions mt-4">
                <SendOTPButton />
              </footer> */}
            </div>
            {/* <div className={` ${state?.success ? "block" : "hidden"}`}>
              <div className="flex items-center justify-center flex-col gap-10 rounded-lg">
                <h1 className="text-2xl font-medium">
                  Enter Verification Code
                </h1>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  shouldAutoFocus={state?.success}
                  inputStyle={{
                    height: "3rem",
                    width: "3rem",
                    margin: "0 1rem",
                    fontSize: "2rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(0,0,0)",
                  }}
                  renderInput={(props) => <input {...props} />}
                />
                <VerifyOTPButton
                  onClick={async () =>
                    await verifyUserOTP(state?.user, role, otp)
                  }
                />
              </div>
            </div> */}
            <SubmitButton />
          </form>
        </div>
        {/* <div className="grid place-items-center mb-2">
          Already have account?
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </div> */}
      </article>
    </div>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="btn mt-3 btn-primary w-full"
    >
      {pending && <span className="loading loading-spinner loading-md"></span>}
      Confirm Details
    </button>
  );
};

// const SendOTPButton = () => {
//   const { pending } = useFormStatus();
//   return (
//     <button disabled={pending} type="submit" className="btn btn-primary w-full">
//       {pending && <span className="loading loading-spinner loading-md"></span>}
//       Confirm Details
//     </button>
//   );
// };

// const VerifyOTPButton = ({ onClick }) => {
//   const [pending, setPending] = useState(false);

//   const handleClick = async () => {
//     setPending(true);
//     await onClick();
//     setPending(false);
//   };
//   return (
//     <button
//       disabled={pending}
//       type="button"
//       className="btn btn-primary w-full"
//       onClick={handleClick}
//     >
//       {pending && <span className="loading loading-spinner loading-md"></span>}
//       Submit
//     </button>
//   );
// };

// const ErrorIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="stroke-current shrink-0 h-6 w-6"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
//     />
//   </svg>
// );
