// pages/SignUp.js
'use client';

import { useState, useEffect, } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateUserDocuments } from '../../server'; // Make sure to import the updateUserDocument function

export default function SignUp() {
  const Router = useRouter();
//   const userDataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
  const [state, formAction] = useFormState(updateUserDocuments);
//   const [formData, setFormData] = useState({
//     aadhaar_front: null,
//     aadhaar_back: null,
//     tshirtSize: '',
//   });
  const [userDataObj, setUserDataObj] = useState(null);

  useEffect(() => {
    // Retrieve data from localStorage
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

      const response = await formAction(formData);
      console.log(state,'response')
      if (state?.success) {
        localStorage.setItem('user', state?.data)
        Router.push('/');
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error updating user documents:', error);
    }
  };

//   const handleFileChange = (event, type) => {
//     const file = event.target.files[0];
//     setFormData({ ...formData, [type]: file });
//   };

//   const handleSelectChange = (event) => {
//     setFormData({ ...formData, tshirtSize: event.target.value });
//   };


//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log(formData)
//     console.log(userDataObj)
//     const finalData = {
//         ...userDataObj, ...formData
//     }
//     debugger
//     // Call the updateUserDocument function from the server
//     const response = await updateUserDocuments(finalData);
//     if (response.success) {
//       // Redirect the user to the home page or any other page
//       Router.push('/');
//     } else {
//       // Handle error case
//       console.error(response.message);
//     }
//   };

  return (
    <div className="container mx-auto p-8">
  <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
    <h2 className="text-xl font-bold text-center text-red-400">Upload Valid Document Id</h2>
    <h2 className="text-lg font-bold mb-6 text-center">(aadhar, passport, voterid, driving license)</h2>

    <form onSubmit={submitHandler}>
      <div className="mb-6">
        <label htmlFor="aadhaar_front" className="block text-lg font-semibold mb-2">
          Upload Front of Document ID
        </label>
        <input
          type="file"
          id="aadhaar_front"
          name= "aadhaar_front"
          className="block w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="aadhaar_back" className="block text-lg font-semibold mb-2">
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
        <label htmlFor="tshirtSize" className="block text-lg font-semibold mb-2">
          Select T-shirt Size
        </label>
        <select
          id="tshirtSize"
          name='tshirtSize'          
          className="py-2 px-4 text-md border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option className='text-sm' value="">Select Size</option>
          <option className='text-sm' value="S">S - 36 cm</option>
          <option className='text-sm' value="M">M - 38 cm</option>
          <option className='text-sm'  value="L">L - 40 cm</option>
          <option className='text-sm' value="XL">XL - 42 cm</option>
          <option className='text-sm' value="XXL">XXL - 44 cm</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Submit
      </button>
    </form>
  </div>
</div>


  );
}
