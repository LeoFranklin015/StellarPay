import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { IoIosSend } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";
// import send from "../components/send";

import * as StellarSdk from "@stellar/stellar-sdk";



const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address,setAddress] = useState("");
  const [amount,setAmount] = useState("0");
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const send = async (destinationAddress, amount) => {
    const secret = localStorage.getItem("privatekey");
    const server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org"
    );
    var sourceKeys = StellarSdk.Keypair.fromSecret(secret);
    var destinationId = destinationAddress;
    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    var transaction;
  
    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    server
      .loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(function (error) {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new Error("The destination account does not exist!");
        } else return error;
      })
      // If there was no error, load up-to-date information on your account.
      .then(function () {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(function (sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationId,
              // Because Stellar allows transaction in many currencies, you must
              // specify the asset type. The special "native" asset represents Lumens.
              asset: StellarSdk.Asset.native(),
              amount: amount,
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text("Test Transaction"))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(180)
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then(function (result) {
        console.log("Success! Results:", result);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      });
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
            onClick={openModal}
          >
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            {/* Modal Content */}
            <h2 className="text-2xl font-bold mb-4">Send Money</h2>
            {/* QR scan button */}
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4">
              Scan QR
            </button>
            {/* Address field */}
            <input
              type="text"
              placeholder="Enter Address"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Enter Amount"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
            />
            {/* Send button */}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={async()=>{
              await send(address,amount);
              closeModal();
            }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
