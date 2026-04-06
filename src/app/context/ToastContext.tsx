"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <div className="z-[9999999]">
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ToasterContext;
