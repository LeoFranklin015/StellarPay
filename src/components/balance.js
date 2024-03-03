import * as StellarSdk from "@stellar/stellar-sdk";

const balance = async (account) => {
  try {
    const server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org"
    );
    const account = await server.loadAccount(account);
    console.log("Balances for account: " + account);
    account.balances.forEach(function (balance) {
      if (balance.asset_type != "native") {
        console.log(
          "Type: ",
          balance.asset_code,
          ", Balance:",
          balance.balance
        );
      }
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });
  } catch (error) {
    console.log(error);
  }
};
