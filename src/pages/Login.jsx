import React from "react";
import { CiMail, CiLock } from "react-icons/ci";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md px-8 py-12 bg-gray-800 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl mb-8 text-center">Login</h1>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-700 border-none outline-none text-white placeholder-gray-400"
            required
          />
          <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="mb-6 relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-700 border-none outline-none text-white placeholder-gray-400"
            required
          />
          <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          className="w-full py-3 rounded-lg bg-white text-gray-800 font-semibold hover:bg-gray-200 transition duration-300"
          onClick={() => {
            alert("Logged in successfully");
          }}
        >
          Login
        </button>
        <div className="pt-4">
          New User ?{" "}
          <Link to="/register" className=" text-gray-200 ">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
