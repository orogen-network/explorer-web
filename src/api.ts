/**
 * Subxt-style RPC client. Currently backed by an in-memory fixture so the
 * explorer UI compiles and renders end-to-end before the chain is live.
 *
 * Real wiring: swap `MockChainApi` for a `@polkadot/api` instance once the
 * runtime metadata is stable (see plan §1.1 G2 milestone).
 */

import { fixture } from "./fixtures";

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  extrinsics: Extrinsic[];
}

export interface Extrinsic {
  hash: string;
  blockNumber: number;
  signer: string;
  call: string;
  success: boolean;
}

export interface Account {
  address: string;
  free: string;
  reserved: string;
}

export interface Operator {
  id: string;
  ss58: string;
  gpuClasses: string[];
  stake: string;
  status: "online" | "offline" | "slashed";
}

export interface Model {
  id: string;
  family: string;
  contentHash: string;
  weightTier: string;
}

export interface SlashEvent {
  block: number;
  operator: string;
  faultCode: string;
  amount: string;
}

export interface DisputeEvent {
  block: number;
  operator: string;
  challenger: string;
  status: "open" | "resolved";
}

export interface ChainApi {
  listBlocks(limit?: number): Promise<Block[]>;
  getBlock(hash: string): Promise<Block | null>;
  getExtrinsic(hash: string): Promise<Extrinsic | null>;
  getAccount(address: string): Promise<Account | null>;
  getOperator(id: string): Promise<Operator | null>;
  getModel(id: string): Promise<Model | null>;
  listSlashes(): Promise<SlashEvent[]>;
  listDisputes(): Promise<DisputeEvent[]>;
}

export class MockChainApi implements ChainApi {
  async listBlocks(limit = 20): Promise<Block[]> {
    return fixture.blocks.slice(0, limit);
  }
  async getBlock(hash: string): Promise<Block | null> {
    return fixture.blocks.find((b) => b.hash === hash) ?? null;
  }
  async getExtrinsic(hash: string): Promise<Extrinsic | null> {
    for (const b of fixture.blocks) {
      const x = b.extrinsics.find((e) => e.hash === hash);
      if (x) return x;
    }
    return null;
  }
  async getAccount(address: string): Promise<Account | null> {
    return fixture.accounts.find((a) => a.address === address) ?? null;
  }
  async getOperator(id: string): Promise<Operator | null> {
    return fixture.operators.find((o) => o.id === id) ?? null;
  }
  async getModel(id: string): Promise<Model | null> {
    return fixture.models.find((m) => m.id === id) ?? null;
  }
  async listSlashes(): Promise<SlashEvent[]> {
    return fixture.slashes;
  }
  async listDisputes(): Promise<DisputeEvent[]> {
    return fixture.disputes;
  }
}

let _api: ChainApi = new MockChainApi();
export function getApi(): ChainApi {
  return _api;
}
export function setApi(a: ChainApi): void {
  _api = a;
}
