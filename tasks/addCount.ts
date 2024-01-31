import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { Counter } from "../typechain-types";

task("task:addCount")
  .addParam("amount", "Amount to add to the counter (plaintext number)", "1")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    const amountToAdd = Number(taskArguments.amount);
    const Counter = await deployments.get("Counter");

    console.log(`Running addCount, targeting contract at: ${Counter.address}`);

    const contract = await ethers.getContractAt("Counter", Counter.address);

    const encyrptedAmount = await fhenixjs.encrypt_uint32(amountToAdd);

    let contractWithSigner = contract.connect(signer) as unknown as Counter;

    try {
      // add() gets `bytes calldata encryptedValue`
      // therefore we need to pass in the `data` property
      await contractWithSigner.add(encyrptedAmount.data);
    } catch (e) {
      console.log(`Failed to send add transaction: ${e}`);
      return;
    }
  });
