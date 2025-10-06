import React, { useState, useEffect } from 'react';
import { createBaseAccountSDK, pay, getPaymentStatus } from '@base-org/account';
import { SignInWithBaseButton, BasePayButton } from '@base-org/account-ui/react';

//import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

/**
 * @notice - A button component to connect to a Base Account using the Base Account SDK.
 * @dev - ref (Base Account SDK - Web / Next.js): https://docs.base.org/base-account/quickstart/web-react
 */
export default function ConnectWalletButtonWithBaseAccountSDK() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize SDK with error handling
  const [sdk, setSdk] = useState<ReturnType<typeof createBaseAccountSDK> | null>(null);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // @dev - For authentication
  const [user, setUser] = useState<{ address: string; signature: string; timestamp: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    try {
      // Add a delay to ensure all dependencies are loaded
      const initializeSDK = async () => {
        try {
          const baseSDK = createBaseAccountSDK({
            appName: 'Base Account Quick-start',
            appLogoUrl: 'https://base.org/logo.png',
            appChainIds: [base.id], // @dev - chain ID for Base Mainnet
          });
          setSdk(baseSDK);
          setSdkError(null);
        } catch (error) {
          console.error('Failed to initialize Base Account SDK:', error);
          setSdkError(error instanceof Error ? error.message : 'Unknown error');
        }
      };
      
      // Small delay to ensure proper client-side initialization
      setTimeout(initializeSDK, 100);
    } catch (error) {
      console.error('Failed to initialize Base Account SDK:', error);
      setSdkError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [isClient]);

  // Optional sign-in step – not required for `pay()`, but useful to get the user address
  const handleSignIn = async () => {
    if (!sdk) {
      console.error('SDK not initialized');
      return;
    }
    try {
      // @dev - Get a provider and request wallet connection
      const provider = await sdk.getProvider().request({ method: 'wallet_connect' });
      console.log('provider:', provider);

      // @dev - Create a wallet client (if needed for further interactions)
      // const client = createWalletClient({
      //   chain: base,
      //   transport: custom(provider)
      // });

      setIsSignedIn(true);
      console.log('Sign in successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // One-tap USDC payment using the pay() function
  const handlePayment = async () => {
    try {
      const { id } = await pay({
        amount: '0.01', // USD – SDK quotes equivalent USDC
        to: '0xRecipientAddress', // Replace with your recipient address
        testnet: true // set to false or omit for Mainnet
      });

      setPaymentId(id);
      setPaymentStatus('Payment initiated! Click "Check Status" to see the result.');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('Payment failed');
    }
  };

  // Check payment status using stored payment ID
  const handleCheckStatus = async () => {
    if (!paymentId) {
      setPaymentStatus('No payment ID found. Please make a payment first.');
      return;
    }

    try {
      const { status } = await getPaymentStatus({ id: paymentId });
      setPaymentStatus(`Payment status: ${status}`);
    } catch (error) {
      console.error('Status check failed:', error);
      setPaymentStatus('Status check failed');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const dark = theme === 'dark';
  const styles = {
    container: { minHeight: '100vh', backgroundColor: dark ? '#111' : '#fff', color: dark ? '#fff' : '#000', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px' },
    card: { backgroundColor: dark ? '#222' : '#f9f9f9', borderRadius: '12px', padding: '30px', maxWidth: '400px', textAlign: 'center' as const },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: dark ? '#fff' : '#00f' },
    subtitle: { fontSize: '16px', color: dark ? '#aaa' : '#666', marginBottom: '30px' },
    themeToggle: { position: 'absolute' as const, top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
    buttonGroup: { display: 'flex', flexDirection: 'column' as const, gap: '16px', alignItems: 'center' },
    status: { marginTop: '20px', padding: '12px', backgroundColor: dark ? '#333' : '#f0f0f0', borderRadius: '8px', fontSize: '14px' },
    signInStatus: { marginTop: '8px', fontSize: '14px', color: dark ? '#0f0' : '#060' }
  };

  // Don't render on server side to avoid hydration issues
  if (!isClient) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Base Account</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
      <div style={styles.card}>
        <h1 style={styles.title}>Base Account</h1>
        <p style={styles.subtitle}>Experience seamless crypto payments</p>
        
        {sdkError && (
          <div style={{ ...styles.status, backgroundColor: dark ? '#441' : '#fee', color: dark ? '#f88' : '#c00' }}>
            <div>SDK Error: {sdkError}</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              Please check your internet connection and try refreshing the page.
            </div>
          </div>
        )}
        
        {!sdk && !sdkError && (
          <div style={styles.status}>
            Initializing Base Account SDK...
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          {sdk && (
            <>
              <SignInWithBaseButton 
                align="center"
                variant="solid"
                colorScheme={theme}
                onClick={handleSignIn}
              />
              
              {loading && (
                <div style={styles.status}>
                  Signing in...
                </div>
              )}
              
              {error && (
                <div style={{ ...styles.status, backgroundColor: dark ? '#441' : '#fee', color: dark ? '#f88' : '#c00' }}>
                  {error}
                </div>
              )}
              
              {isSignedIn && !loading && !error && (
                <div style={styles.signInStatus}>
                  ✅ Connected to Base Account
                  {user && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Signed in at: {new Date(user.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )}
              
              <BasePayButton 
                colorScheme={theme}
                onClick={handlePayment}
              />
              
              {paymentId && (
                <button 
                  onClick={handleCheckStatus}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                    color: theme === 'dark' ? '#ffffff' : '#1f2937',
                    border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Check Payment Status
                </button>
              )}
            </>
          )}
        </div>

        {paymentStatus && (
          <div style={styles.status}>
            {paymentStatus}
          </div>
        )}
      </div>
    </div>
  );
}