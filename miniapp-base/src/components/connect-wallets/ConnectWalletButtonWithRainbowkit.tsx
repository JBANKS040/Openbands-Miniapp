// components/ConnectWalletButton.tsx
'use client'
import { useState, useEffect } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, Config } from 'wagmi';
import { base } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

// @dev - Blockchain related imports
//import { connectToEvmWallet } from '../../lib/blockchains/evm/connect-wallets/connect-to-evm-wallet';

/**
 * @notice - A button component to connect to an EVM wallet (e.g., MetaMask) by using the RainbowKit
 */
export default function ConnectWalletButtonWithRainbowkit() {
  //const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      // const { provider, signer } = await connectToEvmWallet(); // @dev - Connect to EVM wallet (i.e. MetaMask) on page load
      // const accounts = await provider.send("eth_requestAccounts", []);
      // setAccount(accounts[0]); // @dev - To always link an connected-wallet address and display it - even if a web browser is refreshed.
    }
    init();
  }, []);

  return (
    <ConnectButton />
  );
}


export function setConfigAndQueryClient(): { config: Config, queryClient: QueryClient } {
  // Set up config for RainbowKit
  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [base],
    //chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

  // @dev - React Query Client for RainbowKit
  const queryClient = new QueryClient();

  return { config, queryClient };
}