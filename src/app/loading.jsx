"use client";

import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={100} color="#F87171" />
    </div>
  );
};

export default Loading;
