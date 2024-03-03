import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Keypair } from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";

function App() {
  const [count, setCount] = useState(0);
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
      console.log("Created the new account", childAccount.secret());

      //
      const account = await server.loadAccount(childAccount.publicKey());
      console.log("Balances for account: " + childAccount.publicKey());
      account.balances.forEach(function (balance) {
        console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      });
      //
    } catch (e) {
      console.error("ERROR!", e);
    }
  };

  const send = async () => {
    const server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org"
    );
    var sourceKeys = StellarSdk.Keypair.fromSecret(
      "SCVZ7G7KJIAUP7XCRAQT6U4P3W74MWVO5SXGMURYJHMH2N7HQJYTFY4R"
    );
    var destinationId =
      "GCOYLNLIFELU6QSUCI5VQ4JKWOWZGK5QCGXAL2BMK2FKFXATXXZ5E5HU";
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
              amount: "1",
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
    <>
      <button onClick={create} className=" bg-green-500">
        Create
      </button>
      <button onClick={send} className=" bg-green-500">
        Send
      </button>
    </>
  );
}

export default App;
