import React, { useState, useEffect } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { base } from 'viem/chains';

import { reconnect, getConnections } from '@wagmi/core';
import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config-with-onchainkit';

/**
 * @notice - Set up and return the RainbowKit config and React Query client
 */
export function setConfigAndQueryClient(): { config: Config, queryClient: QueryClient } {
  // Set up config
  const config = wagmiConfig;

  // @dev - React Query Client for RainbowKit
  const queryClient = new QueryClient();

  return { config, queryClient };
}

/**
 * @notice - A button component to connect to a Base Account using the Base Account SDK and other EVM wallets.
 */
export default function ConnectWalletButtonWithBaseAccountSDKAndOtherEvmWallets() {
  const [sdk, setSdk] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize SDK
    const sdkInstance = createBaseAccountSDK({
      appName: 'My DApp',
      appLogoUrl: 'https://example.com/logo.png',
      appChainIds: [base.id],
    });

    setSdk(sdkInstance);
    setProvider(sdkInstance.getProvider());
  }, []);

  const connectWallet = async () => {
    if (!provider) return;

    setIsConnecting(true);
    try {
      // This displays the wallet connection UI
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
        params: []
      });

      setAccount(accounts[0]);
      console.log('Connected account:', accounts[0]);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const signMessage = async () => {
    if (!provider || !account) return;

    try {
      const message = 'Hello from Base Account!';
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account]
      });

      console.log('Signature:', signature);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <div>
      {!account ? (
        <button 
          onClick={connectWallet} 
          disabled={isConnecting || !provider}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <button onClick={signMessage}>Sign Message</button>
        </div>
      )}
    </div>
  );
}
