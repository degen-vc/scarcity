require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-gas-reporter");

const {PRIVATE_KEY, POLYGONSCAN_API_KEY} = process.env;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [PRIVATE_KEY]
    },
    bscMainnet: {
      url: `https://bsc-dataseed1.ninicoin.io`,
      accounts: [PRIVATE_KEY]
    },
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasPrice: "10000000000",
  gas: "auto",
  gasReporter: {
    gasPrice: 1,
    enabled: false,
    showTimeSpent: true
  },

  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  }
};

