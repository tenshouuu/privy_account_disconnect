import { DEFAULT_CHAIN_ID } from '@/modules/const';
import {
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export function PrivySample() {
  const { authenticated, ready, user } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { address } = useAccount();
  console.log('Privy user', user);
  console.log('Wallets', wallets);
  console.log('Wagmi address', address);

  const { signMessage } = useSignMessage();
  const { logout } = useLogout();

  const { login } = useLogin();

  const [isSigning, setIsSigning] = useState(false);
  const [signResult, setSignResult] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  const walletAccount = address || user?.wallet?.address || null;
  const isConnected = ready && authenticated && walletsReady;
  const hasValidWallet = user?.wallet && wallets.length > 0;

  // Reset state when connection status changes
  useEffect(() => {
    setSignResult(null);
    setSignError(null);
    setIsSigning(false);
  }, [isConnected]);


  // Handle transaction signing with chainId
  const handleSignTransaction = async () => {
    if (!walletAccount) {
      setSignError('No account or wallet address available');
      return;
    }

    if (!user?.wallet) {
      setSignError('No active Privy wallet found. Please ensure wallet is properly initialized.');
      return;
    }

    if (wallets.length === 0) {
      setSignError('No wallets available. Please connect a wallet.');
      return;
    }

    setIsSigning(true);
    setSignError(null);
    setSignResult(null);

    try {
      // Create a message that represents the transaction data
      const transactionData = {
        to: walletAccount,
        value: '0',
        gas: '21000',
        gasPrice: '20000000000',
        nonce: '0',
        data: '0x',
        chainId: DEFAULT_CHAIN_ID,
      };
      
      const message = JSON.stringify(transactionData);
      console.log('Starting transaction signing with message:', message);
      
      const signature = await signMessage({ message });
      console.log('Transaction signed successfully');
      setSignResult(`Transaction signed successfully! Signature: ${signature}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSignError(`Failed to sign transaction: ${errorMessage}`);
      console.error('Transaction signing error:', error);
    } finally {
      setIsSigning(false);
    }
  };

  if (isConnected) {
    return <div>
      <h2>Connected</h2>
      <br/>

      <p>
        <b>useAccount address:</b> {address || 'Account address not found'}
      </p>
      <br/>

      <p>
        <b>useWallets wallets:</b> {wallets.length > 0 ? wallets.map((wallet) => <div key={wallet.address}>{wallet.address}</div>) : 'No wallets found'}
      </p>
      <br/>

      <p>
        <b>usePrivy user.wallet.address:</b> {user?.wallet?.address || 'No privy user wallet found'}
      </p>
      <br/>

      <p style={{
        padding: '10px',
        backgroundColor: hasValidWallet ? '#d4edda' : '#f8d7da',
        borderRadius: '5px',
        color: hasValidWallet ? '#155724' : '#721c24'
      }}>
        <b>Wallet Status:</b> {hasValidWallet ? '✅ Ready to sign' : '❌ Wallet not ready'}
      </p>
      <br/>

      <button
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'white',
          marginBottom: '20px',
        }}
        onClick={() => logout()}>Logout
      </button>
      <br/>
      <br/>

      {/* Transaction signing button */}
      <button
        onClick={handleSignTransaction}
        disabled={isSigning || !hasValidWallet}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: isSigning || !hasValidWallet ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          backgroundColor: hasValidWallet ? 'green' : '#ccc',
          color: 'white',
          marginBottom: '20px',
        }}
      >
        {isSigning ? 'Signing...' : 'Sign Transaction'}
      </button>

      {/* Results display */}
      {signResult && (
        <div style={{
          marginTop: '10px',
          padding: '15px',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          maxWidth: '600px',
          wordBreak: 'break-all'
        }}>
          <strong>✅ Success:</strong> {signResult}
        </div>
      )}

      {signError && (
        <div style={{
          marginTop: '10px',
          padding: '15px',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          maxWidth: '600px',
          wordBreak: 'break-all'
        }}>
          <strong>❌ Error:</strong> {signError}
        </div>
      )}
    </div>
  }

  return (<div>
    <h2>Not Connected</h2>

    <br/>

    <button
      onClick={() => login()}
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'white',
        marginBottom: '20px',
      }}
    >
      Login
    </button>
  </div>);
}
