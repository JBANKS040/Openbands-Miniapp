import { ethers, Contract } from "ethers";

// @dev - Blockchain related imports
import artifactOfZkJwtProofManager from './artifacts/ZkJwtProofManager.sol/ZkJwtProofManager.json';


/**
 * @notice - ZkJwtProofManager.sol# recordPublicInputsOfZkJwtProof()
 */
export async function recordPublicInputsOfZkJwtProof(
  signer: any,
  proof: Uint8Array<any>,
  publicInputs: Array<any>,
  separatedPublicInputs: {
    domain: string;
    nullifierHash: string;
    createdAt: string;
  }
): Promise<{ txReceipt: any }> {
  // @dev - Create the ZkJwtProofManager contract instance
  const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_CONTRACT_ADDRESS || "";  
  const zkJwtProofManagerAbi: Array<any> = artifactOfZkJwtProofManager.abi;
  const zkJwtProofManager = new Contract(zkJwtProofManagerContractAddress, zkJwtProofManagerAbi, signer);
  console.log(`zkJwtProofManagerContractAddress: ${zkJwtProofManagerContractAddress}`);

  // @dev - Convert Uint8Array proof to hex string proofHex
  const proofHex = "0x" + Buffer.from(proof).toString("hex");
  console.log(`proofHex: ${proofHex}`);
  
  // @dev - Call the recordPublicInputsOfZkJwtProof() function in the ZkJwtProofManager.sol
  let tx: any;
  let txReceipt: any;
  try {
    tx = await zkJwtProofManager.recordPublicInputsOfZkJwtProof(
      proofHex, 
      publicInputs,
      separatedPublicInputs
      //{ value: parseEther("0.001") }  // @dev - Send a TX with 0.01 ETH -> This is not a gas fee. Hence, this is commented out.
    );
    
    // Wait for the transaction to be included.
    txReceipt = await tx.wait();
  } catch (err) {
    console.error(`Failed to send a transaction on BASE: ${err}`);
  }

  return { txReceipt };
}



