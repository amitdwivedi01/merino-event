"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import { uploadFlightTicket } from "../server";
import { useFormStatus, useFormState } from "react-dom";

const UploadFlightTicket = ({ id }) => {
  const flightTicket = useRef();
  const [state, formAction] = useFormState(uploadFlightTicket);
  return (
    <>
      <button
        className="btn btn-square"
        onClick={() => flightTicket.current.showModal()}
      >
        <Upload />
      </button>
      <dialog ref={flightTicket} className="modal">
        <div className="modal-box">
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

          <form method="dialog">
            <button className="btn btn-sm xl:text-xl xl:btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg text-center mb-4">FLight Ticker</h3>
          <form action={formAction} className="grid place-items-center gap-4">
            <label>
              Ticket to home:
              <input type="file" name="flightTicketToHome" />
            </label>
            <label>
              Ticket to Event:
              <input type="file" name="flightTicketToEvent" />
            </label>
            <input type="hidden" name="id" value={id} />
            <UploadButton />
          </form>
        </div>
      </dialog>
    </>
  );
};

const UploadButton = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit" className="btn btn-primary w-full">
      {pending && <span className="loading loading-spinner loading-md"></span>}
      Upload Ticket
    </button>
  );
};

export default UploadFlightTicket;
