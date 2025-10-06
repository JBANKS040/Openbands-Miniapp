import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'viem/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';


export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'My OnchainKit App',
      preference: 'smartWalletOnly',
      version: '4',
    }),
    metaMask(), // Add additional connectors
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}