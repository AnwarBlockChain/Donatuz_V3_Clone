import { HardhatRuntimeEnvironment } from "hardhat/types";
import {ethers} from 'hardhat'
import { DeployFunction } from "hardhat-deploy/types";
import {contracts} from '../utils/contract_address'


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    //@ts-ignore
  const { deployments, getNamedAccounts } = hre;
//   https://42019.rpc.thirdweb.com/${THIRDWEB_API_KEY}
  const { deploy } = deployments;
  


 
  const { deployer, tokenOwner } = await getNamedAccounts();
  console.log(`the deployer is a ${deployer}`)
  const nftDescriptorLibrary = await deploy("NFTDescriptor", {
    from: deployer,
    args: [], // Constructor arguments if any
    log: true,
  });
  const descriptorAddress = nftDescriptorLibrary.address;
  const weth = process.env.WETH_ADDRESS;
  console.log("the weth address is ",weth)
 
  // Deploy the Lock contract
  const descriptor = await deploy("NonfungibleTokenPositionDescriptor", {
    from: deployer,
    args: ["0x4200000000000000000000000000000000000006"] ,// Pass the calculated unlockTime
    libraries: {
        NFTDescriptor: descriptorAddress, // Link the library address
      },
    log: true,
    // gasLimit: 30000000 // Set an appropriate gas limit

  });
  contracts.push({name:"NonfungibleTokenPositionDescriptor",address:descriptor.address})
};

export default func;

func.tags = ["NonfungibleTokenPositionDescriptor"];


