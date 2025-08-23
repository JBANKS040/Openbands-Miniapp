// @dev - Blockchain related imports
import artifactOfHonkVerifier from '../smart-contracts/artifacts/honk_vk.sol/HonkVerifier.json';

const honkVerifierContractAddress: string = process.env.NEXT_PUBLIC_HONK_VERIFIER_ON_BASE_MAINNET || "";
const honkVerifierAbi = artifactOfHonkVerifier.abi[0] as const;

// [
//   { 
//     "type": "function",
//     "name": "verify",
//     "inputs": [
//         {
//             "name": "proof",
//             "type": "bytes",
//             "internalType": "bytes"
//         },
//         {
//             "name": "publicInputs",
//             "type": "bytes32[]",
//             "internalType": "bytes32[]"
//         }
//     ],
//     "outputs": [
//         {
//             "name": "",
//             "type": "bool",
//             "internalType": "bool"
//         }
//     ],
//     "stateMutability": "view"
//   }
// ]

export const honkVerifierCalls = [
  {
    to: honkVerifierContractAddress as `0x${string}`,
    data: '0xea50d0e4' as `0x${string}`, // click() function selector
  }
];