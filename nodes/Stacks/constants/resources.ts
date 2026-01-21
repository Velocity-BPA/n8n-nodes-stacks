/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

export const RESOURCE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Account', value: 'account', description: 'Account balance, nonce, and history operations' },
  { name: 'Transaction', value: 'transaction', description: 'Transaction queries and broadcasting' },
  { name: 'Token Transfer', value: 'tokenTransfer', description: 'STX token transfer operations' },
  { name: 'Fungible Token', value: 'fungibleToken', description: 'SIP-010 fungible token operations' },
  { name: 'NFT', value: 'nft', description: 'SIP-009 NFT operations' },
  { name: 'Contract', value: 'contract', description: 'Smart contract deployment and interaction' },
  { name: 'Clarity', value: 'clarity', description: 'Clarity value encoding and decoding' },
  { name: 'Stacking', value: 'stacking', description: 'Proof of Transfer (PoX) stacking operations' },
  { name: 'sBTC', value: 'sbtc', description: 'sBTC Bitcoin-backed token operations' },
  { name: 'Block', value: 'block', description: 'Block data and queries' },
  { name: 'Burn Block', value: 'burnBlock', description: 'Bitcoin anchor block operations' },
  { name: 'Microblock', value: 'microblock', description: 'Microblock operations' },
  { name: 'Mempool', value: 'mempool', description: 'Mempool transaction monitoring' },
  { name: 'Names (BNS)', value: 'names', description: 'Blockchain Naming System operations' },
  { name: 'Ordinals', value: 'ordinals', description: 'Bitcoin Ordinals inscription operations' },
  { name: 'Search', value: 'search', description: 'Universal blockchain search' },
  { name: 'Info', value: 'info', description: 'Network and blockchain information' },
  { name: 'Rosetta', value: 'rosetta', description: 'Rosetta API standard endpoints' },
  { name: 'Utility', value: 'utility', description: 'Address validation and utility functions' },
];

export const CLARITY_TYPES: INodePropertyOptions[] = [
  { name: 'Int', value: 'int', description: 'Signed 128-bit integer' },
  { name: 'Uint', value: 'uint', description: 'Unsigned 128-bit integer' },
  { name: 'Bool', value: 'bool', description: 'Boolean (true/false)' },
  { name: 'Principal', value: 'principal', description: 'Stacks address or contract identifier' },
  { name: 'Buffer', value: 'buff', description: 'Binary data (hex encoded)' },
  { name: 'String ASCII', value: 'string-ascii', description: 'ASCII string' },
  { name: 'String UTF8', value: 'string-utf8', description: 'UTF-8 string' },
  { name: 'List', value: 'list', description: 'Typed list/array' },
  { name: 'Tuple', value: 'tuple', description: 'Named record/object' },
  { name: 'Optional', value: 'optional', description: 'Optional value (some/none)' },
  { name: 'Response', value: 'response', description: 'Response type (ok/err)' },
];

export const TRANSACTION_TYPES: INodePropertyOptions[] = [
  { name: 'Token Transfer', value: 'token_transfer' },
  { name: 'Smart Contract', value: 'smart_contract' },
  { name: 'Contract Call', value: 'contract_call' },
  { name: 'Poison Microblock', value: 'poison_microblock' },
  { name: 'Coinbase', value: 'coinbase' },
  { name: 'Tenure Change', value: 'tenure_change' },
];

export const TRANSACTION_STATUS: INodePropertyOptions[] = [
  { name: 'Success', value: 'success' },
  { name: 'Abort By Response', value: 'abort_by_response' },
  { name: 'Abort By Post Condition', value: 'abort_by_post_condition' },
  { name: 'Pending', value: 'pending' },
  { name: 'Dropped', value: 'dropped' },
];
