import { ethers, Contract } from "ethers";

// @dev - Blockchain related imports
import artifactOfZkJwtProofManager from './artifacts/ZkJwtProofManager.sol/ZkJwtProofManager.json';

/**
 * @notice - Set the ZkJwtProofManager contract instance
 */
export async function setContractInstance(signer: any): Promise<{ zkJwtProofManager: Contract }> {
  // @dev - Create the ZkJwtProofManager contract instance
  const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_ON_BASE_TESTNET || "";  
  const zkJwtProofManagerAbi: Array<any> = artifactOfZkJwtProofManager.abi;
  const zkJwtProofManager = new Contract(zkJwtProofManagerContractAddress, zkJwtProofManagerAbi, signer);
  console.log(`zkJwtProofManagerContractAddress: ${zkJwtProofManagerContractAddress}`);
  return { zkJwtProofManager };
}

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
  // @dev - Set the ZkJwtProofManager contract instance
  const { zkJwtProofManager } = await setContractInstance(signer);

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

/**
 * @notice - ZkJwtProofManager.sol# getPublicInputsOfZkJwtProof()
 */
export async function getPublicInputsOfZkJwtProof(signer: any, nullifierHash: string): Promise<{ publicInputsFromOnChain: any }> {
  // @dev - Set the ZkJwtProofManager contract instance
  const { zkJwtProofManager } = await setContractInstance(signer);

  const publicInputsFromOnChain = await zkJwtProofManager.getPublicInputsOfZkJwtProof(nullifierHash);
  return { publicInputsFromOnChain };
}

/**
 * @notice - ZkJwtProofManager.sol# getNullifierByWalletAddress()
 */
export async function getNullifierByWalletAddress(signer: any): Promise<{ nullifierFromOnChain: string }> {
  // @dev - Set the ZkJwtProofManager contract instance
  const { zkJwtProofManager } = await setContractInstance(signer);

  const nullifierFromOnChain = await zkJwtProofManager.getNullifierByWalletAddress();
  return { nullifierFromOnChain };
}