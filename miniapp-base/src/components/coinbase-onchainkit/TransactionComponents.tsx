// @noErrors: 2307
import { useCallback } from 'react';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction
} from '@coinbase/onchainkit/transaction'; 

import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { calls } from '@/lib/blockchains/evm/coinbase-onchainkit/calls'; 
import { useHonkVerifier } from '@/lib/blockchains/evm/smart-contracts/honk-verifier';
//import { contracts } from '@/contracts';

const BASE_MAINNET_CHAIN_ID = 8453;
const BASE_SEPOLIA_TESTNET_CHAIN_ID = 84532;

/**
 * @notice - This component handles the transaction process for a user.
 * @dev - More details: https://docs.base.org/onchainkit/transaction/transaction#walkthrough
 */
export default function TransactionComponents() {
  const { address } = useAccount();

  const handleOnStatus = useCallback((status: LifecycleStatus) => {  
    console.log('Transaction status:', status); 
  }, []); 

  return address ? (
    <Transaction
      chainId={BASE_MAINNET_CHAIN_ID}
      calls={calls}
      isSponsored={true}
      contracts={contracts}
      onStatus={handleOnStatus}
    >
      <TransactionButton />
      <TransactionSponsor />
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
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


import type { TransactionError } from "@coinbase/onchainkit/transaction";
import type { Address, TransactionReceipt } from "viem";
// ---cut-before---
type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: TransactionError;
    }
  | {
      statusName: 'transactionIdle'; // initial status prior to the mutation function executing
      statusData: null;
    }
  | {
      statusName: 'buildingTransaction'; // resolving calls or contracts promise
      statusData: null;
    }
  | {
      statusName: 'transactionPending'; // if the mutation is currently executing
      statusData: null;
    }
  | {
      statusName: 'transactionLegacyExecuted';
      statusData: {
        transactionHashList: string[];
      };
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
      };
    };