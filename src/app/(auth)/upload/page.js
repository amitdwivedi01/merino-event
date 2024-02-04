'use client';
import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { updateUserDocuments } from '../../server'; // Make sure to import the updateUserDocument function

export default function SignUp() {
  const Router = useRouter();
  const [userDataObj, setUserDataObj] = useState(null);
  const [state, formAction] = useFormState(updateUserDocuments, {});
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      // Parse the JSON string and update the state with the retrieved data
      const parsedUserData = JSON.parse(userData);
      setUserDataObj(parsedUserData);
    }
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast.success('Thank you. Your details have been successfully updated. A QR code has been sent to your mobile and email for a seamless hotel check-in experience', {
        duration: 4000,
        style: {
          // Adjust the styles to center the toast message
          borderRadius: '14px',
          background: '#ccc',
          color: '#000',
          padding: '16px',
        },
      });
      localStorage.setItem('user', state?.data);
      setIsLoader(false);
      Router.push('/');
    }
  }, [state]);

  const submitHandler = async (event) => {
    setIsLoader(true);
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      formData.append('mobile', userDataObj.mobile);
      formAction(formData);
    } catch (error) {
      console.error('Error updating user documents:', error);
    }
  };

  return (
    <div className="container relative mx-auto p-8">
      {/* {isLoader && <></>} */}
      <div role="alert" className="alert alert-success mb-2">
        <span>
          Please provide a valid ID, as it will be used for ticketing and hotel
          check-in
        </span>
      </div>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-bold text-center text-red-400">
          Upload Valid Photo Id
        </h2>
        <h2 className="text-lg font-bold mb-6 text-center">
          (Aadhar / Passport / VoterId / Driving License)
        </h2>

        <form onSubmit={submitHandler} /*action={formAction}*/>
          <div className="mb-6">
            <label
              htmlFor="aadhaar_front"
              className="block text-lg font-semibold mb-2"
            >
              Upload Front of Photo ID
            </label>
            <input
              type="file"
              id="aadhaar_front"
              name="aadhaar_front"
              className="block w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="aadhaar_back"
              className="block text-lg font-semibold mb-2"
            >
              Upload Back of Photo ID
            </label>
            <input
              type="file"
              id="aadhaar_back"
              name="aadhaar_back"
              className="block w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="tshirtSize"
              className="block text-lg font-semibold mb-2"
            >
              Select T-shirt Size
            </label>
            <select
              id="tshirtSize"
              name="tshirtSize"
              className="py-2 px-4 text-md border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option className="text-sm" value="">
                Select Size
              </option>
              <option className="text-sm" value="S">
                S - 36 cm
              </option>
              <option className="text-sm" value="M">
                M - 38 cm
              </option>
              <option className="text-sm" value="L">
                L - 40 cm
              </option>
              <option className="text-sm" value="XL">
                XL - 42 cm
              </option>
              <option className="text-sm" value="XXL">
                XXL - 44 cm
              </option>
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="meal"
              className="block text-lg font-semibold mb-2"
            >
              In-Flight Meal Preference
            </label>
            <select
              id="meal"
              name="meal"
              className="py-2 px-4 text-md border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option className="text-sm" value="">
                Select Meal
              </option>
              <option className="text-sm" value="vegetarian">
              Vegetarian
              </option>
              <option className="text-sm" value="non-vegetarian">
              Non-Vegetarian
              </option>
            </select>
          </div>
          <button
            disabled={isLoader}
            type="submit"
            className="btn outline-none w-full bg-[#BF3131] text-white"
          >
            {isLoader && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
