import { deployments, ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { ABI_WETH } from "../utils/wethAbi";
import { exportedHre } from "../hardhat.config"; // Import the exported hre
import { BaseContract,BigNumberish } from "ethers";
import {abi} from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"
import { json } from "hardhat/internal/core/params/argumentTypes";
import {TickMath} from "@uniswap/v3-sdk"


let hre: any;
let factoryContract: any;
let tokenM:any;
let tokenN:any;
let swapRouter:any;
let positionManager:any;
let deployerr:any;
async function main() {
  hre = await exportedHre; // Await the dynamic import
  console.log("Current Network:", hre.network.name);
  console.log("Provider URL:", hre.network.config.url);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

describe.only("Contract Interaction Test", function () {
  before(async () => {
    // Get the named accounts (from hardhat config)
    const { deployer: deployerAccount } = await getNamedAccounts();
     deployerr = deployerAccount;

    // Deploy the contracts using the fixtures (this will deploy the "Token" contract)
    await deployments.fixture(["UniswapV3Factory","TokenM","TokenN","SwapRouter","NonfungibleTokenPositionDescriptor","NonfungiblePositionManager"]); // Ensure "Token" contract is deployed

    // Retrieve the deployed contract instance using the deployer's account
    factoryContract = await ethers.getContract(
      "UniswapV3Factory",
      deployerAccount
    );
    console.log("before deploying tokens");
    tokenM = await ethers.getContract("TokenM",deployerAccount);
    tokenN = await ethers.getContract("TokenN",deployerAccount);
    swapRouter = await ethers.getContract("SwapRouter",deployerAccount);
    positionManager = await ethers.getContract("NonfungiblePositionManager",deployerAccount);


    const signers = await ethers.getSigners();
    
  });

  it("should read the public variable from the deployed contract", async function () {
    // Replace with the actual contract address on the forked network
    const contractAddress = "0x4200000000000000000000000000000000000006";

    // Create a contract instance
    const contract = new ethers.Contract(
      contractAddress,
      ABI_WETH,
      ethers.provider
    );
    const value = await contract.symbol();
    console.log("the symbol is ", value);
    expect(value).to.equal("WETH");
  });

  it("should read the owner of the contract ", async () => {
    const owner = await factoryContract.owner();
    console.log("the owner of the factory contract is ", owner);
  });

  // it("should impersonate the whale to create a pool", async () => {
  //   const donatuz_dnt = "0x00060EBE6F28EC0101156570D81cAC22b7E67A2A";
  // });

  it("should read the tokenM symbol of N & M",async()=>{
    const symbol = await tokenM.symbol();
    console.log(`the symbol of tokenM is ${symbol}`)
    const symbol2 = await tokenN.symbol();
    console.log(`the symbol of tokenN is ${symbol2}`)

  })

  it("should approve the factory contract to use the tokenN and tokenM",async()=>{
    const factoryDeployment = await deployments.get("UniswapV3Factory");
    const managerDeployment = await deployments.get("NonfungiblePositionManager");
    const positionAddress = managerDeployment.address;
    const factoryAddress =  factoryDeployment.address;
    console.log(`the address of factory is the ${factoryAddress}`)
    console.log(`the positonManager address is A ${positionAddress}`)
    const approvalAmount = ethers.parseUnits("1000", 18); // Example: approve 1000 tokens

  const approveTokenM = await tokenM.approve(positionAddress, approvalAmount);
  await approveTokenM.wait();
  console.log("Factory approved for TokenM");

  const approveTokenN = await tokenN.approve(positionAddress, approvalAmount);
  await approveTokenN.wait();
  console.log("Factory approved for TokenN");
  })

  // it("should try to create a pool of tokenM and tokenN and read pool",async()=>{
  //   const NDeployment = await deployments.get("TokenN");
  //   const MDeployment = await deployments.get("TokenM");

  //   console.log(`the address of M IS ${NDeployment.address} AND THE N IS ${MDeployment.address}`)

  //   const pool = await factoryContract.createPool(NDeployment.address,MDeployment.address,500);
  //   const poolAddress = await factoryContract.getPool(NDeployment.address,MDeployment.address,500);

  //   const poolContract = new ethers.Contract(poolAddress, abi, ethers.provider);

  //   const slot0 = await poolContract.slot0();

  //   console.log(`Current sqrtPriceX96: ${slot0[0]}`);
  //   console.log(`Current tick: ${slot0[1]}`);
  
  //   const liquidity = await poolContract.liquidity();
  //   const fee = await poolContract.fee();

  //   console.log(`Current liquidity: ${liquidity}`);
  //   console.log(`Pool fee: ${fee}`);
  //   console.log(`the address of the pool that has been created is ${poolAddress}`)

  //   //below we will try to mint Position for the pool
  //   const yourToken_amount = 1000; // Token0 amount with 0 decimals

  //   const WETH_amount = 1000; // Token1 amount with 0 decimals
  //   const SqrtPriceX96 = BigInt(Math.sqrt(WETH_amount / yourToken_amount) * 2 ** 96); 
  // })

  it("should create pool with the if necessary function and mint Position",async()=>{
  //   const factoryDeployment = await deployments.get("UniswapV3Factory");
    const managerDeployment = await deployments.get("NonfungiblePositionManager");
    const NDeployment = await deployments.get("TokenN");
    const MDeployment = await deployments.get("TokenM");
    const sqrt =  TickMath.getSqrtRatioAtTick(10);
    const sqrtRatioX96: BigNumberish = sqrt.toString();
    console.log("the sqrttt ratio is ",sqrtRatioX96)

    console.log("the sqrt ratio is ",sqrt)
    const positionAddress = managerDeployment.address;
  //   const factoryAddress =  factoryDeployment.address;
  //   console.log(`the address of factory is the ${factoryAddress}`)
  //   console.log(`the positonManager address is A ${positionAddress}`)
  //   const approvalAmount = ethers.parseUnits("1000", 18); // Example: approve 1000 tokens
  console.log("before initializing the pool etc ");
    const pool = await positionManager.createAndInitializePoolIfNecessary(MDeployment.address,NDeployment.address,500,sqrtRatioX96)
    console.log(`the pool has been created with a address of ${pool}`);
    // console.log(`after creating a pool it has returned address of ${pool}`)
    const approvalAmount = ethers.parseUnits("1000", 18); // Example: approve 1000 tokens

    const approveTokenM = await tokenM.approve(positionAddress, approvalAmount);
    await approveTokenM.wait();
    console.log("Factory approved for TokenM");
  
    const approveTokenN = await tokenN.approve(positionAddress, approvalAmount);
    await approveTokenN.wait();
    const tickLower = -887220; // Lower tick (e.g., for a range of 0.5%)
  const tickUpper = 887220; // Upper tick
  const amountA = ethers.parseUnits("1000", 18); // Amount of tokenA
  const amountB = ethers.parseUnits("1000", 18); // Amount of tokenB
  const amountAmin = ethers.parseUnits("900", 18); // Minimum amount of tokenA (slippage control)
  const amountBmin = ethers.parseUnits("900", 18); // Minimum amount of tokenB (slippage control)
  const userAddress = deployerr; // User's address (could be any Ethereum address)
  const deadline = Math.floor(Date.now() / 1000) + 60;
  const Nsymbol = await tokenN.symbol();
  const Msymbol = await tokenM.symbol();

  console.log(`the symbol of n & m are ${Nsymbol} & ${Msymbol}`)

  console.log(`before position mint try ====>>`);
  console.log(`the address of position manage is ${positionAddress}`)
    const  positionMinting = await positionManager.mint({
      token0: MDeployment.address,
      token1: NDeployment.address,
      fee: 500,
      tickLower: -276480,
      tickUpper: 276480,
      amount0Desired: amountA,
      amount1Desired: amountB,
      amount0Min: amountAmin,
      amount1Min: amountBmin,
      recipient: userAddress,
      deadline: deadline,
    })
      await positionMinting.wait();
      // console.log(`the position has been minted and is now ${JSON.stringify(positionMinting)}`)

  })

  it("should execut a swap for the created pool but from anothr account as well",async()=>{
    // const amountToSwap = ethers.parseUnits
  })
});
