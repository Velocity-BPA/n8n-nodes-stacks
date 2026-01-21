/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
  accountOperations,
  accountFields,
  executeAccountOperation,
  blockOperations,
  blockFields,
  executeBlockOperation,
  burnBlockOperations,
  burnBlockFields,
  executeBurnBlockOperation,
  clarityOperations,
  clarityFields,
  executeClarityOperation,
  contractOperations,
  contractFields,
  executeContractOperation,
  fungibleTokenOperations,
  fungibleTokenFields,
  executeFungibleTokenOperation,
  infoOperations,
  infoFields,
  executeInfoOperation,
  mempoolOperations,
  mempoolFields,
  executeMempoolOperation,
  microblockOperations,
  microblockFields,
  executeMicroblockOperation,
  namesOperations,
  namesFields,
  executeNamesOperation,
  nftOperations,
  nftFields,
  executeNftOperation,
  ordinalsOperations,
  ordinalsFields,
  executeOrdinalsOperation,
  rosettaOperations,
  rosettaFields,
  executeRosettaOperation,
  sbtcOperations,
  sbtcFields,
  executeSbtcOperation,
  searchOperations,
  searchFields,
  executeSearchOperation,
  stackingOperations,
  stackingFields,
  executeStackingOperation,
  tokenTransferOperations,
  tokenTransferFields,
  executeTokenTransferOperation,
  transactionOperations,
  transactionFields,
  executeTransactionOperation,
  utilityOperations,
  utilityFields,
  executeUtilityOperation,
} from './actions';

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

export class Stacks implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stacks',
    name: 'stacks',
    icon: 'file:stacks.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Stacks blockchain',
    defaults: {
      name: 'Stacks',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'hiroApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
            description: 'Account operations',
          },
          {
            name: 'Block',
            value: 'block',
            description: 'Block operations',
          },
          {
            name: 'Burn Block',
            value: 'burnBlock',
            description: 'Bitcoin burn block operations',
          },
          {
            name: 'Clarity',
            value: 'clarity',
            description: 'Clarity value encoding/decoding',
          },
          {
            name: 'Contract',
            value: 'contract',
            description: 'Smart contract operations',
          },
          {
            name: 'Fungible Token',
            value: 'fungibleToken',
            description: 'SIP-010 fungible token operations',
          },
          {
            name: 'Info',
            value: 'info',
            description: 'Network information',
          },
          {
            name: 'Mempool',
            value: 'mempool',
            description: 'Mempool operations',
          },
          {
            name: 'Microblock',
            value: 'microblock',
            description: 'Microblock operations',
          },
          {
            name: 'Names (BNS)',
            value: 'names',
            description: 'Blockchain Naming System operations',
          },
          {
            name: 'NFT',
            value: 'nft',
            description: 'SIP-009 NFT operations',
          },
          {
            name: 'Ordinals',
            value: 'ordinals',
            description: 'Bitcoin Ordinals operations',
          },
          {
            name: 'Rosetta',
            value: 'rosetta',
            description: 'Rosetta API operations',
          },
          {
            name: 'sBTC',
            value: 'sbtc',
            description: 'sBTC token operations',
          },
          {
            name: 'Search',
            value: 'search',
            description: 'Search blockchain data',
          },
          {
            name: 'Stacking',
            value: 'stacking',
            description: 'Stacking (PoX) operations',
          },
          {
            name: 'Token Transfer',
            value: 'tokenTransfer',
            description: 'STX token transfer operations',
          },
          {
            name: 'Transaction',
            value: 'transaction',
            description: 'Transaction operations',
          },
          {
            name: 'Utility',
            value: 'utility',
            description: 'Utility operations',
          },
        ],
        default: 'account',
      },
      // Operations by resource
      ...accountOperations,
      ...blockOperations,
      ...burnBlockOperations,
      ...clarityOperations,
      ...contractOperations,
      ...fungibleTokenOperations,
      ...infoOperations,
      ...mempoolOperations,
      ...microblockOperations,
      ...namesOperations,
      ...nftOperations,
      ...ordinalsOperations,
      ...rosettaOperations,
      ...sbtcOperations,
      ...searchOperations,
      ...stackingOperations,
      ...tokenTransferOperations,
      ...transactionOperations,
      ...utilityOperations,
      // Fields by resource
      ...accountFields,
      ...blockFields,
      ...burnBlockFields,
      ...clarityFields,
      ...contractFields,
      ...fungibleTokenFields,
      ...infoFields,
      ...mempoolFields,
      ...microblockFields,
      ...namesFields,
      ...nftFields,
      ...ordinalsFields,
      ...rosettaFields,
      ...sbtcFields,
      ...searchFields,
      ...stackingFields,
      ...tokenTransferFields,
      ...transactionFields,
      ...utilityFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    logLicenseNotice();

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        let result: INodeExecutionData[] = [];

        switch (resource) {
          case 'account':
            result = await executeAccountOperation.call(this, i);
            break;
          case 'block':
            result = await executeBlockOperation.call(this, i);
            break;
          case 'burnBlock':
            result = await executeBurnBlockOperation.call(this, i);
            break;
          case 'clarity':
            result = await executeClarityOperation.call(this, i);
            break;
          case 'contract':
            result = await executeContractOperation.call(this, i);
            break;
          case 'fungibleToken':
            result = await executeFungibleTokenOperation.call(this, i);
            break;
          case 'info':
            result = await executeInfoOperation.call(this, i);
            break;
          case 'mempool':
            result = await executeMempoolOperation.call(this, i);
            break;
          case 'microblock':
            result = await executeMicroblockOperation.call(this, i);
            break;
          case 'names':
            result = await executeNamesOperation.call(this, i);
            break;
          case 'nft':
            result = await executeNftOperation.call(this, i);
            break;
          case 'ordinals':
            result = await executeOrdinalsOperation.call(this, i);
            break;
          case 'rosetta':
            result = await executeRosettaOperation.call(this, i);
            break;
          case 'sbtc':
            result = await executeSbtcOperation.call(this, i);
            break;
          case 'search':
            result = await executeSearchOperation.call(this, i);
            break;
          case 'stacking':
            result = await executeStackingOperation.call(this, i);
            break;
          case 'tokenTransfer':
            result = await executeTokenTransferOperation.call(this, i);
            break;
          case 'transaction':
            result = await executeTransactionOperation.call(this, i);
            break;
          case 'utility':
            result = await executeUtilityOperation.call(this, i);
            break;
          default:
            throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
        }

        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
