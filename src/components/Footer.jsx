import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-500 border-t py-4 shadow-inner mt-auto z-50 ">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-md text-white font-medium tracking-wide">
          © 2025 <span className="text-black font-semibold">Dept</span>
          <span className="italic text-yellow-400 font-semibold">Hub</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

