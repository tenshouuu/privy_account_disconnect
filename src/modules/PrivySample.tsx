import { DEFAULT_CHAIN_ID } from '@/modules/const';
import {
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
  useCrossAppAccounts,
  CrossAppAccount, useSignTransaction,
} from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function PrivySample() {
  const { authenticated, ready, user } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { address } = useAccount();
  console.log('Privy user', user, wallets);

  const { signTransaction } = useSignTransaction();
  const { logout } = useLogout();

  const { login } = useLogin();

  const [isSigning, setIsSigning] = useState(false);
  const [signResult, setSignResult] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  const walletAccount = address || null;
  const isConnected = ready && authenticated && walletsReady;

  // Reset state when connection status changes
  useEffect(() => {
    setSignResult(null);
    setSignError(null);
    setIsSigning(false);
  }, [isConnected]);


  // Handle transaction signing with chainId
  const handleSignTransaction = () => {
    if (!walletAccount) {
      setSignError('No account or wallet address available');
      return;
    }

    // Base transaction properties
    const baseTransactionProps = {
      to: walletAccount, // Self-transfer to same address
      value: '0', // 0 ETH
      gas: '21000', // Standard gas limit for simple transfers
      gasPrice: '20000000000', // 20 gwei
      nonce: '0',
      data: '0x', // Empty data
    };

    setIsSigning(true);
    setSignError(null);
    setSignResult(null);

    const testTransaction = {
      ...baseTransactionProps,
      chainId: DEFAULT_CHAIN_ID,
    };

    void signTransaction(testTransaction)
      .then((signature => {
        console.log('Signing transaction with chainId:', testTransaction);
        setSignResult(`Transaction signed successfully! Signature: ${signature}`);
      }))
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setSignError(`Failed to sign transaction: ${errorMessage}`);
        console.error('Transaction signing error:', error);
      })
      .finally(() => setIsSigning(false));
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
        <b>useWallets wallets:</b> {wallets.length > 0 ? wallets.map((wallet) => <div>{wallet.address}</div>) : 'No wallets found'}
      </p>
      <br/>

      <p>
        <b>usePrivy user.wallet.address:</b> {user?.wallet?.address || 'No privy user wallet found'}
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
        disabled={isSigning}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: isSigning ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          backgroundColor: 'green',
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
