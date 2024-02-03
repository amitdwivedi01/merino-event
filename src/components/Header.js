"use client";

import { logoutUser } from "@/app/server";

const Header = () => {
  return (
    <div className="flex container px-4 mx-auto items-center justify-end py-2 w-full ">
      <button
        className="bg-white btn"
        type="button"
        onClick={() => logoutUser()}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
