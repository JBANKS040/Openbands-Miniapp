"use client";
import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useApp } from "@/context/AppContext";
import { generateZkJwtProof } from "@/lib/circuits/zk-jwt-proof-generation";
import type { UserInfo, GoogleJwtPayload, JWK } from "@/lib/types";

// @dev - Blockchain related imports
import { connectToEvmWallet } from "../lib/blockchains/evm/connect-wallets/connect-to-evm-wallet";
import { verifyZkJwtProof } from "../lib/blockchains/evm/smart-contracts/zk-jwt-proof-verifier";
import { recordPublicInputsOfZkJwtProof } from "../lib/blockchains/evm/smart-contracts/zk-jwt-proof-manager";

export function SignInPanel() {
  const { signIn } = useApp();

  const [userInfo, setUserInfo] = useState<UserInfo>({ email: "", idToken: "" });
  const [error, setError] = useState<string | null>(null);
  
  const onSuccess = async(resp: CredentialResponse) => {
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

      // @dev - Generate a zkJWT proof 
      const { proof, publicInputs } = await generateZkJwtProof(decoded.email, resp.credential);

      // @dev - Log (NOTE: The data type of a given proof and publicInputs are "object". Hence, the ${} method can not be used in the console.log())
      console.log(`Generated zkJWT proof:`, proof);
      console.log(`Generated zkJWT public inputs:`, publicInputs);
      //console.log(`Generated zkJWT proof: ${proof}`);
      //console.log(`Generated zkJWT public inputs: ${JSON.stringify(publicInputs, null, 2)}`);

      // @dev - Smart contract interactions
      const { provider, signer } = await connectToEvmWallet(); // @dev - Connect to EVM wallet (i.e. MetaMask) on page load
      console.log(`signer (in the SignInPanel): ${JSON.stringify(signer, null, 2)}`);

      const { isValidProof } = await verifyZkJwtProof(signer, proof, publicInputs);
      console.log(`Is a proof valid?: ${isValidProof}`);

      const { txReceipt } = await recordPublicInputsOfZkJwtProof(signer, proof, publicInputs);
      console.log(`txReceipt: ${JSON.stringify(txReceipt, null, 2)}`);

      // We'll discard the email/token for privacy and just sign in anonymously
      signIn();
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Failed to authenticate with Google');
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
            <GoogleLogin
              onSuccess={onSuccess}
              onError={() => console.error('Login Failed')}
              useOneTap
              theme="outline"
              size="large"
            />
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
