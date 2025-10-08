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

/**
 * Custom theme configuration for OnchainKit wallet modal colors
 */
export const customWalletTheme = {
  '--ck-connectkit-background': '#ffffff',
  '--ck-connectkit-body-background': '#ffffff', 
  '--ck-primary-button-background': '#0052ff',
  '--ck-primary-button-hover-background': '#0041cc',
  '--ck-secondary-button-background': '#f6f7f9',
  '--ck-secondary-button-hover-background': '#e1e4e8',
  '--ck-focus-color': '#0052ff',
  '--ck-border-radius': '16px',
  '--ck-connectkit-border-radius': '16px',
}