import * as StellarSdk from "@stellar/stellar-sdk";

const balance = async () => {
  try {
    const server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org"
    );
    const account = await server.loadAccount(childAccount.publicKey());
    console.log("Balances for account: " + childAccount.publicKey());
    account.balances.forEach(function (balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });
  } catch (error) {
    console.log(error);
  }
};
