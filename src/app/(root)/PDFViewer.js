"use client";

import { useRef } from "react";

const PDFViewer = ({ url, text }) => {
  const pdfViewer = useRef();
  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => pdfViewer.current.showModal()}
      >
        {text ?? "View"}
      </button>
      <dialog ref={pdfViewer} className="modal">
        <div className="modal-box max-w-screen-2xl max-h-screen  h-[90%]">
          <form method="dialog">
            <button className="btn btn-sm xl:text-xl xl:btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>{" "}
          </form>

          <iframe src={url} className="w-full h-[90%] mt-5" />
        </div>
      </dialog>
    </>
  );
};
export default PDFViewer;
