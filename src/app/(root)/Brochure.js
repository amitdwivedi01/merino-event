"use client";

import { useRef } from "react";

const Brochure = () => {
  const brochure = useRef();
  return (
    <>
      <button
        className="btn fixed right-5 bottom-5 rounded-full z-50"
        onClick={() => brochure.current.showModal()}
      >
        View Brochure
      </button>
      <dialog ref={brochure} className="modal">
        <div className="modal-box max-w-screen-2xl max-h-screen  h-[90%]">
          <form method="dialog">
            <button className="btn btn-sm xl:text-xl xl:btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>{" "}
          </form>

          <h3 className="font-bold text-lg">Brochure</h3>
          <iframe src="/Brochure.pdf" className="w-full h-[90%] mt-2" />
        </div>
      </dialog>
    </>
  );
};
export default Brochure;
