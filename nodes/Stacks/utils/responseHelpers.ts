/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Format API response for n8n output
 */
export function formatResponse(data: unknown, itemIndex: number = 0): INodeExecutionData[] {
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      json: item as IDataObject,
      pairedItem: { item: itemIndex },
    }));
  }
  
  return [
    {
      json: data as IDataObject,
      pairedItem: { item: itemIndex },
    },
  ];
}

/**
 * Handle pagination response
 */
export function formatPaginatedResponse(
  data: { results?: unknown[]; total?: number; limit?: number; offset?: number },
  itemIndex: number = 0,
): INodeExecutionData[] {
  const results = data.results || [];
  const items: INodeExecutionData[] = results.map((item) => ({
    json: item as IDataObject,
    pairedItem: { item: itemIndex },
  }));

  // Add pagination metadata to first item if available
  if (items.length > 0 && data.total !== undefined) {
    items[0].json._pagination = {
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      hasMore: (data.offset || 0) + results.length < data.total,
    };
  }

  return items;
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    // Check for axios error structure
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data as { error?: string; message?: string };
      const message = errorData.error || errorData.message || JSON.stringify(errorData);
      throw new Error(`Stacks API Error (${axiosError.response.status}): ${message}`);
    }
    throw error;
  }
  throw new Error(`Unknown error: ${String(error)}`);
}

/**
 * Format balance for display
 */
export function formatBalance(
  balance: { stx?: { balance?: string }; fungible_tokens?: Record<string, unknown> },
): IDataObject {
  const formatted: IDataObject = {};

  if (balance.stx?.balance) {
    const microStx = BigInt(balance.stx.balance);
    formatted.stx = {
      balance: balance.stx.balance,
      balanceFormatted: (Number(microStx) / 1_000_000).toFixed(6) + ' STX',
    };
  }

  if (balance.fungible_tokens) {
    formatted.fungibleTokens = balance.fungible_tokens;
  }

  return formatted;
}

/**
 * Format transaction for display
 */
export function formatTransaction(tx: IDataObject): IDataObject {
  const formatted: IDataObject = { ...tx };

  // Format fee
  if (tx.fee_rate) {
    formatted.feeFormatted = (Number(tx.fee_rate) / 1_000_000).toFixed(6) + ' STX';
  }

  // Format timestamp
  if (tx.burn_block_time) {
    formatted.timestampFormatted = new Date(Number(tx.burn_block_time) * 1000).toISOString();
  }

  return formatted;
}

/**
 * Create empty response
 */
export function emptyResponse(itemIndex: number = 0): INodeExecutionData[] {
  return [
    {
      json: { success: true, message: 'No results found' },
      pairedItem: { item: itemIndex },
    },
  ];
}
