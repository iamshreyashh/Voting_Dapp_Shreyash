require("@nomicfoundation/hardhat-ignition-ethers");
require("@nomicfoundation/hardhat-chai-matchers")

const XINFIN_NETWORK_URL = "https://erpc.apothem.network";
const XINFIN_PRIVATE_KEY = "adaae607920684607203ea96a2adc715bc1b87d8fc4cb491d647baeb4fc6d15d";

module.exports = {
  solidity: "0.8.0",
  networks: {
    xinfin: {
      url: XINFIN_NETWORK_URL,
      accounts: [XINFIN_PRIVATE_KEY],
    },
  },
};