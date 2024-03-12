import React, { useState } from "react";
import { CiMail, CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { Keypair } from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";

const Register = () => {
  const navigate = useNavigate();

  const [user, setuser] = useState("");
  const [password, setpassword] = useState("");
  const [publickey, setpublic] = useState("");
  const [privateKey, setPrivate] = useState("");

  const handleRegister = async () => {
    await create();
    try {
      const response = await fetch(
        "https://stellarpay-be.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user,
            password: password,
            publicAddress: publickey,
            privateAddress: privateKey,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const responseData = await response.json();
      console.log(responseData.message); // Log success message
    } catch (error) {
      console.error("Error registering user:", error.message);
      // Handle error, such as displaying an error message to the user
    }
  };
  const create = async () => {
    const pair = Keypair.random();
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(
          pair.publicKey()
        )}`
      );
      const responseJSON = await response.json();
      console.log("SUCCESS! You have a new account :)\n", responseJSON);
    } catch (e) {
      console.error("ERROR!", e);
    }
    // After you've got your test lumens from friendbot, we can also use that account to create a new account on the ledger.
    try {
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );
      console.log(server);
      var parentAccount = await server.loadAccount(pair.publicKey()); //make sure the parent account exists on ledger
      var childAccount = StellarSdk.Keypair.random(); //generate a random account to create
      //create a transacion object.
      var createAccountTx = new StellarSdk.TransactionBuilder(parentAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      });
      //add the create account operation to the createAccountTx transaction.
      createAccountTx = await createAccountTx
        .addOperation(
          StellarSdk.Operation.createAccount({
            destination: childAccount.publicKey(),
            startingBalance: "5",
          })
        )
        .setTimeout(180)
        .build();
      //sign the transaction with the account that was created from friendbot.
      await createAccountTx.sign(pair);
      //submit the transaction
      let txResponse = await server
        .submitTransaction(createAccountTx)
        // some simple error handling
        .catch(function (error) {
          console.log("there was an error");
          console.log(error.response);
          console.log(error.status);
          console.log(error.extras);
          return error;
        });
      console.log(txResponse);
      console.log("Created the new account", childAccount.publicKey());
      setpublic(childAccount.publicKey());
      localStorage.setItem("publicKey", childAccount.publicKey());
      console.log("Created the new account", childAccount.secret());
      setPrivate(childAccount.secret());
      localStorage.setItem("secretKey", childAccount.secret());

      //
      const account = await server.loadAccount(childAccount.publicKey());
      console.log("Balances for account: " + childAccount.publicKey());
      account.balances.forEach(function (balance) {
        console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      });
      //

      navigate("/home");
    } catch (e) {
      console.error("ERROR!", e);
    }
  };

  return (
    <div className="flex justify-center items-center mt-9">
      <div className="w-full max-w-md px-8 py-12 bg-gray-800 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl mb-8 text-center">Register</h1>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-700 border-none outline-none text-white placeholder-gray-400"
            required
            onChange={(e) => {
              setuser(e.target.value);
            }}
          />
          <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="mb-6 relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-700 border-none outline-none text-white placeholder-gray-400"
            required
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          className="w-full py-3 rounded-lg bg-white text-gray-800 font-semibold hover:bg-gray-200 transition duration-300"
          onClick={async () => {
            await handleRegister();
          }}
        >
          Register
        </button>
        <div className="pt-4">
          Existing User ?{" "}
          <Link to="/" className=" text-gray-200 ">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
