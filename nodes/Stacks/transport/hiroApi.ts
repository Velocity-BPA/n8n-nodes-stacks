/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { API_ENDPOINTS, STACKS_NETWORKS } from '../constants';

export interface HiroApiCredentials {
  apiEndpoint: 'mainnet' | 'testnet' | 'custom';
  customEndpoint?: string;
  apiKey?: string;
}

export class HiroApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(credentials: HiroApiCredentials) {
    this.baseUrl = this.getBaseUrl(credentials);
    
    const config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (credentials.apiKey) {
      config.headers = {
        ...config.headers,
        'x-hiro-api-key': credentials.apiKey,
      };
    }

    this.client = axios.create(config);
  }

  private getBaseUrl(credentials: HiroApiCredentials): string {
    if (credentials.apiEndpoint === 'custom' && credentials.customEndpoint) {
      return credentials.customEndpoint.replace(/\/$/, '');
    }
    return credentials.apiEndpoint === 'testnet'
      ? STACKS_NETWORKS.testnet.coreApiUrl
      : STACKS_NETWORKS.mainnet.coreApiUrl;
  }

  async request<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const response = await this.client.request<T>({
      method,
      url: endpoint,
      data,
      params,
    });
    return response.data;
  }

  // Account endpoints
  async getAccountBalance(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.accountBalance(address));
  }

  async getAccountStxBalance(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.accountStxBalance(address));
  }

  async getAccountTransactions(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.accountTransactions(address), undefined, params);
  }

  async getAccountAssets(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.accountAssets(address));
  }

  async getAccountNonces(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.accountNonces(address));
  }

  async getAccountMempoolTransactions(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.accountMempoolTransactions(address));
  }

  // Transaction endpoints
  async getTransaction(txId: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.transaction(txId));
  }

  async getTransactionRaw(txId: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.transactionRaw(txId));
  }

  async getTransactions(params?: { limit?: number; offset?: number; type?: string[] }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.transactions, undefined, params);
  }

  async broadcastTransaction(txHex: string): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.transactionBroadcast, txHex, undefined);
  }

  async getMempoolTransactions(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.mempoolTransactions, undefined, params);
  }

  // Block endpoints
  async getBlocks(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.blocks, undefined, params);
  }

  async getBlock(hashOrHeight: string | number): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.block(hashOrHeight));
  }

  async getBlockByHeight(height: number): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.blockByHeight(height));
  }

  async getBlockTransactions(hashOrHeight: string | number): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.blockTransactions(hashOrHeight));
  }

  async getLatestBlock(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.latestBlock);
  }

  // Burn block endpoints
  async getBurnBlocks(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.burnBlocks, undefined, params);
  }

  async getBurnBlock(heightOrHash: string | number): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.burnBlock(heightOrHash));
  }

  // Microblock endpoints
  async getMicroblocks(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.microblocks, undefined, params);
  }

  async getMicroblock(hash: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.microblock(hash));
  }

  async getUnanchoredMicroblocks(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.unanchoredMicroblocks);
  }

  // Mempool endpoints
  async getMempoolStats(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.mempoolStats);
  }

  async getDroppedMempool(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.droppedMempool);
  }

  // Contract endpoints
  async getContractInfo(contractId: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.contractInfo(contractId));
  }

  async getContractSource(contractId: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.contractSource(contractId));
  }

  async getContractInterface(contractId: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.contractInterface(contractId));
  }

  async getContractEvents(contractId: string, params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.contractEvents(contractId), undefined, params);
  }

  async getContractsDeployed(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.contractsDeployed(address));
  }

  async callReadOnlyFunction(
    contractId: string,
    functionName: string,
    sender: string,
    args: string[],
  ): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.readOnlyCall(contractId, functionName), {
      sender,
      arguments: args,
    });
  }

  async getMapEntry(contractId: string, mapName: string, key: string): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.mapEntry(contractId, mapName), key);
  }

  // NFT endpoints
  async getNftHoldings(address: string, params?: { limit?: number; offset?: number }): Promise<unknown> {
    const endpoint = `${API_ENDPOINTS.nftHoldings(address)}${params?.limit ? `&limit=${params.limit}` : ''}${params?.offset ? `&offset=${params.offset}` : ''}`;
    return this.request('GET', endpoint);
  }

  async getNftHistory(assetIdentifier: string, value: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.nftHistory(assetIdentifier, value));
  }

  async getNftMints(assetIdentifier: string, params?: { limit?: number; offset?: number }): Promise<unknown> {
    const endpoint = `${API_ENDPOINTS.nftMints(assetIdentifier)}${params?.limit ? `&limit=${params.limit}` : ''}${params?.offset ? `&offset=${params.offset}` : ''}`;
    return this.request('GET', endpoint);
  }

  // Fungible token endpoints
  async getFtHoldings(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ftHoldings(address));
  }

  async getFtMetadata(contractId: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ftMetadata(contractId));
  }

  async getFtHolders(token: string, params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ftHolders(token), undefined, params);
  }

  // Stacking endpoints
  async getPoxInfo(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.poxInfo);
  }

  async getPoxCycle(cycleNumber: number): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.poxCycle(cycleNumber));
  }

  async getPoxCycles(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.poxCycles, undefined, params);
  }

  async getStackerInfo(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.stackerInfo(address));
  }

  // sBTC endpoints
  async getSbtcBalance(address: string): Promise<unknown> {
    const balances = await this.request<{ fungible_tokens: Record<string, unknown> }>('GET', API_ENDPOINTS.sbtcBalance(address));
    // Filter for sBTC token
    const sbtcTokens: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(balances.fungible_tokens || {})) {
      if (key.toLowerCase().includes('sbtc')) {
        sbtcTokens[key] = value;
      }
    }
    return { sbtc_balance: sbtcTokens, raw_balances: balances };
  }

  // BNS endpoints
  async getBnsNames(address: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsNames(address));
  }

  async getBnsName(name: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsName(name));
  }

  async getBnsNameInfo(name: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsNameInfo(name));
  }

  async getBnsZoneFile(name: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsZoneFile(name));
  }

  async getBnsSubdomains(name: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsSubdomains(name));
  }

  async getBnsNamespaces(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsNamespaces);
  }

  async getBnsNamespace(namespace: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsNamespace(namespace));
  }

  async getBnsNamespaceNames(namespace: string, params?: { page?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsNamespaceNames(namespace), undefined, params);
  }

  async getBnsPrice(name: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.bnsPrice(name));
  }

  // Ordinals endpoints
  async getOrdinalsInscription(id: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsInscription(id));
  }

  async getOrdinalsInscriptions(params?: {
    limit?: number;
    offset?: number;
    address?: string;
    mime_type?: string;
  }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsInscriptions, undefined, params);
  }

  async getOrdinalsInscriptionContent(id: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsInscriptionContent(id));
  }

  async getOrdinalsInscriptionTransfers(id: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsInscriptionTransfers(id));
  }

  async getOrdinalsSatoshi(ordinal: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsSatoshi(ordinal));
  }

  async getOrdinalsBrc20Tokens(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsBrc20, undefined, params);
  }

  async getOrdinalsBrc20Token(ticker: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsBrc20Token(ticker));
  }

  async getOrdinalsBrc20Holders(ticker: string, params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsBrc20Holders(ticker), undefined, params);
  }

  async getOrdinalsBrc20Activity(params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.ordinalsBrc20Activity, undefined, params);
  }

  // Search endpoints
  async search(query: string): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.search(encodeURIComponent(query)));
  }

  // Info endpoints
  async getCoreInfo(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.coreInfo);
  }

  async getNetworkBlockTimes(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.networkBlockTimes);
  }

  async getTotalSupply(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.totalSupply);
  }

  async getTotalSupplyPlain(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.totalSupplyPlain);
  }

  async getCirculatingSupply(): Promise<unknown> {
    return this.request('GET', API_ENDPOINTS.circulatingSupply);
  }

  // Rosetta endpoints
  async rosettaNetworkList(): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.rosettaNetworkList, { metadata: {} });
  }

  async rosettaNetworkStatus(networkIdentifier: { blockchain: string; network: string }): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.rosettaNetworkStatus, {
      network_identifier: networkIdentifier,
    });
  }

  async rosettaAccountBalance(
    networkIdentifier: { blockchain: string; network: string },
    accountIdentifier: { address: string },
  ): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.rosettaAccountBalance, {
      network_identifier: networkIdentifier,
      account_identifier: accountIdentifier,
    });
  }

  async rosettaBlock(
    networkIdentifier: { blockchain: string; network: string },
    blockIdentifier: { index?: number; hash?: string },
  ): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.rosettaBlock, {
      network_identifier: networkIdentifier,
      block_identifier: blockIdentifier,
    });
  }

  async rosettaMempool(networkIdentifier: { blockchain: string; network: string }): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.rosettaMempool, {
      network_identifier: networkIdentifier,
    });
  }

  async rosettaSubmit(
    networkIdentifier: { blockchain: string; network: string },
    signedTransaction: string,
  ): Promise<unknown> {
    return this.request('POST', API_ENDPOINTS.rosettaSubmit, {
      network_identifier: networkIdentifier,
      signed_transaction: signedTransaction,
    });
  }
}

export function createHiroApiClient(
  context: IExecuteFunctions | ILoadOptionsFunctions,
): HiroApiClient {
  const credentials = context.getCredentials('hiroApi') as unknown as HiroApiCredentials;
  return new HiroApiClient(credentials);
}

export async function createHiroApiClientAsync(
  context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<HiroApiClient> {
  const credentials = await context.getCredentials('hiroApi') as unknown as HiroApiCredentials;
  return new HiroApiClient(credentials);
}
