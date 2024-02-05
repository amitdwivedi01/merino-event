'use client';

import { useState, useEffect, Fragment } from 'react';
import { updateUserDeatils } from '../../server';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';

export default function SignUp() {
  const [userDataObj, setUserDataObj] = useState(null);
  const [state, formAction] = useFormState(updateUserDeatils);
  const [formData, setFormData] = useState({});
  const Router = useRouter();
  const [typeOfBtn, setTypeOfBtn] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let userID = localStorage.getItem('user');
    userID = JSON.parse(userID);
    if (userID?._id) {
      Router.push('/');
    } else if (!userID?.message) {
      Router.push('/login');
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserDataObj(parsedUserData.data);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userDataObj, 'formData');
    if (typeOfBtn === 'submit') {
      console.log(userDataObj, 'formData');
      const response = await updateUserDeatils(state, userDataObj);
      if (response?.success) {
        localStorage.setItem('user', JSON.stringify(response?.data));
        Router.push('/upload');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDataObj({ ...userDataObj, [name]: value });
  };

  if (state?.success) {
    console.log(state?.data);
    Router.push('/');
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsOpen(false);
            setTypeOfBtn('submit');
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are You Sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please confirm the below details carefully, needed for a
                      seamless ticketing and hotel check in.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsOpen(false);
                        setTypeOfBtn('submit');
                      }}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
            <div className="relative max-w-sm mx-auto h-[60px] mb-14">
            <img className='' src='/images/FABWood-logo.png' alt='logo' />
              {/* <Image fill src="/images/FABWood-logo.png" alt="img" /> */}
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
                  value={formData.email || userDataObj?.email}
                  onChange={handleInputChange}
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
                  value={formData.companyName || userDataObj?.companyName}
                  onChange={handleInputChange}
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
                  name="mobile"
                  value={formData.mobile || userDataObj?.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className={`input input-bordered w-full`}
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    City <span className="text-red-600">*</span>
                  </span>
                </div>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city || userDataObj?.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className={`input input-bordered w-full`}
                />
              </label>
            </div>

            <SubmitButton
              typeOfBtn={typeOfBtn}
              setTypeOfBtn={setTypeOfBtn}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </form>
        </div>
      </article>
    </div>
  );
}

const SubmitButton = ({ typeOfBtn, setIsOpen }) => {
  const [modalShown, setModalShown] = useState(false);
  const { pending } = useFormStatus();

  const modalHandler = () => {
    if (!modalShown) {
      setIsOpen(true);
      setModalShown(true);
    }
  };
  return (
    <button
      disabled={pending}
      type={typeOfBtn}
      className="btn mt-3 outline-none w-full text-white bg-[#BF3131]"
      onClick={() => modalHandler()}
    >
      {pending && <span className="loading loading-spinner loading-md"></span>}
      Confirm Details
    </button>
  );
};
