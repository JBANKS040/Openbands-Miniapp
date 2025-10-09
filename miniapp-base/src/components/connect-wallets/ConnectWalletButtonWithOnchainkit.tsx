// @dev - CSS for OnchainKit components
import '@coinbase/onchainkit/styles.css';
import { color } from '@coinbase/onchainkit/theme';

// @dev - OnchainKit <Wallet> components
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename, // @dev - For displaying a "Basename"
  WalletAdvancedAddressDetails,
  WalletAdvancedTokenHoldings,
  WalletAdvancedTransactionActions,
  WalletAdvancedWalletActions,
  WalletDropdownDisconnect
} from '@coinbase/onchainkit/wallet';

// @dev - OnchainKit <Identity> components
import { Identity, Avatar, Name, Badge, Address, EthBalance } from '@coinbase/onchainkit/identity';

/**
 * @notice - A "Connect wallet" button component to connect an EVM wallet using OnchainKit's <Wallet /> component.
 */
export default function ConnectWalletButtonWithOnchainkit() {
  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>

        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownDisconnect />
          <WalletAdvancedWalletActions />
          <WalletAdvancedAddressDetails />
          <WalletAdvancedTransactionActions />
          <WalletAdvancedTokenHoldings />
        </WalletDropdown>
      </Wallet>
    </div>
  )
}