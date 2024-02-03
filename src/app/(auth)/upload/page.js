'use client';
import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { updateUserDocuments } from '../../server'; // Make sure to import the updateUserDocument function

export default function SignUp() {
  const Router = useRouter();
  //   const userDataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
  const [state, formAction] = useFormState(updateUserDocuments);
  const [userDataObj, setUserDataObj] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      // Parse the JSON string and update the state with the retrieved data
      const parsedUserData = JSON.parse(userData);
      setUserDataObj(parsedUserData);
    }
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      formData.append('userDataFromLocalStorage', JSON.stringify(userDataObj));
      formAction(formData);
      if (state?.success) {
        localStorage.setItem('user', state?.data);
        toast.success(
          'Thank you. Your details have been successfully updated. A QR code has been sent to your mobile and email for a seamless hotel check in experience',
          { duration: 4000 }
        );
        Router.push('/');
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error updating user documents:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div role="alert" className="alert alert-success mb-2">
        <span>
          Please provide a valid ID, as it will be used for ticketing and hotel
          check-in
        </span>
      </div>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-bold text-center text-red-400">
          Upload Valid Document Id
        </h2>
        <h2 className="text-lg font-bold mb-6 text-center">
          (aadhar, passport, voterid, driving license)
        </h2>

        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              htmlFor="aadhaar_front"
              className="block text-lg font-semibold mb-2"
            >
              Upload Front of Document ID
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
              Upload Back of Document ID
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
          <button
            type="submit"
            className="btn outline-none w-full bg-[#BF3131] text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
