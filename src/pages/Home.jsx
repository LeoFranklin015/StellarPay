import React from "react";
import Navbar from "../components/Navbar";
import { IoIosSend } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";

const Home = () => {
  return (
    <div className="px-10">
      <Navbar />
      <div className="flex flex-col gap-8 py-8 sm:flex-row sm:justify-between sm:items-center">
        <div className="text-center sm:text-left">
          <p className="text-3xl">Your Balance</p>
          <h2 className="text-5xl font-bold">1223.45$</h2>
        </div>
        <div className="flex justify-center gap-4 sm:flex-row sm:gap-4">
          <button className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
            <IoIosSend className="mr-2" />
            Send
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
            <RiDownloadLine className="mr-2" />
            Receive
          </button>
        </div>
      </div>
      <div>Transactions</div>
    </div>
  );
};

export default Home;
