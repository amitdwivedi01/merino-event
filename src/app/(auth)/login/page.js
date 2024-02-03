'use client';
import { useRef, useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { sendOTPToUser, verifyUserOTP } from '../../server';
import OtpInput from 'react-otp-input';
// import { login } from '../../server';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
  const [state, formAction] = useFormState(sendOTPToUser);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const mobileRef = useRef(null);
  const searchParam = useSearchParams();
  const role = searchParam.get('role');
  const Router = useRouter();

  useEffect(() => {
    let userID = localStorage.getItem('user');
    userID = JSON.parse(userID);
    if (userID?._id) {
      Router.push('/');
    }
  }, []);
  if (state?.success && state?.message === 'find') {
    localStorage.setItem('user', JSON.stringify(state?.data));
    router.push('/sign-up');
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      {/* {!state?.success && state?.data && (
        <div role="alert" className="alert alert-error mb-1">
          <span>{state?.data}</span>
        </div>
      )} */}
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
        <form action={formAction} className="card-body">
          <div className="relative w-full max-w-sm mx-auto h-[60px] mb-6">
            <Image fill src="/images/future-furniture-logo.png" />
          </div>
          <div className={state?.success && 'hidden'}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text ">
                  Mobile <span className="text-red-600">*</span>
                </span>
              </div>
              <input
                type="tel"
                required
                ref={mobileRef}
                name="mobile"
                placeholder="Enter your mobile"
                className={`input input-bordered w-full`}
              />
            </label>
            <footer className="card-actions mt-4">
              <SendOTPButton />
            </footer>
          </div>
          <div className={` ${state?.success ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-center flex-col gap-10 rounded-lg">
              <h1 className="text-2xl font-medium">Enter Verification Code</h1>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                shouldAutoFocus={state?.success}
                inputStyle={{
                  height: '3rem',
                  width: '3rem',
                  margin: '0 1rem',
                  fontSize: '2rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0)'
                }}
                renderInput={(props) => <input {...props} />}
              />
              {/* <VerifyOTPButton
                onClick={async () =>
                  await verifyUserOTP(state?.user, role, otp)
                }
              /> yeh nhi krna h  */}
              <VerifyOTPButton user={state?.user} role={role} otp={otp} />
            </div>
          </div>
          {/* <SubmitButton /> */}
        </form>
        {/* <div className="grid place-items-center mb-2">
          Don't have account?
          <Link href="/sign-up" className="text-blue-500">
            Sign-up
          </Link>
        </div> */}
      </article>
    </div>
  );
};

// const SubmitButton = () => {
//   const { pending } = useFormStatus();
//   return (
//     <button disabled={pending} type="submit" className="btn btn-primary w-full">
//       {pending && <span className="loading loading-spinner loading-md"></span>}
//       Login
//     </button>
//   );
// };

const SendOTPButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="btn text-white outline-none w-full bg-[#BF3131]"
    >
      {pending && <span className="loading loading-spinner loading-md"></span>}
      Login
    </button>
  );
};

const VerifyOTPButton = ({ user, role, otp }) => {
  const [pending, setPending] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setPending(true);
      const result = await verifyUserOTP(user, role, otp);
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (
      verificationResult &&
      verificationResult.success &&
      verificationResult
    ) {
      console.log(verificationResult, 'verify');
      localStorage.setItem('user', JSON.stringify(verificationResult));
      router.push('/sign-up');
    }
  }, [verificationResult]);

  return (
    <button
      disabled={pending}
      type="button"
      className="btn text-white outline-none w-full bg-[#BF3131]"
      onClick={handleClick}
    >
      {pending && <span className="loading loading-spinner loading-md"></span>}
      Submit
    </button>
  );
};

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-current shrink-0 h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default Login;
