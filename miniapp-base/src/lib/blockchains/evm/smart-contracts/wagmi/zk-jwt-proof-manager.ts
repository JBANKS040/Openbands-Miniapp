// Wagmi
// ref). Write Contract - https://wagmi.sh/react/guides/write-to-contract#_3-add-a-form-handler
import { useWriteContract } from 'wagmi'

// @dev - Blockchain related imports
import artifactOfZkJwtProofManager from '../artifacts/ZkJwtProofManager.sol/ZkJwtProofManager.json';

/**
 * @notice - Set the ZkJwtProofManager contract instance
 */
export async function setContractInstance(): Promise<{ zkJwtProofManagerContractAddress: string, zkJwtProofManagerAbi: any }> {
  // @dev - Create the ZkJwtProofManager contract instance
  const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_ON_BASE_MAINNET || "";  
  //const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_ON_BASE_TESTNET || "";  
  const zkJwtProofManagerAbi = artifactOfZkJwtProofManager.abi;
  console.log(`zkJwtProofManagerContractAddress: ${zkJwtProofManagerContractAddress}`);
  return { zkJwtProofManagerContractAddress, zkJwtProofManagerAbi };
}

export function callSmartContractFunction(contractAddress: string, abi: any, functionName: string, args: any[]) {
  // @dev - Wagmi
  const { data: hash, writeContract } = useWriteContract();

  writeContract({
    contractAddress,
    abi,
    functionName,
    args
  })

  console.log("Transaction Hash: ", hash);
}

/**
 * @notice - ZkJwtProofManager.sol# recordPublicInputsOfZkJwtProof() with Wagmi.
 */
export async function recordPublicInputsOfZkJwtProof(
  proof: Uint8Array,
  publicInputs: Array<string | number>,
  separatedPublicInputs: {
    domain: string;
    nullifierHash: string;
    //emailHash: string;   // [TODO]: A proper hashing method is to be considered later.
    walletAddress: string;
    createdAt: string;
  }
): Promise<{ tx: any }> {
  // @dev - Wagmi
  const { data: hash, writeContract } = useWriteContract();

  // @dev - Set the ZkJwtProofManager contract instance
  const { zkJwtProofManagerContractAddress, zkJwtProofManagerAbi } = await setContractInstance();

  // @dev - Convert Uint8Array proof to hex string proofHex
  const proofHex = "0x" + Buffer.from(proof).toString("hex");
  console.log(`proofHex: ${proofHex}`);
  
  // @dev - Call the recordPublicInputsOfZkJwtProof() function in the ZkJwtProofManager.sol
  let tx: any;
  //let txReceipt: any | null = null;
  try {
    tx = callSmartContractFunction(
      zkJwtProofManagerContractAddress,
      zkJwtProofManagerAbi,
      "recordPublicInputsOfZkJwtProof",
      [proofHex, publicInputs, separatedPublicInputs]
    );
    
    // Wait for the transaction to be included.
    //txReceipt = await tx.wait();
  } catch (err) {
    console.error(`Failed to send a transaction on BASE: ${err}`);
  }

  return { tx };
}
