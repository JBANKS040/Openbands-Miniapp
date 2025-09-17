"use client";
import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useApp } from "@/context/AppContext";
import { write } from "fs";
import { generateZkJwtProof } from "@/lib/circuits/zk-jwt-proof-generation";
import type { UserInfo, GoogleJwtPayload, JWK, PublicInputs } from "@/lib/types";
import { extractDomain } from "@/lib/google-jwt/google-jwt";
import { hashEmail } from "@/lib/blockchains/evm/utils/convert-string-to-poseidon-hash";

// @dev - Ethers.js related imports
// import { BrowserProvider, JsonRpcSigner } from "ethers";
// //import { connectToEvmWallet } from "../lib/blockchains/evm/connect-wallets/connect-to-evm-wallet";
// import { verifyViaHonkVerifier } from "../lib/blockchains/evm/smart-contracts/ethers-js/honk-verifier";
// import { verifyZkJwtProof } from "../lib/blockchains/evm/smart-contracts/ethers-js/zk-jwt-proof-verifier";
// import { 
//   //recordPublicInputsOfZkJwtProof,
//   getPublicInputsOfZkJwtProof, 
//   getNullifiersByDomainAndWalletAddresses
//   //getNullifiersByDomainAndEmailHashAndWalletAddresses
// } from "@/lib/blockchains/evm/smart-contracts/ethers-js/zk-jwt-proof-manager";

// @dev - Wagmi related imports
import {
  //recordPublicInputsOfZkJwtProof,
  setZkJwtProofManagerContractInstance,
  zkJwtProofManagerContractConfig,
} from "@/lib/blockchains/evm/smart-contracts/wagmi/zk-jwt-proof-manager";
//import { useWriteContract, useReadContract } from 'wagmi'
import { simulateContract, writeContract, readContract, getAccount } from '@wagmi/core'
import { wagmiConfig } from "@/lib/blockchains/evm/smart-contracts/wagmi/config";

// @dev - Utility function to convert a ZK Proof to Hex
import { convertProofToHex } from "@/lib/blockchains/evm/utils/convert-proof-to-hex";

// @dev - Spinner component
import { Spinner } from "@/components/circuits/Spinner";

export function SignInPanel() { // @dev - For Wagmi
//export function SignInPanel({ provider, signer }: { provider: BrowserProvider; signer: JsonRpcSigner }) { // @dev - For ethers.js
  const { signIn } = useApp();

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: "", idToken: "" });
  const [error, setError] = useState<string | null>(null);
  
  // Check if we have a real Google Client ID
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasValidGoogleClientId = googleClientId && googleClientId !== "";
  
  // [NOTE]: Hooks must be at the top level for a write contract function call
  //const { writeContract: recordPublicInputsOfZkJwtProof, isPending: recordPublicInputsOfZkJwtProofIsPending } = useWriteContract();

  const onSuccess = async(resp: CredentialResponse) => {
    // @dev - Display a loading spinner
    setLoading(true);

    if (!resp.credential) return;
    
    try {
      const decoded = jwtDecode<GoogleJwtPayload>(resp.credential);
      const email = decoded.email;
      if (!email) return;

      setUserInfo({
        email: decoded.email,
        idToken: resp.credential
      });

      // @dev - Log (NOTE: This should be removed later)
      console.log(`decoded: ${JSON.stringify(decoded, null, 2)}`);
      console.log(`User email: ${email}`);

      // @dev - Extract a domain from an email
      const domainFromGoogleJwt = extractDomain(email);
      console.log(`Extracted domain (from JWT): ${domainFromGoogleJwt}`);

      // @dev - Hash an email
      const hashedEmailFromGoogleJwt = hashEmail(email);
      console.log('a hashed email (from JWT):', hashedEmailFromGoogleJwt);

      // @dev - Get a wallet address from a connected wallet via Wagmi
      const accountViaWagmi = getAccount(wagmiConfig);
      console.log(`accountViaWagmi:`, accountViaWagmi);

      const walletAddressFromConnectedWallet = accountViaWagmi.address;
      //const walletAddressFromConnectedWallet = getAccount(wagmiConfig).address;
      //const walletAddressFromConnectedWallet = signer.address;
      console.log(`walletAddressFromConnectedWallet`, walletAddressFromConnectedWallet);

      // @dev - Set the ZkJwtProofManager contract instance (contract address + ABI)
      const { zkJwtProofManagerContractAddress, zkJwtProofManagerAbi } = setZkJwtProofManagerContractInstance();

      // @dev - Retrieve a nullifierHash, which is stored on-chain and is associated with a given wallet address
      const nullifierFromOnChainByDomainAndWalletAddress = await readContract(wagmiConfig, {
        abi: zkJwtProofManagerAbi,
        address: zkJwtProofManagerContractAddress as `0x${string}`,
        functionName: 'getNullifiersByDomainAndWalletAddress',
        args: [domainFromGoogleJwt, walletAddressFromConnectedWallet]
      });
      //const { nullifierFromOnChainByDomainAndWalletAddress } = await getNullifiersByDomainAndWalletAddress(signer, domainFromGoogleJwt);
      //const { nullifierFromOnChainByDomainAndEmailHashAndWalletAddress } = await getNullifiersByDomainAndEmailHashAndWalletAddress(signer, domainFromGoogleJwt, hashedEmailFromGoogleJwt);
      console.log(`nullifier (from on-chain) by a domain, wallet address: ${nullifierFromOnChainByDomainAndWalletAddress}`);

      // @dev - If there is no nullifierFromOnChain, which is stored on-chain and is associated with a given wallet address, it will be recorded on-chain (BASE).
      if (nullifierFromOnChainByDomainAndWalletAddress == "0x0000000000000000000000000000000000000000000000000000000000000000") {
        // @dev - Generate a zkJWT proof
        const { proof, publicInputs } = await generateZkJwtProof(decoded.email, resp.credential);

        // @dev - Log (NOTE: The data type of a given proof and publicInputs are "object". Hence, the ${} method can not be used in the console.log())
        console.log(`Generated zkJWT proof:`, proof);
        console.log(`Generated zkJWT public inputs:`, publicInputs);
        //console.log(`Generated zkJWT proof: ${proof}`);
        //console.log(`Generated zkJWT public inputs: ${JSON.stringify(publicInputs, null, 2)}`);

        // @dev - Extract domain from email (instead of trying to decode from public inputs)
        const domainFromZkJwtCircuit = extractDomain(decoded.email);
        console.log(`domain (from email): ${domainFromZkJwtCircuit}`); // @dev - i.e. "example-company.com"

        // @dev - Smart contract interactions via ethers.js
        //console.log(`signer (in the SignInPanel):`, signer); // @dev - The data type of "signer" is an "object" type.

        //const { isValidProofViaHonkVerifier } = await verifyViaHonkVerifier(signer, proof, publicInputs);
        //console.log(`Is a proof valid via the HonkVerifier?: ${isValidProofViaHonkVerifier}`);  // @dev - [Error]: PublicInputsLengthWrong()

        //const { isValidProof } = await verifyZkJwtProof(signer, proof, publicInputs);
        //console.log(`Is a proof valid via the ZkJwtProofVerifier?: ${isValidProof}`);

        // @dev - Prepare separated public inputs for the smart contract
        const nullifierFromZkJwtCircuit = publicInputs[publicInputs.length - 1]; // @dev - The nullifier is the last of the public inputs
        console.log(`nullifier (from zkJWT circuit): ${nullifierFromZkJwtCircuit}`);

        const separatedPublicInputs = {
          domain: domainFromZkJwtCircuit,
          //domain: decoded.email.split('@')[1], // Extract domain from email
          nullifierHash: nullifierFromZkJwtCircuit,
          emailHash: "0x0000000000000000000000000000000000000000000000000000000000000000", // [TODO]: A proper hashing method is to be considered later.
          //emailHash: hashedEmailFromGoogleJwt,  // [TODO]: A proper hashing method is to be considered later.
          walletAddress: walletAddressFromConnectedWallet,
          createdAt: new Date().toISOString() // Current timestamp
        };

        try {
          // @dev - Convert Uint8Array proof to hex string proofHex
          const proofHex = convertProofToHex(proof);
          console.log(`proofHex: ${proofHex}`);

          // @dev - Call the ZkJwtProofManager#recordPublicInputsOfZkJwtProof() with Wagmi
          const { request } = await simulateContract(wagmiConfig, {
          //recordPublicInputsOfZkJwtProof({
            abi: zkJwtProofManagerAbi,
            address: zkJwtProofManagerContractAddress as `0x${string}`,
            functionName: 'recordPublicInputsOfZkJwtProof',
            args: [proofHex, publicInputs, separatedPublicInputs]
          });
          const txHash = await writeContract(wagmiConfig, request);
          console.log(`Transaction hash: ${txHash}`);
          //const { txReceipt } = await recordPublicInputsOfZkJwtProof(signer, proof, publicInputs, separatedPublicInputs);
          //console.log(`txReceipt: ${JSON.stringify(txReceipt, null, 2)}`);

          // @dev - Sign in after the public inputs are recorded on-chain, which a txHash is filled.
          // @dev - [NOTE]: We'll discard the email/token for privacy and just sign in anonymously
          if (txHash) {
            signIn(domainFromZkJwtCircuit);
          }
        } catch (error) {
          console.error('Error to record public inputs on-chain (BASE):', error);
        }

        // We'll discard the email/token for privacy and just sign in anonymously
        //signIn(domainFromZkJwtCircuit);
      } else if (nullifierFromOnChainByDomainAndWalletAddress != "0x0000000000000000000000000000000000000000000000000000000000000000") {
        // @dev - Get a domain from JWT and wallet address from a connected wallet
        //const domainFromGoogleJwt = extractDomain(decoded.email);

        // @dev - Get public inputs from on-chain
        const publicInputsFromOnChain: PublicInputs = await readContract(wagmiConfig, {
            abi: zkJwtProofManagerAbi,
            address: zkJwtProofManagerContractAddress as `0x${string}`,
            functionName: 'getPublicInputsOfZkJwtProof',
            args: [nullifierFromOnChainByDomainAndWalletAddress]
        }) as PublicInputs;
        console.log(`publicInputs (from on-chain): ${JSON.stringify(publicInputsFromOnChain, null, 2)}`);

        const _domainFromOnChain: string = publicInputsFromOnChain.domain;
        const _nullifierFromOnChain: string = publicInputsFromOnChain.nullifierHash;
        //const _hashedEmailFromOnChain: string = publicInputsFromOnChain.emailHash;  // [TODO]: A proper hashing method is to be considered later.
        const _walletAddressFromOnChain: string = publicInputsFromOnChain.walletAddress;
        console.log(`_domainFromOnChain: ${_domainFromOnChain}`);
        console.log(`_nullifierFromOnChain: ${_nullifierFromOnChain}`);
        //console.log(`_hashedEmailFromOnChain: ${_hashedEmailFromOnChain}`);  // [TODO]: A proper hashing method is to be considered later.
        console.log(`_walletAddressFromOnChain: ${_walletAddressFromOnChain}`);

        if (
          _domainFromOnChain === domainFromGoogleJwt && 
          _nullifierFromOnChain === nullifierFromOnChainByDomainAndWalletAddress && 
          //_hashedEmailFromOnChain === hashedEmailFromGoogleJwt && // [TODO]: A proper hashing method is to be considered later.
          _walletAddressFromOnChain === walletAddressFromConnectedWallet
        ) {
          // We'll discard the email/token for privacy and just sign in anonymously
          signIn(domainFromGoogleJwt);
        }
      } else {
        //return;
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Failed to authenticate with Google');
    } finally {
      setLoading(false); // @dev - Once a zkJWT proof is generated and a on-chain transaction is successful, a loading spinner is going to be hidden.
    }
  };

  return (
    <div className="bg-gray-50 p-3">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Welcome to OpenBands</h1>
          <p className="text-gray-600 text-sm">
            The anonymous social network for verified employees
          </p>
        </div>

        {/* Sign-in Card */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h2>
            <p className="text-sm text-gray-600">
              Sign in with your work email
            </p>
          </div>

          <div className="flex justify-center">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Spinner size={24} color="#2563eb" />
                <span>Signing in...</span>
                {/* <span className="animate-spin">🔄</span> */}
              </div>
            ) : hasValidGoogleClientId ? (
              <GoogleLogin
                onSuccess={onSuccess}
                onError={() => console.error('Login Failed')}
                useOneTap
                theme="outline"
                size="large"
                disabled={loading}
              />
            ) : (
              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Google OAuth is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-blue-900">How it works</p>
                <p className="text-xs text-blue-700 mt-1">
                  You create a cryptographic proof of your company email. <br/><br/>All personal information is kept private.<br/><br/> Only your company domain is visible. E.g. &quot;openbands.xyz&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
