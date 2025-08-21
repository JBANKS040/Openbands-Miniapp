// import { ethers, BrowserProvider, JsonRpcSigner, Network } from "ethers";
// import { parseUnits } from "ethers";
// import { HDNodeWallet } from "ethers/wallet";

// import { EthereumProvider } from "./data-types";

/**
 * @notice - Connect an EVM wallet to BASE Mainnet/Testnet with a MiniKitProvider
 * @dev - ref). https://docs.base.org/mini-apps/technical-reference/minikit/overview#minikitprovider
 */
export async function connectEvmWalletWithMiniKitProvider(): Promise<{ provider: BrowserProvider, signer: JsonRpcSigner }> {
  let signer: JsonRpcSigner | null = null;
  let provider: BrowserProvider | null = null;
  let network: Network | null = null;

  // //let window: Window = { ethereum: undefined };
  // console.log("window.ethereum:", window.ethereum);

  // if (window.ethereum == null) {
  //   // If Web3 EVM Wallet (i.e. MetaMask) is not installed, throw an error since we need a signer
  //   throw new Error("MetaMask or compatible Web3 wallet not found. Please install MetaMask to continue.");
  // } else {

  //   // Connect to the MetaMask EIP-1193 object. 
  //   // This is a standard protocol that allows Ethers access to make all read-only requests through MetaMask.
  //   provider = new ethers.BrowserProvider(window.ethereum);
  //   console.log("provider (in the connectToEvmWallet():", provider); // [Log]: Successfully retrieved the log

  //   // @dev - Check network info
  //   network = await provider.getNetwork();
  //   console.log(`network: ${ JSON.stringify(network, null, 2) }`);   

  //   // [Log]: Network info retrieved
  //   // 
  //   // network: {
  //   //   "name": "base-sepolia",
  //   //   "chainId": "84532"
  //   // }

  //   // @dev - Request account access first (in order to avoid a "empty signer/provider" error due to lack of setting a signer/provider - particularly when a user open the index page on a web browser at the first time of the day).
  //   await window.ethereum.request({ method: 'eth_requestAccounts' });

  //   // It also provides an opportunity to request access to write operations, which will be performed by the private key that MetaMask manages for the user.
  //   signer = await provider.getSigner();
  //   console.log("signer (in the connectToEvmWallet():", signer); // [Log]: "JsonRpcSigner {provider: BrowserProvider, address: '0x...'}"
  // }

  return { provider, signer }; // Return the resolved value
}
