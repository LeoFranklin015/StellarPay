import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { IoIosSend } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";
import QrReader from "react-qr-reader";
import QRCode from "react-qr-code";

const Home = () => {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");

  const openSendModal = () => {
    setIsSendModalOpen(true);
  };

  const closeSendModal = () => {
    setIsSendModalOpen(false);
  };

  const openReceiveModal = () => {
    setIsReceiveModalOpen(true);
  };

  const closeReceiveModal = () => {
    setIsReceiveModalOpen(false);
  };

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  // Function to send money
  const sendMoney = async (destinationAddress, amount) => {
    // Implement your sending logic here
    console.log("Sending money to", destinationAddress, "Amount:", amount);
  };

  return (
    <div className="px-10">
      <Navbar />
      <div className="flex flex-col gap-8 py-8 sm:flex-row sm:justify-between sm:items-center">
        <div className="text-center sm:text-left">
          <p className="text-3xl">Your Balance</p>
          <h2 className="text-5xl font-bold">1223.45$</h2>
        </div>
        <div className="flex justify-center gap-4 sm:flex-row sm:gap-4">
          <button
            className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={openSendModal}
          >
            <IoIosSend className="mr-2" />
            Send
          </button>
          <button
            className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={openReceiveModal}
          >
            <RiDownloadLine className="mr-2" />
            Receive
          </button>
        </div>
      </div>
      <div>Transactions</div>

      {/* Send Money Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Send Money</h2>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
              onClick={() => {
                setStartScan(!startScan);
              }}
            >
              Scan QR
            </button>

            {startScan && (
              <QrReader
                delay={1000}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "300px" }}
              />
            )}

            <input
              type="text"
              placeholder="Enter Address"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Amount"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={async () => {
                await sendMoney(address, amount);
                closeSendModal();
              }}
            >
              Send
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={closeSendModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Receive Money Modal */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Receive Money</h2>
            <QRCode value="google.com" />
            {/* <p>{localStorage.getItem("publickey")}</p> */}
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={closeReceiveModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
