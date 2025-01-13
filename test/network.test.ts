import { ethers } from 'hardhat';
import { expect } from 'chai';
import {ABI_WETH} from '../utils/wethAbi'

describe.only('Contract Interaction Test', function () {

    // before(async function () {
    //     // Runs once before all tests
    //     const Contract = await ethers.getContractFactory('MyContract');
    //     contract = await Contract.deploy();
    //   });
  it('should read the public variable from the deployed contract', async function () {
    // Replace with the actual contract address on the forked network
    const contractAddress = '0x4200000000000000000000000000000000000006';

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, ABI_WETH, ethers.provider);

    // Replace 'publicVariable' with the actual public variable name
    const value = await contract.symbol();
    console.log("the symbol is ",value);

    // Replace 'expectedValue' with the expected value of the public variable
    expect(value).to.equal('WETH');
  });
});
