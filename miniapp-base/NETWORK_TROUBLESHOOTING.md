# Network Configuration and Troubleshooting

## RPC Configuration

The application uses multiple RPC endpoints for Base Mainnet with automatic fallback to ensure reliability:

1. **Primary**: Alchemy RPC (if `NEXT_PUBLIC_ALCHEMY_BASE_RPC_URL` is set)
2. **Fallback 1**: Coinbase official Base RPC
3. **Fallback 2**: Tenderly Base Gateway
4. **Fallback 3**: Default Wagmi RPC

## Environment Variables

To improve reliability, add these to your `.env.local`:

```bash
# Optional: Custom Alchemy RPC for Base Mainnet
NEXT_PUBLIC_ALCHEMY_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Required: Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Common Network Errors and Solutions

### "HTTP request failed" Error

This error indicates network connectivity issues. The app now includes:

- **Automatic Retries**: Up to 3 attempts with exponential backoff
- **Multiple RPC Endpoints**: Automatic fallback to reliable endpoints
- **Smart Error Handling**: Different messages for different error types

### Error Types and User Messages

- **Network Issues**: "Network connection failed. Please check your internet connection and try again."
- **Contract Errors**: "Smart contract execution failed. Please try again or contact support."
- **User Rejection**: "Transaction was rejected. Please try again and confirm the transaction."
- **Duplicate Proof**: "A given nullifierHash is already used, which means a given proof is already used."

### Troubleshooting Steps

1. **Check Internet Connection**: Ensure stable internet connectivity
2. **Try Again**: The retry logic will automatically attempt multiple times
3. **Custom RPC**: Set up a custom Alchemy or Infura RPC endpoint
4. **Network Status**: Check Base network status at https://status.base.org/

## Technical Details

The application uses Wagmi with fallback RPC configuration to handle network issues gracefully. The retry logic will not retry for certain errors like user rejection or duplicate nullifier hashes, but will retry for network connectivity issues.