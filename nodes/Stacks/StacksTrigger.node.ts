/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IPollFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IDataObject,
} from 'n8n-workflow';
import axios from 'axios';

// Runtime licensing notice (once per load)
let licenseNoticeLogged = false;
function logLicenseNotice(): void {
  if (!licenseNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeLogged = true;
  }
}

interface ApiResponse<T> {
  results?: T[];
  total?: number;
  limit?: number;
  offset?: number;
}

interface BlockData {
  height: number;
  hash: string;
  block_time: number;
  [key: string]: unknown;
}

interface MicroblockData {
  microblock_hash: string;
  [key: string]: unknown;
}

interface TransactionData {
  tx_id: string;
  tx_type: string;
  [key: string]: unknown;
}

interface EventData {
  event_index: number;
  tx_id?: string;
  [key: string]: unknown;
}

interface PoxInfoData {
  current_cycle?: {
    id: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class StacksTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stacks Trigger',
    name: 'stacksTrigger',
    icon: 'file:stacks.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Trigger workflows on Stacks blockchain events',
    defaults: {
      name: 'Stacks Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'hiroApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'New Block',
            value: 'newBlock',
            description: 'Trigger when a new block is confirmed',
          },
          {
            name: 'New Microblock',
            value: 'newMicroblock',
            description: 'Trigger when a new microblock is created',
          },
          {
            name: 'Address Transaction',
            value: 'addressTransaction',
            description: 'Trigger when an address receives a transaction',
          },
          {
            name: 'Contract Event',
            value: 'contractEvent',
            description: 'Trigger on smart contract events',
          },
          {
            name: 'STX Transfer',
            value: 'stxTransfer',
            description: 'Trigger on STX transfers to/from an address',
          },
          {
            name: 'Mempool Activity',
            value: 'mempoolActivity',
            description: 'Trigger on new mempool transactions',
          },
          {
            name: 'Stacking Event',
            value: 'stackingEvent',
            description: 'Trigger on stacking cycle changes',
          },
        ],
        default: 'newBlock',
        required: true,
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        displayOptions: {
          show: {
            event: ['addressTransaction', 'stxTransfer'],
          },
        },
        default: '',
        required: true,
        placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
        description: 'Stacks address to monitor',
      },
      {
        displayName: 'Contract ID',
        name: 'contractId',
        type: 'string',
        displayOptions: {
          show: {
            event: ['contractEvent'],
          },
        },
        default: '',
        required: true,
        placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name',
        description: 'Contract identifier to monitor',
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    logLicenseNotice();

    const event = this.getNodeParameter('event') as string;
    const webhookData = this.getWorkflowStaticData('node');

    const credentials = await this.getCredentials('hiroApi');
    const apiEndpoint = credentials.apiEndpoint as string || 'mainnet';
    const customEndpoint = credentials.customEndpoint as string | undefined;
    const apiKey = credentials.apiKey as string | undefined;

    let baseUrl: string;
    if (apiEndpoint === 'custom' && customEndpoint) {
      baseUrl = customEndpoint.replace(/\/$/, '');
    } else if (apiEndpoint === 'testnet') {
      baseUrl = 'https://api.testnet.hiro.so';
    } else {
      baseUrl = 'https://api.mainnet.hiro.so';
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['x-hiro-api-key'] = apiKey;
    }

    const makeRequest = async <T>(endpoint: string): Promise<T> => {
      const response = await axios.get<T>(`${baseUrl}${endpoint}`, { headers });
      return response.data;
    };

    try {
      let result: INodeExecutionData[] = [];

      switch (event) {
        case 'newBlock': {
          const response = await makeRequest<ApiResponse<BlockData>>('/extended/v2/blocks?limit=1');
          const latestBlock = response.results?.[0];

          if (latestBlock) {
            const lastBlockHeight = webhookData.lastBlockHeight as number | undefined;

            if (!lastBlockHeight || latestBlock.height > lastBlockHeight) {
              webhookData.lastBlockHeight = latestBlock.height;
              result = [{ json: latestBlock as unknown as IDataObject }];
            }
          }
          break;
        }

        case 'newMicroblock': {
          const response = await makeRequest<ApiResponse<MicroblockData>>('/extended/v1/microblock?limit=1');
          const latestMicroblock = response.results?.[0];

          if (latestMicroblock) {
            const lastMicroblockHash = webhookData.lastMicroblockHash as string | undefined;

            if (!lastMicroblockHash || latestMicroblock.microblock_hash !== lastMicroblockHash) {
              webhookData.lastMicroblockHash = latestMicroblock.microblock_hash;
              result = [{ json: latestMicroblock as unknown as IDataObject }];
            }
          }
          break;
        }

        case 'addressTransaction': {
          const address = this.getNodeParameter('address') as string;
          const response = await makeRequest<ApiResponse<TransactionData>>(`/extended/v1/address/${address}/transactions?limit=5`);
          const transactions = response.results || [];

          const lastTxId = webhookData.lastTxId as string | undefined;
          const newTxs: TransactionData[] = [];

          for (const tx of transactions) {
            if (tx.tx_id === lastTxId) break;
            newTxs.push(tx);
          }

          if (newTxs.length > 0 && transactions.length > 0) {
            webhookData.lastTxId = transactions[0].tx_id;
            result = newTxs.map((tx) => ({ json: tx as unknown as IDataObject }));
          }
          break;
        }

        case 'contractEvent': {
          const contractId = this.getNodeParameter('contractId') as string;
          const response = await makeRequest<ApiResponse<EventData>>(`/extended/v1/contract/${contractId}/events?limit=5`);
          const events = response.results || [];

          const lastEventIndex = webhookData.lastEventIndex as number | undefined;
          const newEvents: EventData[] = [];

          for (const evt of events) {
            if (lastEventIndex !== undefined && evt.event_index <= lastEventIndex) break;
            newEvents.push(evt);
          }

          if (newEvents.length > 0 && events.length > 0) {
            webhookData.lastEventIndex = events[0].event_index;
            result = newEvents.map((evt) => ({ json: evt as unknown as IDataObject }));
          }
          break;
        }

        case 'stxTransfer': {
          const address = this.getNodeParameter('address') as string;
          const response = await makeRequest<ApiResponse<TransactionData>>(`/extended/v1/address/${address}/transactions?limit=10`);
          const transactions = response.results || [];

          const stxTransfers = transactions.filter(
            (tx) => tx.tx_type === 'token_transfer'
          );

          const lastTransferId = webhookData.lastTransferId as string | undefined;
          const newTransfers: TransactionData[] = [];

          for (const tx of stxTransfers) {
            if (tx.tx_id === lastTransferId) break;
            newTransfers.push(tx);
          }

          if (newTransfers.length > 0 && stxTransfers.length > 0) {
            webhookData.lastTransferId = stxTransfers[0].tx_id;
            result = newTransfers.map((tx) => ({ json: tx as unknown as IDataObject }));
          }
          break;
        }

        case 'mempoolActivity': {
          const response = await makeRequest<ApiResponse<TransactionData>>('/extended/v1/tx/mempool?limit=10');
          const transactions = response.results || [];

          const seenTxIds = (webhookData.seenMempoolTxIds as string[]) || [];
          const newTxs = transactions.filter(
            (tx) => !seenTxIds.includes(tx.tx_id)
          );

          if (newTxs.length > 0) {
            const newSeenIds = transactions.slice(0, 50).map((tx) => tx.tx_id);
            webhookData.seenMempoolTxIds = newSeenIds;
            result = newTxs.map((tx) => ({ json: tx as unknown as IDataObject }));
          }
          break;
        }

        case 'stackingEvent': {
          const response = await makeRequest<PoxInfoData>('/v2/pox');
          const currentCycle = response.current_cycle?.id;

          const lastCycleId = webhookData.lastCycleId as number | undefined;

          if (currentCycle !== undefined && currentCycle !== lastCycleId) {
            webhookData.lastCycleId = currentCycle;
            result = [{ json: response as unknown as IDataObject }];
          }
          break;
        }

        default:
          throw new Error(`Unknown event type: ${event}`);
      }

      if (result.length === 0) {
        return null;
      }

      return [result];
    } catch (error) {
      throw new Error(`Stacks Trigger error: ${(error as Error).message}`);
    }
  }
}
