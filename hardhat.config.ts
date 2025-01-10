import { HardhatRuntimeEnvironment, HardhatUserConfig, HttpNetworkUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import dotenv from "dotenv";
dotenv.config();
import { extendEnvironment} from 'hardhat/config'

const config: HardhatUserConfig = {
  
  solidity: {
    compilers: [
      {
        version: '0.4.1',
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.5.0',
        settings: {
          viaIR: true,

          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          viaIR: true,

          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.9',
        settings: {
          viaIR: true,

          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.20',
        settings: {
          viaIR: true,

          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.22',
        settings: {
          viaIR: true,

          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.28',
        settings: {
          viaIR: true,

          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: 'src',
  },
  networks: {
    localhost: {
      
      // Connects to a locally running Hardhat node
      url: 'http://127.0.0.1:8545', // Default RPC URL for local Hardhat node
      chainId: 31337,
      gas: 12000000,  // Increase gas for tests
      gasPrice: 10000000000,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // Default Hardhat accounts
      },
      forking: {
        url: `https://mainnet.infura.io/v3/e71d39d9d58b4736ae7dcba730bc1f18`, // RPC URL from which to fork
        blockNumber: 20986456, // Specify the block number to fork from
      },
    },
    donatuz: {
      url: `https://42026.rpc.thirdweb.com/${process.env.THIRDWEB_API_KEY}`,
      chainId: 42026,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    polygon: {
      url: `https://42026.rpc.thirdweb.com/${process.env.THIRDWEB_API_KEY}`,
      chainId: 135,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};
extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  const config = hre.network.config as HttpNetworkUserConfig;
  if (config?.url) {
          hre.ethers.provider = new hre.ethers.JsonRpcProvider(config.url) as any;
  }
});
let exportedHre: any = null;
(async () => {
  exportedHre = await import("hardhat");
})();

export { exportedHre }; 

export default config;