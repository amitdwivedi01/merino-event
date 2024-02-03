"use client";
import { updateHotelAndEventCheckInStatus } from "@/app/server";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useFormState } from "react-dom";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = ({}) => {
  const { type } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [state, updateAction] = useFormState(updateHotelAndEventCheckInStatus);
  const router = useRouter();

  const refreshPage = () => {
    console.log("inside refresh");
    window.location.reload();
  };

  useEffect(() => {
    if (userInfo?.email) {
      updateAction({ user: userInfo, type });
    }
  }, [userInfo?.email]);

  return (
    <div className="w-dvw h-dvh grid place-items-center">
      <div className="max-w-sm w-full">
        {state?.success && (
          <div role="alert" className="alert alert-success mb-2">
            <span>{state?.message}</span>
          </div>
        )}
        {!state?.success && state?.message && (
          <div role="alert" className="alert alert-error mb-2">
            <span>{state?.message}</span>
          </div>
        )}
        <QrScanner
          onError={console.error}
          // onDecode={console.log}
          stopDecoding={userInfo}
          onResult={(data) => setUserInfo(JSON.parse(data?.text))}
        />
        <div className="grid place-items-center mt-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={refreshPage}
          >
            Scan Again
          </button>
        </div>
      </div>
    </div>
  );
};
export default Page;
