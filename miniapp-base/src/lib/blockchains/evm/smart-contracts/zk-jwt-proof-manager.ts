import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
import artifactOfZkJwtProofManager from './artifacts/ZkJwtProofManager.sol/ZkJwtProofManager.json';


/**
 * @notice - ZkJwtProofManager.sol# recordPublicInputsOfZkJwtProof()
 */
export async function recordPublicInputsOfZkJwtProof(
  signer: any,
  proof: Uint8Array<any>,
  publicInputs: Array<any>
): Promise<{ txReceipt: any }> {
  // @dev - Create the ZkJwtProofManager contract instance
  const abi: Array<any> = artifactOfZkJwtProofManager.abi;
  const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_CONTRACT_ADDRESS || "";
  const zkJwtProofManager = new Contract(zkJwtProofManagerContractAddress, abi, signer);

  // @dev - Convert Uint8Array proof to hex string proofHex
  const proofHex = "0x" + Buffer.from(proof).toString("hex");
  //const proofHex = uint8ArrayToHex(proof);
  console.log(`proofHex: ${proofHex}`);

  // @dev - Call the recordPublicInputsOfZkJwtProof() function in the ZkJwtProofManager.sol
  let tx: any;
  let txReceipt: any;
  try {
    tx = await zkJwtProofManager.recordPublicInputsOfZkJwtProof(
      proofHex, 
      publicInputs
      //{ value: parseEther("0.001") }  // @dev - Send a TX with 0.01 ETH -> This is not a gas fee. Hence, this is commented out.
    );
    
    // Wait for the transaction to be included.
    txReceipt = await tx.wait();
  } catch (err) {
    console.error(`Failed to send a transaction: ${err}`);
    throw new Error(`Failed to send a transaction: ${err}`); // @dev - To display a full error message on UI
  }

  return { txReceipt };
}



