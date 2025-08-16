import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
import artifactOfZkJwtProofVerifier from './artifacts/ZkJwtProofVerifier.sol/ZkJwtProofVerifier.json';

/**
 * @notice - ZkJwtProofVerifier.sol#verifyZkJwtProof(), which the HonkVerifier# verify() isinternally called.
 */
export async function verifyZkJwtProof(signer: any, proof: any, publicInputs: any): Promise<{ isValidProof: boolean }> {
  // @dev - Create the ZkJwtProofVerifier contract instance
  const ZkJwtProofVerifierAddress: string = process.env.NEXT_PUBLIC_ZK_JWT_PROOF_VERIFIER_ON_BASE_TESTNET || "";
  const ZkJwtProofVerifierAbi: Array<any> = artifactOfZkJwtProofVerifier.abi;
  const zkJwtProofVerifier = new Contract(ZkJwtProofVerifierAddress, ZkJwtProofVerifierAbi, signer);

  // @dev - Convert Uint8Array proof to hex string proofHex
  const proofHex = "0x" + Buffer.from(proof).toString("hex");
  //const proofHex = uint8ArrayToHex(proof);
  console.log(`proofHex: ${proofHex}`);

  // @dev - Call the verifyZkJwtProof() in the ZkJwtProofVerifier.sol
  const isValidProof = await zkJwtProofVerifier.verifyZkJwtProof(proofHex, publicInputs);
  console.log(`Is a proof valid?: ${isValidProof}`);

  return { isValidProof };
}