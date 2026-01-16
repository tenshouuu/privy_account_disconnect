import { createConfig } from '@privy-io/wagmi';
import { defineChain } from 'viem';
import { http } from 'wagmi';
import { DEFAULT_CHAIN_ID } from './const';

export const neuraTestnet = defineChain({
  id: DEFAULT_CHAIN_ID,
  name: 'Neura Testnet',
  testnet: true,
  nativeCurrency: { name: 'ANKR', symbol: 'ANKR', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.rpc.neuraprotocol.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Neura Explorer',
      url: 'https://testnet-blockscout.infra.neuraprotocol.io/',
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [neuraTestnet],
  transports: {
    [neuraTestnet.id]: http(),
  },
});
