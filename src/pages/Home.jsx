import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { IoIosSend } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";
import QrReader from "react-qr-reader";
import QRCode from "react-qr-code";
import * as StellarSdk from "@stellar/stellar-sdk";
import { Account } from "@stellar/stellar-sdk";
import { Contract, networks } from "hello-soroban-client";

const Home = () => {
  // const token = new Contract({
  //   ...networks.testnet,
  //   rpcUrl: "https://soroban-testnet.stellar.org", // from https://soroban.stellar.org/docs/reference/rpc#public-rpc-providers
  // });

  const [balance, setBalance] = useState(0); // State to hold balance

  const send = async (destinationAddress, amount) => {
    // const secret = "SAO62XNBBDILTTE4Y4HQKBFCE7TVU5ZKX7EFLKYSJJ4PVNHSFXHQEOG3";
    const secret = localStorage.getItem("secretKey");
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

  // Function to fetch balance
  const fetchBalance = async () => {
    try {
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );
      // const account = await server.loadAccount(
      //   "GC3AWYTQXCZIY2U3HPYESXJ6D7HR2O2BP5S7ABPJLENTYR3WPUSEKRRK"
      // );
      const account = await server.loadAccount(
        localStorage.getItem("publicKey")
      );
      let totalBalance = 0;
      account.balances.forEach(function (balance) {
        if (balance.asset_type === "native") {
          totalBalance += parseFloat(balance.balance);
        }
      });
      setBalance(totalBalance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBalance(); // Fetch balance when component mounts
  }, []);

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
      setAddress(scanData);
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
          <h2 className="text-5xl font-bold">{balance}stellar</h2>
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
      {/* <div>Transactions</div>
      <button
        onClick={async () => {
          const acc = new Account(
            "GAGWIVBKR63CDXTWWUTURHLA5VFPHHUORKFWEEANUSBKRMPGAUC5XO3F",
            "1894939570995201"
          ).accountId();
          console.log(acc);

          const { result } = await token.initialize(
            // new Account(
            //   "GAGWIVBKR63CDXTWWUTURHLA5VFPHHUORKFWEEANUSBKRMPGAUC5XO3F",
            //   "1894939570995201"
            // ),
            new Account(
              "GAGWIVBKR63CDXTWWUTURHLA5VFPHHUORKFWEEANUSBKRMPGAUC5XO3F",
              "1894939570995201"
            ).accountId(),
            "8",
            "StellarPay",
            "SP"
          );
          console.log(result);
        }}
      >
        Create
      </button> */}

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
                await send(address, amount);
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
            {/* <QRCode value="GC3AWYTQXCZIY2U3HPYESXJ6D7HR2O2BP5S7ABPJLENTYR3WPUSEKRRK" /> */}
            <QRCode value={localStorage.getItem("publicKey")} />
            <p>{localStorage.getItem("publicKey")}</p>
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
