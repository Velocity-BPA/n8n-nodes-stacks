/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const STACKS_NETWORKS = {
  mainnet: {
    name: 'Mainnet',
    coreApiUrl: 'https://api.mainnet.hiro.so',
    chainId: 1,
  },
  testnet: {
    name: 'Testnet',
    coreApiUrl: 'https://api.testnet.hiro.so',
    chainId: 2147483648,
  },
  devnet: {
    name: 'Devnet',
    coreApiUrl: 'http://localhost:3999',
    chainId: 2147483648,
  },
} as const;

export const BITCOIN_NETWORKS = {
  mainnet: {
    blockstream: 'https://blockstream.info/api',
    mempool: 'https://mempool.space/api',
  },
  testnet: {
    blockstream: 'https://blockstream.info/testnet/api',
    mempool: 'https://mempool.space/testnet/api',
  },
} as const;

export type StacksNetworkType = keyof typeof STACKS_NETWORKS;
export type BitcoinNetworkType = keyof typeof BITCOIN_NETWORKS;
