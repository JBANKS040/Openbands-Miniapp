// @noErrors: 2307
import { useCallback } from 'react';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction'; 
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { calls } from '@/lib/blockchains/evm/coinbase-onchainkit/calls'; 

const BASE_MAINNET_CHAIN_ID = 8453;
const BASE_SEPOLIA_TESTNET_CHAIN_ID = 84532;

/**
 * @notice - This component handles the transaction process for a user.
 * @dev - More details: https://docs.base.org/onchainkit/transaction/transaction#walkthrough
 */
export default function TransactionComponents() {
  const { address } = useAccount();

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  return address ? (
    <Transaction
      chainId={BASE_MAINNET_CHAIN_ID}
      calls={calls}
      onStatus={handleOnStatus}
    >
      <TransactionButton />
      <TransactionSponsor />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  ) : (
    <Wallet>
      <ConnectWallet>
        <Avatar className='h-6 w-6' />
        <Name />
      </ConnectWallet>
    </Wallet>
  );
};