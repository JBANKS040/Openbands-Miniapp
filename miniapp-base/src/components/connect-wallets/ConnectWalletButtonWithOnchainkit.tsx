import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletAdvancedAddressDetails,
  WalletAdvancedTokenHoldings,
  WalletAdvancedTransactionActions,
  WalletAdvancedWalletActions,
  WalletDropdownDisconnect
} from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Badge, Address } from '@coinbase/onchainkit/identity';

export default function ConnectWalletButtonWithOnchainkit() {
  return (
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>

      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          {/* <EthBalance /> */}
        </Identity>
        <WalletDropdownDisconnect />
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
      </WalletDropdown>
    </Wallet>
  )
}