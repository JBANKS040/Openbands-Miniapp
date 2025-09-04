import { Wallet } from '@coinbase/onchainkit/wallet';

/**
 * @notice - Connect to Ethereum using <Wallet /> component (icl. Wallet Modal) powered by BASE's OnChainKit.
 * @dev - ref). https://docs.base.org/onchainkit/wallet/wallet
 */
export async function connectToEvmWalletWithOnChainKit(): Promise<{ provider: BrowserProvider, signer: JsonRpcSigner }> {
  let signer: JsonRpcSigner | null = null;
  let provider: BrowserProvider | null = null;
  let network: Network | null = null;

  return { provider, signer };
}
