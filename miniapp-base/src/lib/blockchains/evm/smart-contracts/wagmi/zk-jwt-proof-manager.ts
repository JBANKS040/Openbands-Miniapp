// Wagmi
// ref). Write Contract - https://wagmi.sh/react/guides/write-to-contract#_3-add-a-form-handler
import { useWriteContract } from 'wagmi'

// @dev - Blockchain related imports
import artifactOfZkJwtProofManager from '../artifacts/ZkJwtProofManager.sol/ZkJwtProofManager.json';

/**
 * @notice - Set the ZkJwtProofManager contract instance
 */
export function setContractInstance(): { zkJwtProofManagerContractAddress: string, zkJwtProofManagerAbi: any } {
  // @dev - Create the ZkJwtProofManager contract instance
  const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_ON_BASE_MAINNET || "";  
  //const zkJwtProofManagerContractAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_MANAGER_ON_BASE_TESTNET || "";  
  const zkJwtProofManagerAbi = artifactOfZkJwtProofManager.abi;
  console.log(`zkJwtProofManagerContractAddress: ${zkJwtProofManagerContractAddress}`);
  return { zkJwtProofManagerContractAddress, zkJwtProofManagerAbi };
}

// export function callSmartContractFunction(contractAddress: string, abi: any, functionName: string, args: any[]) {
//   // @dev - Wagmi
//   //const { data: hash, writeContract } = useWriteContract();

//   writeContract({
//     address: contractAddress as `0x${string}`,
//     abi: abi,
//     functionName: functionName,
//     args: args
//   })

//   console.log("Transaction Hash: ", hash);
// }

/**
 * @notice - ZkJwtProofManager.sol# recordPublicInputsOfZkJwtProof() with Wagmi.
 */

// Custom hook for recording public inputs on-chain
export function recordPublicInputsOfZkJwtProof() {
  //const { data: hash, writeContract } = useWriteContract();

  // Returns an async function to call the contract
  return async function recordPublicInputsOfZkJwtProof(
    //_recordPublicInputsOfZkJwtProof: typeof writeContract,
    proof: Uint8Array,
    publicInputs: Array<string | number>,
    separatedPublicInputs: {
      domain: string;
      nullifierHash: string;
      //emailHash?: string;
      walletAddress: string;
      createdAt: string;
    }
  ) {
    // @dev - Set the ZkJwtProofManager contract instance
    const { zkJwtProofManagerContractAddress, zkJwtProofManagerAbi } = await setContractInstance();

    // @dev - Convert Uint8Array proof to hex string proofHex
    const proofHex = "0x" + Buffer.from(proof).toString("hex");
    console.log(`proofHex: ${proofHex}`);

    let tx: any;

    // _recordPublicInputsOfZkJwtProof({
    //   address: zkJwtProofManagerContractAddress as `0x${string}`,
    //   abi: zkJwtProofManagerAbi,
    //   functionName: "recordPublicInputsOfZkJwtProof",
    //   args: [proofHex, publicInputs, separatedPublicInputs]
    // });
  }
}
