/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const API_ENDPOINTS = {
  // Account endpoints
  accountBalance: (address: string) => `/extended/v1/address/${address}/balances`,
  accountStxBalance: (address: string) => `/extended/v1/address/${address}/stx`,
  accountTransactions: (address: string) => `/extended/v1/address/${address}/transactions`,
  accountAssets: (address: string) => `/extended/v1/address/${address}/assets`,
  accountNonces: (address: string) => `/extended/v1/address/${address}/nonces`,
  accountMempoolTransactions: (address: string) => `/extended/v1/address/${address}/mempool`,

  // Transaction endpoints
  transaction: (txId: string) => `/extended/v1/tx/${txId}`,
  transactionRaw: (txId: string) => `/extended/v1/tx/${txId}/raw`,
  transactions: '/extended/v1/tx',
  transactionBroadcast: '/v2/transactions',
  mempoolTransactions: '/extended/v1/tx/mempool',

  // Block endpoints
  blocks: '/extended/v1/block',
  block: (hashOrHeight: string | number) => `/extended/v1/block/${hashOrHeight}`,
  blockByHeight: (height: number) => `/extended/v1/block/by_height/${height}`,
  blockTransactions: (hashOrHeight: string | number) => `/extended/v1/block/${hashOrHeight}/txs`,
  latestBlock: '/extended/v1/block?limit=1',

  // Burn block endpoints
  burnBlocks: '/extended/v1/burnchain/blocks',
  burnBlock: (heightOrHash: string | number) => `/extended/v1/burnchain/block/${heightOrHash}`,

  // Microblock endpoints
  microblocks: '/extended/v1/microblock',
  microblock: (hash: string) => `/extended/v1/microblock/${hash}`,
  unanchoredMicroblocks: '/extended/v1/microblock/unanchored/txs',

  // Mempool endpoints
  mempoolStats: '/extended/v1/tx/mempool/stats',
  droppedMempool: '/extended/v1/tx/mempool/dropped',

  // Contract endpoints
  contractInfo: (contractId: string) => `/extended/v1/contract/${contractId}`,
  contractSource: (contractId: string) => `/v2/contracts/source/${contractId.split('.')[0]}/${contractId.split('.')[1]}`,
  contractInterface: (contractId: string) => `/v2/contracts/interface/${contractId.split('.')[0]}/${contractId.split('.')[1]}`,
  contractEvents: (contractId: string) => `/extended/v1/contract/${contractId}/events`,
  contractsDeployed: (address: string) => `/extended/v1/address/${address}/contracts`,
  readOnlyCall: (contractId: string, functionName: string) =>
    `/v2/contracts/call-read/${contractId.split('.')[0]}/${contractId.split('.')[1]}/${functionName}`,
  mapEntry: (contractId: string, mapName: string) =>
    `/v2/map_entry/${contractId.split('.')[0]}/${contractId.split('.')[1]}/${mapName}`,

  // NFT endpoints
  nftHoldings: (address: string) => `/extended/v1/tokens/nft/holdings?principal=${address}`,
  nftHistory: (assetIdentifier: string, value: string) =>
    `/extended/v1/tokens/nft/history?asset_identifier=${assetIdentifier}&value=${value}`,
  nftMints: (assetIdentifier: string) => `/extended/v1/tokens/nft/mints?asset_identifier=${assetIdentifier}`,

  // Fungible token endpoints
  ftHoldings: (address: string) => `/extended/v1/address/${address}/balances`,
  ftMetadata: (contractId: string) => `/metadata/v1/ft/${contractId}`,
  ftHolders: (token: string) => `/extended/v1/tokens/ft/${token}/holders`,

  // Stacking endpoints
  poxInfo: '/v2/pox',
  poxCycle: (cycleNumber: number) => `/extended/v1/pox/cycle/${cycleNumber}`,
  poxCycles: '/extended/v1/pox/cycles',
  stackerInfo: (address: string) => `/extended/v1/pox/stacker/${address}`,

  // sBTC endpoints
  sbtcBalance: (address: string) => `/extended/v1/address/${address}/balances`,

  // BNS endpoints
  bnsNames: (address: string) => `/v1/addresses/stacks/${address}`,
  bnsName: (name: string) => `/v1/names/${name}`,
  bnsNameInfo: (name: string) => `/v1/names/${name}`,
  bnsZoneFile: (name: string) => `/v1/names/${name}/zonefile`,
  bnsSubdomains: (name: string) => `/v1/names/${name}/subdomains`,
  bnsNamespaces: '/v1/namespaces',
  bnsNamespace: (namespace: string) => `/v1/namespaces/${namespace}`,
  bnsNamespaceNames: (namespace: string) => `/v1/namespaces/${namespace}/names`,
  bnsPrice: (name: string) => `/v2/prices/names/${name}`,

  // Ordinals endpoints (via Hiro Ordinals API)
  ordinalsInscription: (id: string) => `/ordinals/v1/inscriptions/${id}`,
  ordinalsInscriptions: '/ordinals/v1/inscriptions',
  ordinalsInscriptionContent: (id: string) => `/ordinals/v1/inscriptions/${id}/content`,
  ordinalsInscriptionTransfers: (id: string) => `/ordinals/v1/inscriptions/${id}/transfers`,
  ordinalsSatoshi: (ordinal: string) => `/ordinals/v1/sats/${ordinal}`,
  ordinalsBrc20: '/ordinals/v1/brc-20/tokens',
  ordinalsBrc20Token: (ticker: string) => `/ordinals/v1/brc-20/tokens/${ticker}`,
  ordinalsBrc20Holders: (ticker: string) => `/ordinals/v1/brc-20/tokens/${ticker}/holders`,
  ordinalsBrc20Activity: '/ordinals/v1/brc-20/activity',

  // Search endpoints
  search: (query: string) => `/extended/v1/search/${query}`,

  // Info endpoints
  coreInfo: '/v2/info',
  networkBlockTimes: '/extended/v1/info/network_block_times',
  networkBlockTimeTarget: '/extended/v1/info/network_block_time/mainnet',
  stacksTipHeight: '/extended/v1/block?limit=1',
  totalSupply: '/extended/v1/stx_supply',
  totalSupplyPlain: '/extended/v1/stx_supply/total/plain',
  circulatingSupply: '/extended/v1/stx_supply/circulating/plain',

  // Rosetta endpoints
  rosettaNetworkList: '/rosetta/v1/network/list',
  rosettaNetworkOptions: '/rosetta/v1/network/options',
  rosettaNetworkStatus: '/rosetta/v1/network/status',
  rosettaAccountBalance: '/rosetta/v1/account/balance',
  rosettaBlock: '/rosetta/v1/block',
  rosettaBlockTransaction: '/rosetta/v1/block/transaction',
  rosettaMempool: '/rosetta/v1/mempool',
  rosettaMempoolTransaction: '/rosetta/v1/mempool/transaction',
  rosettaConstruction: '/rosetta/v1/construction',
  rosettaSubmit: '/rosetta/v1/construction/submit',
} as const;
