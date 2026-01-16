import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PRIVY_APP_ID } from './const';
import { neuraTestnet, wagmiConfig } from './config';

import { PrivySample } from './PrivySample';

const queryClient = new QueryClient();

export function AppPrivyProvider() {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        defaultChain: neuraTestnet,
        supportedChains: [neuraTestnet],
        // Ensure embedded wallets are enabled
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
          <PrivySample />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
