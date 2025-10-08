/**
 * Configuration for a wallet modal using the Wallet component of OnchainKit.
 */
export const walletModalConfig = {
  appearance: {
    name: 'OpenBands MiniApp',     // Displayed in modal header
    logo: 'https://your-logo.com', // Displayed in modal header
    mode: 'dark',                  // 'light' | 'dark' | '400'
    theme: 'default',              // 'default' or custom theme
  },
  wallet: {
    display: 'modal',
    termsUrl: 'https://...',
    privacyUrl: 'https://...',
    supportedWallets: { 
      rabby: true, 
      trust: true, 
      frame: true, 
    }, 
  },
}