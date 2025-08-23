import { Transaction, TransactionButton, LifecycleStatus} from '@coinbase/onchainkit/transaction';
import { baseSepolia } from 'wagmi/chains';

// ---cut-before---

const callsCallback = async () => { 
  const res = await fetch('api.transaction.com/createTransaction'); 
  const callData = await res.json(); 
  return callData; 
} 

export default function TransactionWithCalls() {

  return (
    <Transaction
      chainId={baseSepolia.id}
      calls={callsCallback}
      onStatus={(status: LifecycleStatus) => console.log('Transaction status:', status)}
    >
      <TransactionButton />
    </Transaction>
  );
}